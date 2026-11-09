const Groq = require('groq-sdk');
const OpenAI = require('openai');

/**
 * Unified Multi-Model LLM Service
 * Supports Groq, OpenAI, Anthropic Claude, xAI Grok, OpenRouter, and Custom Endpoints
 */
class LLMService {
  constructor(options = {}) {
    this.provider = options.provider || 'groq';
    this.defaultGroqModel = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
    this.model = options.model || (this.provider === 'openai' ? 'gpt-4o' : this.defaultGroqModel);
    this.customApiKey = options.apiKey || null;
    this.customBaseUrl = options.customBaseUrl || null;

    // Groq client
    const groqKey = this.provider === 'groq' && this.customApiKey ? this.customApiKey : process.env.GROQ_API_KEY;
    this.groqClient = groqKey ? new Groq({ apiKey: groqKey }) : null;

    // OpenAI client
    const openaiKey = this.provider === 'openai' && this.customApiKey ? this.customApiKey : process.env.OPENAI_API_KEY;
    this.openaiClient = openaiKey ? new OpenAI({ apiKey: openaiKey }) : null;
  }

  /**
   * Transcribe audio buffer using Groq Whisper (whisper-large-v3)
   */
  async transcribeAudio(buffer, filename = 'recording.webm', mimeType = 'audio/webm', options = {}) {
    if (!this.groqClient) {
      throw new Error('Groq API key is missing for audio transcription.');
    }
    const file = await Groq.toFile(buffer, filename, { type: mimeType });
    const payload = {
      file,
      model: 'whisper-large-v3',
      temperature: 0.0,
      response_format: 'json',
    };
    if (options.prompt) {
      payload.prompt = options.prompt;
    }
    if (options.language) {
      payload.language = options.language;
    }

    const transcription = await this.groqClient.audio.transcriptions.create(payload);
    return transcription.text;
  }

