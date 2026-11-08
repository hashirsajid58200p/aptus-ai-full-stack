const Groq = require('groq-sdk');
const OpenAI = require('openai');

/**
 * Unified Multi-Model LLM Service
 * Supports Open-Source (Groq/Llama3) and Paid (OpenAI GPT-4o) models,
 * with per-tenant custom API key support from database or environment.
 */
class LLMService {
  constructor(options = {}) {
    this.provider = options.provider || 'groq';
    this.defaultGroqModel = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
    this.model = options.model || (this.provider === 'openai' ? 'gpt-4o' : this.defaultGroqModel);
    this.customApiKey = options.apiKey || null;

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
  async transcribeAudio(buffer, filename = 'recording.webm', mimeType = 'audio/webm') {
    if (!this.groqClient) {
      throw new Error('Groq API key is missing for audio transcription.');
    }
    const file = await Groq.toFile(buffer, filename, { type: mimeType });
    const transcription = await this.groqClient.audio.transcriptions.create({
      file,
      model: 'whisper-large-v3',
    });
    return transcription.text;
  }

  /**
   * List available chat models dynamically for a provider and API key
   */
  static async listModels(provider = 'groq', apiKey = null) {
    if (provider === 'openai') {
      const key = apiKey || process.env.OPENAI_API_KEY;
      if (!key) {
        return [
          { id: 'gpt-4o', name: 'GPT-4o (Omni Flagship)' },
          { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Fast & Cheap)' },
          { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
          { id: 'o1-mini', name: 'o1-mini (Reasoning)' },
        ];
      }
      try {
        const client = new OpenAI({ apiKey: key });
        const res = await client.models.list();
        const models = res.data
          .filter(m => m.id.startsWith('gpt-') || m.id.startsWith('o1') || m.id.startsWith('o3'))
          .map(m => ({ id: m.id, name: m.id }))
          .sort((a, b) => a.id.localeCompare(b.id));
        return models.length > 0 ? models : [
          { id: 'gpt-4o', name: 'GPT-4o' },
          { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
        ];
      } catch (err) {
        throw new Error(`OpenAI API Key verification failed: ${err.message}`);
      }
    } else {
      const key = apiKey || process.env.GROQ_API_KEY;
      if (!key) {
        return [
          { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile' },
          { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant' },
          { id: 'openai/gpt-oss-120b', name: 'GPT OSS 120B' },
          { id: 'openai/gpt-oss-20b', name: 'GPT OSS 20B' },
        ];
      }
      try {
        const client = new Groq({ apiKey: key });
        const res = await client.models.list();
        const filtered = res.data
          .filter(m => m.active && !m.id.includes('whisper') && !m.id.includes('guard') && !m.id.includes('safeguard'))
          .map(m => ({ id: m.id, name: m.id }));
        return filtered.length > 0 ? filtered : [
          { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile' },
          { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant' },
        ];
      } catch (err) {
        throw new Error(`Groq API Key verification failed: ${err.message}`);
      }
    }
  }

  /**
   * Estimate token count (rough heuristic: ~4 characters per token)
   */
  estimateTokens(text) {
    if (!text || typeof text !== 'string') return 0;
    return Math.max(1, Math.ceil(text.length / 4));
  }

  /**
   * Generate text response across configured provider
   * @param {string} prompt - Prompt or user query
   * @param {Object} options - Override options (model, temperature, max_tokens, systemPrompt)
   * @returns {Promise<{text: string, usage: {promptTokens: number, completionTokens: number, totalTokens: number}}>}
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
      if (!client) {
        throw new Error('OpenAI API key is missing. Please provide an OpenAI API key in your chatbot settings or environment.');
      }

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

      console.log(`✅ OpenAI responded successfully (tokens: ${totalTokens})`);
      return {
        text: content,
        usage: { promptTokens, completionTokens, totalTokens },
      };
    } else {
      // Default: Groq
      const client = options.apiKey ? new Groq({ apiKey: options.apiKey }) : this.groqClient;
      if (!client) {
        throw new Error('Groq API key is missing. Please check GROQ_API_KEY in environment or provide custom key.');
      }

      let groqModel = model.includes('gpt-4o') ? this.defaultGroqModel : model;
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

      console.log(`✅ Groq responded successfully (tokens: ${totalTokens})`);
      return {
        text: content,
        usage: { promptTokens, completionTokens, totalTokens },
      };
    }
  }

  /**
   * Gemini-compatible structured content generation format
   * Supports legacy calls from existing controllers
   */
  async generateContent(contentData, options = {}) {
    let prompt = '';
    let systemPrompt = '';

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
        candidates: [
          {
            content: {
              parts: [{ text: res.text }],
            },
          },
        ],
      },
    };
  }
}

module.exports = LLMService;
