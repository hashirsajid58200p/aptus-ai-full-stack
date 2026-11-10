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

  static catalogCache = null;
  static catalogLastFetched = 0;

  static PROVIDER_CATALOG_MAP = {
    groq: 'groq',
    gemini: 'google',
    openai: 'openai',
    anthropic: 'anthropic',
    deepseek: 'deepseek',
    mistral: 'mistral',
    xai: 'xai',
    cohere: 'cohere',
    perplexity: 'perplexity',
    openrouter: 'openrouter',
  };

  /**
   * Fetch and cache the universal models.dev capability registry (1 hour TTL)
   */
  static async getModelCatalog() {
    const now = Date.now();
    if (this.catalogCache && (now - this.catalogLastFetched < 3600000)) {
      return this.catalogCache;
    }
    try {
      const res = await fetch('https://models.dev/api.json', {
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        this.catalogCache = await res.json();
        this.catalogLastFetched = now;
        return this.catalogCache;
      }
    } catch (e) {
      console.warn('⚠️ models.dev catalog fetch warning:', e.message);
    }
    return this.catalogCache || {};
  }

  /**
   * Universal capability predicate: determines if a model is a pure conversational Chat LLM
   */
  static isPureChatModel(modelId, rawName = '', catalogEntry = null) {
    // 1. Authoritative structured capability schema from models.dev
    if (catalogEntry) {
      if (catalogEntry.type && catalogEntry.type !== 'chat') return false;
      if (catalogEntry.temperature === false) return false;
      const out = catalogEntry.modalities?.output || [];
      if (out.length !== 1 || out[0] !== 'text') return false;
      const inp = catalogEntry.modalities?.input || [];
      if (!inp.includes('text')) return false;
    }

    // 2. Universal heuristic safety net for unlisted/preview endpoints
    const combined = `${modelId} ${rawName}`.toLowerCase();
    const nonChatPatterns = [
      'tts', 'whisper', 'orpheus', 'guard', 'safeguard', 'embed',
      'lyria', 'banana', 'image', 'imagen', 'audio', 'transcribe',
      'robotics', 'computer-use', 'moderation', 'realtime', 'dall-e',
      'clip', 'rerank', 'aqa', 'customtools', 'antigravity', 'deep-research',
      'argon', 'vision-only', 'babbage', 'davinci', 'ocr', 'codex-mini'
    ];
    return !nonChatPatterns.some(p => combined.includes(p));
  }

  /**
   * Normalize, filter, and enrich raw provider models using models.dev capability metadata
   */
  static enrichAndFilterModels(rawModels, providerCatalog = {}, provider = 'groq') {
    const seen = new Set();
    const result = [];
    for (const item of rawModels) {
      const cleanId = (item.id || '').replace(/^models\//, '');
      if (!cleanId || seen.has(cleanId)) continue;
      const meta = providerCatalog[cleanId] || null;
      if (!this.isPureChatModel(cleanId, item.name || '', meta)) continue;
      seen.add(cleanId);
      result.push({
        id: cleanId,
        name: meta?.name || item.name || cleanId,
        provider,
        contextWindow: meta?.limit?.context || item.contextWindow || null,
        reasoning: !!meta?.reasoning,
      });
    }
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * List available pure chat models dynamically for a provider, key, and baseUrl
   */
  static async listModels(provider = 'groq', apiKey = null, customBaseUrl = null) {
    const catalog = await this.getModelCatalog();
    const catalogKey = this.PROVIDER_CATALOG_MAP[provider] || provider;
    const providerCatalog = catalog[catalogKey]?.models || {};

    const getCatalogFallback = () => {
      const entries = Object.values(providerCatalog);
      return this.enrichAndFilterModels(
        entries.map(m => ({ id: m.id, name: m.name })),
        providerCatalog,
        provider
      );
    };

    if (provider === 'openai') {
      if (!apiKey) return [];
      try {
        const client = new OpenAI({ apiKey });
        const res = await client.models.list();
        const raw = res.data
          .filter(m => m.id.startsWith('gpt-') || m.id.startsWith('o1') || m.id.startsWith('o3') || m.id.startsWith('chatgpt-'))
          .map(m => ({ id: m.id, name: m.id }));
        return this.enrichAndFilterModels(raw, providerCatalog, provider);
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
          const raw = data.data.map(m => ({ id: m.id, name: m.display_name || m.id }));
          return this.enrichAndFilterModels(raw, providerCatalog, provider);
        }
      } catch (e) {}
      return getCatalogFallback();
    } else if (provider === 'xai') {
      if (!apiKey) return [];
      try {
        const client = new OpenAI({ apiKey: apiKey, baseURL: 'https://api.x.ai/v1' });
        const res = await client.models.list();
        if (Array.isArray(res.data)) {
          const raw = res.data.map(m => ({ id: m.id, name: m.id }));
          return this.enrichAndFilterModels(raw, providerCatalog, provider);
        }
      } catch (e) {}
      return getCatalogFallback();
    } else if (provider === 'openrouter') {
      if (!apiKey) return [];
      try {
        const res = await fetch('https://openrouter.ai/api/v1/models?output_modalities=text', {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const data = await res.json();
        if (Array.isArray(data.data)) {
          const raw = data.data
            .filter(m => {
              const out = m.architecture?.output_modalities || [];
              if (out.length > 0 && (out.length !== 1 || out[0] !== 'text')) return false;
              return true;
            })
            .slice(0, 60)
            .map(m => ({ id: m.id, name: m.name || m.id, contextWindow: m.context_length }));
          return this.enrichAndFilterModels(raw, providerCatalog, provider);
        }
      } catch (e) {}
      return [];
    } else if (provider === 'gemini') {
      if (!apiKey) return [];
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await res.json();
        if (data.models && Array.isArray(data.models)) {
          const raw = data.models
            .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
            .map(m => ({
              id: m.name.replace('models/', ''),
              name: m.displayName || m.name.replace('models/', ''),
              contextWindow: m.inputTokenLimit,
            }));
          return this.enrichAndFilterModels(raw, providerCatalog, provider);
        } else if (data.error) {
          throw new Error(data.error.message);
        }
      } catch (err) {
        throw new Error(`Google Gemini API verification failed: ${err.message}`);
      }
      return getCatalogFallback();
    } else if (provider === 'deepseek') {
      if (!apiKey) return [];
      try {
        const client = new OpenAI({ apiKey, baseURL: 'https://api.deepseek.com' });
        const res = await client.models.list();
        if (Array.isArray(res.data) && res.data.length > 0) {
          const raw = res.data.map(m => ({ id: m.id, name: m.id }));
          return this.enrichAndFilterModels(raw, providerCatalog, provider);
        }
      } catch (e) {}
      const fallback = getCatalogFallback();
      return fallback.length > 0 ? fallback : [
        { id: 'deepseek-chat', name: 'DeepSeek-V3 (deepseek-chat)', provider: 'deepseek' },
        { id: 'deepseek-reasoner', name: 'DeepSeek-R1 (deepseek-reasoner)', provider: 'deepseek', reasoning: true },
      ];
    } else if (provider === 'mistral') {
      if (!apiKey) return [];
      try {
        const client = new OpenAI({ apiKey, baseURL: 'https://api.mistral.ai/v1' });
        const res = await client.models.list();
        if (Array.isArray(res.data) && res.data.length > 0) {
          const raw = res.data.map(m => ({ id: m.id, name: m.id }));
          return this.enrichAndFilterModels(raw, providerCatalog, provider);
        }
      } catch (e) {}
      return getCatalogFallback();
    } else if (provider === 'perplexity') {
      if (!apiKey) return [];
      const fallback = getCatalogFallback();
      return fallback.length > 0 ? fallback : [
        { id: 'sonar', name: 'Sonar (8B Online Search)', provider: 'perplexity' },
        { id: 'sonar-pro', name: 'Sonar Pro (70B Online Search)', provider: 'perplexity' },
        { id: 'sonar-reasoning-pro', name: 'Sonar Reasoning Pro', provider: 'perplexity', reasoning: true },
      ];
    } else if (provider === 'cohere') {
      if (!apiKey) return [];
      const fallback = getCatalogFallback();
      return fallback.length > 0 ? fallback : [
        { id: 'command-r-plus-08-2024', name: 'Command R+ (Enterprise)', provider: 'cohere' },
        { id: 'command-a-03-2025', name: 'Command A', provider: 'cohere' },
      ];
    } else if (provider === 'custom') {
      if (!customBaseUrl) return [];
      try {
        const client = new OpenAI({ apiKey: apiKey || 'dummy-key', baseURL: customBaseUrl });
        const res = await client.models.list();
        if (Array.isArray(res.data)) {
          const raw = res.data.map(m => ({ id: m.id, name: m.id }));
          return this.enrichAndFilterModels(raw, {}, provider);
        }
      } catch (e) {}
      return [];
    } else {
      // Groq
      const effectiveKey = apiKey || process.env.GROQ_API_KEY;
      if (!effectiveKey) return [];
      try {
        const client = new Groq({ apiKey: effectiveKey });
        const res = await client.models.list();
        const raw = res.data
          .filter(m => m.active)
          .map(m => ({ id: m.id, name: m.id, contextWindow: m.context_window }));
        return this.enrichAndFilterModels(raw, providerCatalog, 'groq');
      } catch (err) {
        throw new Error(`Groq API Key verification failed: ${err.message}`);
      }
    }
  }

  /**
   * Fetch all available pure-chat models across ALL providers configured by the user in parallel
   */
  static async listAllConnectedModels(user) {
    const providerKeyMap = {
      groq: user?.groqApiKey,
      gemini: user?.geminiApiKey,
      deepseek: user?.deepseekApiKey,
      openai: user?.openaiApiKey,
      anthropic: user?.anthropicApiKey,
      mistral: user?.mistralApiKey,
      perplexity: user?.perplexityApiKey,
      cohere: user?.cohereApiKey,
      xai: user?.xaiApiKey,
      openrouter: user?.openrouterApiKey,
      custom: user?.customBaseUrl ? (user?.customApiKey || 'dummy-key') : null,
    };

    const connectedProviders = Object.entries(providerKeyMap)
      .filter(([, key]) => !!key)
      .map(([prov]) => prov);

    const tasks = connectedProviders.map(async (prov) => {
      try {
        const models = await this.listModels(prov, providerKeyMap[prov], user?.customBaseUrl);
        return { provider: prov, models };
      } catch (e) {
        return { provider: prov, models: [], error: e.message };
      }
    });

    const results = await Promise.all(tasks);
    const allModels = [];
    const modelsByProvider = {};

    for (const r of results) {
      modelsByProvider[r.provider] = r.models;
      allModels.push(...r.models);
    }

    return {
      connectedProviders,
      modelsByProvider,
      models: allModels,
    };
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

    } else if (provider === 'gemini') {
      const apiKey = options.apiKey || this.customApiKey || process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('Google Gemini API key is missing.');

      console.log(`🟢 Calling Google Gemini API (model: ${model})...`);
      const geminiModel = model || 'gemini-1.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text: (systemPrompt ? `System Instructions: ${systemPrompt}\n\n` : '') + prompt }]
          }],
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
          }
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Gemini API request failed');
      }

      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const promptTokens = data.usageMetadata?.promptTokenCount || this.estimateTokens(prompt);
      const completionTokens = data.usageMetadata?.candidatesTokenCount || this.estimateTokens(content);
      return { text: content, usage: { promptTokens, completionTokens, totalTokens: promptTokens + completionTokens } };

    } else if (provider === 'deepseek') {
      const apiKey = options.apiKey || this.customApiKey || process.env.DEEPSEEK_API_KEY;
      if (!apiKey) throw new Error('DeepSeek API key is missing.');

      console.log(`🟢 Calling DeepSeek API (model: ${model})...`);
      const client = new OpenAI({ apiKey, baseURL: 'https://api.deepseek.com' });
      const response = await client.chat.completions.create({
        model: model || 'deepseek-chat',
        messages,
        temperature,
        max_tokens: maxTokens,
      });

      const content = response.choices[0]?.message?.content || '';
      const promptTokens = response.usage?.prompt_tokens || this.estimateTokens(prompt);
      const completionTokens = response.usage?.completion_tokens || this.estimateTokens(content);
      const totalTokens = response.usage?.total_tokens || (promptTokens + completionTokens);
      return { text: content, usage: { promptTokens, completionTokens, totalTokens } };

    } else if (provider === 'mistral') {
      const apiKey = options.apiKey || this.customApiKey || process.env.MISTRAL_API_KEY;
      if (!apiKey) throw new Error('Mistral API key is missing.');

      console.log(`🟢 Calling Mistral API (model: ${model})...`);
      const client = new OpenAI({ apiKey, baseURL: 'https://api.mistral.ai/v1' });
      const response = await client.chat.completions.create({
        model: model || 'mistral-large-latest',
        messages,
        temperature,
        max_tokens: maxTokens,
      });

      const content = response.choices[0]?.message?.content || '';
      const promptTokens = response.usage?.prompt_tokens || this.estimateTokens(prompt);
      const completionTokens = response.usage?.completion_tokens || this.estimateTokens(content);
      const totalTokens = response.usage?.total_tokens || (promptTokens + completionTokens);
      return { text: content, usage: { promptTokens, completionTokens, totalTokens } };

    } else if (provider === 'perplexity') {
      const apiKey = options.apiKey || this.customApiKey || process.env.PERPLEXITY_API_KEY;
      if (!apiKey) throw new Error('Perplexity API key is missing.');

      console.log(`🟢 Calling Perplexity API (model: ${model})...`);
      const client = new OpenAI({ apiKey, baseURL: 'https://api.perplexity.ai' });
      const response = await client.chat.completions.create({
        model: model || 'sonar',
        messages,
        temperature,
        max_tokens: maxTokens,
      });

      const content = response.choices[0]?.message?.content || '';
      const promptTokens = response.usage?.prompt_tokens || this.estimateTokens(prompt);
      const completionTokens = response.usage?.completion_tokens || this.estimateTokens(content);
      const totalTokens = response.usage?.total_tokens || (promptTokens + completionTokens);
      return { text: content, usage: { promptTokens, completionTokens, totalTokens } };

    } else if (provider === 'cohere') {
      const apiKey = options.apiKey || this.customApiKey || process.env.COHERE_API_KEY;
      if (!apiKey) throw new Error('Cohere API key is missing.');

      console.log(`🟢 Calling Cohere API (model: ${model})...`);
      const client = new OpenAI({ apiKey, baseURL: 'https://api.cohere.ai/compatibility/v1' });
      const response = await client.chat.completions.create({
        model: model || 'command-r',
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
        if (groqModel !== 'openai/gpt-oss-120b') {
          console.warn(`⚠️ Model "${groqModel}" failed on Groq (${err.message}). Automatically falling back to "openai/gpt-oss-120b"...`);
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