  /**
   * List available chat models dynamically for a provider, key, and baseUrl
   */
  static async listModels(provider = 'groq', apiKey = null, customBaseUrl = null) {
    if (provider === 'openai') {
      const key = apiKey || process.env.OPENAI_API_KEY;
      if (!key) return [];
      try {
        const client = new OpenAI({ apiKey: key });
        const res = await client.models.list();
        return res.data
          .filter(m => m.id.startsWith('gpt-') || m.id.startsWith('o1') || m.id.startsWith('o3'))
          .map(m => ({ id: m.id, name: m.id }))
          .sort((a, b) => a.id.localeCompare(b.id));
      } catch (err) {
        throw new Error(`OpenAI API Key verification failed: ${err.message}`);
      }
    } else if (provider === 'anthropic') {
      if (!apiKey) return [];
      try {
        const res = await fetch('https://api.anthropic.com/v1/models', {
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
        });
        const data = await res.json();
        if (Array.isArray(data.data)) {
          return data.data.map(m => ({ id: m.id, name: m.display_name || m.id }));
        }
      } catch (e) {}
      return [];
    } else if (provider === 'xai') {
      if (!apiKey) return [];
      try {
        const client = new OpenAI({ apiKey: apiKey, baseURL: 'https://api.x.ai/v1' });
        const res = await client.models.list();
        if (Array.isArray(res.data)) {
          return res.data.map(m => ({ id: m.id, name: m.id }));
        }
      } catch (e) {}
      return [];
    } else if (provider === 'openrouter') {
      if (!apiKey) return [];
      try {
        const res = await fetch('https://openrouter.ai/api/v1/models', {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const data = await res.json();
        if (Array.isArray(data.data)) {
          return data.data
            .slice(0, 50)
            .map(m => ({ id: m.id, name: m.name || m.id }));
        }
      } catch (e) {}
      return [];
    } else if (provider === 'custom') {
      if (!customBaseUrl) return [];
      try {
        const client = new OpenAI({ apiKey: apiKey || 'dummy-key', baseURL: customBaseUrl });
        const res = await client.models.list();
        if (Array.isArray(res.data)) {
          return res.data.map(m => ({ id: m.id, name: m.id }));
        }
      } catch (e) {}
      return [];
    } else {
      // Groq
      const key = apiKey || process.env.GROQ_API_KEY;
      if (!key) return [];
      try {
        const client = new Groq({ apiKey: key });
        const res = await client.models.list();
        return res.data
          .filter(m => m.active && !m.id.includes('whisper') && !m.id.includes('guard') && !m.id.includes('safeguard'))
          .map(m => ({ id: m.id, name: m.id }))
          .sort((a, b) => a.id.localeCompare(b.id));
      } catch (err) {
        throw new Error(`Groq API Key verification failed: ${err.message}`);
      }
    }
  }

  estimateTokens(text) {
    if (!text || typeof text !== 'string') return 0;
    return Math.max(1, Math.ceil(text.length / 4));
  }

  /**
   * Generate text response across configured provider
   */
  async generateText(prompt, options = {}) {
    const provider = options.provider || this.provider;
    const model = options.model || this.model;
    const temperature = options.temperature !== undefined ? options.temperature : 0.7;
    const maxTokens = options.max_tokens || 1024;
    const systemPrompt = options.systemPrompt || '';

    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    if (provider === 'openai') {
      const client = options.apiKey ? new OpenAI({ apiKey: options.apiKey }) : this.openaiClient;
      if (!client) throw new Error('OpenAI API key is missing.');

      console.log(`🟢 Calling OpenAI API (model: ${model})...`);
      const response = await client.chat.completions.create({
        model: model || 'gpt-4o',
        messages,
        temperature,
        max_tokens: maxTokens,
      });

      const content = response.choices[0]?.message?.content || '';
      const promptTokens = response.usage?.prompt_tokens || this.estimateTokens(prompt);
      const completionTokens = response.usage?.completion_tokens || this.estimateTokens(content);
      const totalTokens = response.usage?.total_tokens || (promptTokens + completionTokens);

      return { text: content, usage: { promptTokens, completionTokens, totalTokens } };

    } else if (provider === 'anthropic') {
      const apiKey = options.apiKey || this.customApiKey || process.env.ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error('Anthropic API key is missing.');

      console.log(`🟢 Calling Anthropic Claude API (model: ${model})...`);
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: model || 'claude-3-5-sonnet-20241022',
          max_tokens: maxTokens,
          temperature,
          system: systemPrompt || undefined,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Anthropic API request failed');
      }

      const content = data.content?.[0]?.text || '';
      const promptTokens = data.usage?.input_tokens || this.estimateTokens(prompt);
      const completionTokens = data.usage?.output_tokens || this.estimateTokens(content);
      return { text: content, usage: { promptTokens, completionTokens, totalTokens: promptTokens + completionTokens } };

    } else if (provider === 'xai') {
      const apiKey = options.apiKey || this.customApiKey || process.env.XAI_API_KEY;
      if (!apiKey) throw new Error('xAI API key is missing.');

      console.log(`🟢 Calling xAI Grok API (model: ${model})...`);
      const client = new OpenAI({ apiKey, baseURL: 'https://api.x.ai/v1' });
      const response = await client.chat.completions.create({
        model: model || 'grok-2-1212',
        messages,
        temperature,
        max_tokens: maxTokens,
      });

      const content = response.choices[0]?.message?.content || '';
      const promptTokens = response.usage?.prompt_tokens || this.estimateTokens(prompt);
      const completionTokens = response.usage?.completion_tokens || this.estimateTokens(content);
      const totalTokens = response.usage?.total_tokens || (promptTokens + completionTokens);

      return { text: content, usage: { promptTokens, completionTokens, totalTokens } };

    } else if (provider === 'openrouter') {
      const apiKey = options.apiKey || this.customApiKey || process.env.OPENROUTER_API_KEY;
      if (!apiKey) throw new Error('OpenRouter API key is missing.');

      console.log(`🟢 Calling OpenRouter API (model: ${model})...`);
      const client = new OpenAI({
        apiKey,
        baseURL: 'https://openrouter.ai/api/v1',
        defaultHeaders: {
          'HTTP-Referer': 'https://aptus.ai',
          'X-Title': 'Aptus AI Platform',
        },
      });

      const response = await client.chat.completions.create({
        model: model || 'anthropic/claude-3.5-sonnet',
        messages,
        temperature,
        max_tokens: maxTokens,
      });

      const content = response.choices[0]?.message?.content || '';
      const promptTokens = response.usage?.prompt_tokens || this.estimateTokens(prompt);
      const completionTokens = response.usage?.completion_tokens || this.estimateTokens(content);
      const totalTokens = response.usage?.total_tokens || (promptTokens + completionTokens);

      return { text: content, usage: { promptTokens, completionTokens, totalTokens } };

    } else if (provider === 'custom') {
      const apiKey = options.apiKey || this.customApiKey || 'dummy-key';
      const baseURL = options.customBaseUrl || this.customBaseUrl;
      if (!baseURL) throw new Error('Custom provider Base URL is missing.');

      console.log(`🟢 Calling Custom API (${baseURL}) model: ${model}...`);
      const client = new OpenAI({ apiKey, baseURL });
      const response = await client.chat.completions.create({
        model: model || 'default',
        messages,
        temperature,
        max_tokens: maxTokens,
      });

      const content = response.choices[0]?.message?.content || '';
      const promptTokens = response.usage?.prompt_tokens || this.estimateTokens(prompt);
      const completionTokens = response.usage?.completion_tokens || this.estimateTokens(content);
      const totalTokens = response.usage?.total_tokens || (promptTokens + completionTokens);

      return { text: content, usage: { promptTokens, completionTokens, totalTokens } };

    } else {
      // Default: Groq
      const client = options.apiKey ? new Groq({ apiKey: options.apiKey }) : this.groqClient;
      if (!client) {
        throw new Error('Groq API key is missing.');
      }

      let groqModel = model.includes('gpt-4o') || model.includes('claude') || model.includes('grok')
        ? this.defaultGroqModel
        : model;

      console.log(`🟢 Calling Groq API (model: ${groqModel})...`);
      let response;
      try {
        response = await client.chat.completions.create({
          model: groqModel,
          messages,
          temperature,
          max_tokens: maxTokens,
        });
      } catch (err) {
        if (err.status === 404 && groqModel !== 'openai/gpt-oss-120b') {
          console.warn(`⚠️ Model "${groqModel}" not found on Groq. Automatically falling back to "openai/gpt-oss-120b"...`);
          response = await client.chat.completions.create({
            model: 'openai/gpt-oss-120b',
            messages,
            temperature,
            max_tokens: maxTokens,
          });
        } else {
          throw err;
        }
      }

      const content = response.choices[0]?.message?.content || '';
      const promptTokens = response.usage?.prompt_tokens || this.estimateTokens(prompt);
      const completionTokens = response.usage?.completion_tokens || this.estimateTokens(content);
      const totalTokens = response.usage?.total_tokens || (promptTokens + completionTokens);

      return { text: content, usage: { promptTokens, completionTokens, totalTokens } };
    }
  }

  async generateContent(contentData, options = {}) {
    let prompt = '';
    if (contentData.contents && Array.isArray(contentData.contents)) {
      for (const item of contentData.contents) {
        if (item.parts && Array.isArray(item.parts)) {
          const texts = item.parts.map(p => p.text).filter(Boolean);
          prompt += (prompt ? '\n\n' : '') + texts.join('\n\n');
        }
      }
    } else {
      prompt = contentData.prompt || contentData.text || JSON.stringify(contentData);
    }

    const res = await this.generateText(prompt, options);

    return {
      text: res.text,
      usage: res.usage,
      response: {
        candidates: [{ content: { parts: [{ text: res.text }] } }],
      },
    };
  }
}

module.exports = LLMService;
