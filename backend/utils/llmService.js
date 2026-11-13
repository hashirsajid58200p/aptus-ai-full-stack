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

  // In-memory cache for dynamic provider models (TTL: 15 minutes)
  static modelsCache = new Map();
  static CACHE_TTL = 15 * 60 * 1000;

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
   * Curated default models for each provider when API key is unconfigured
   * or when provider endpoints are unreachable/down.
   */
  static CURATED_FALLBACK_MODELS = {
    groq: [
      { id: 'openai/gpt-oss-120b', name: 'GPT OSS 120B (Groq)', provider: 'groq', contextWindow: 131072, reasoning: true },
      { id: 'openai/gpt-oss-20b', name: 'GPT OSS 20B (Groq)', provider: 'groq', contextWindow: 131072, reasoning: true },
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile', provider: 'groq', contextWindow: 131072 },
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant', provider: 'groq', contextWindow: 131072 },
      { id: 'deepseek-r1-distill-llama-70b', name: 'DeepSeek R1 Distill Llama 70B', provider: 'groq', contextWindow: 131072, reasoning: true },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', provider: 'groq', contextWindow: 32768 },
      { id: 'gemma2-9b-it', name: 'Gemma 2 9B IT', provider: 'groq', contextWindow: 8192 },
      { id: 'qwen-2.5-32b', name: 'Qwen 2.5 32B', provider: 'groq', contextWindow: 32768 },
    ],
    openai: [
      { id: 'gpt-4o', name: 'GPT-4o (Omni)', provider: 'openai', contextWindow: 128000 },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', contextWindow: 128000 },
      { id: 'o1', name: 'o1 Reasoning Model', provider: 'openai', contextWindow: 200000, reasoning: true },
      { id: 'o1-mini', name: 'o1 Mini', provider: 'openai', contextWindow: 128000, reasoning: true },
      { id: 'o3-mini', name: 'o3 Mini', provider: 'openai', contextWindow: 200000, reasoning: true },
      { id: 'chatgpt-4o-latest', name: 'ChatGPT 4o Latest', provider: 'openai', contextWindow: 128000 },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai', contextWindow: 128000 },
    ],
    gemini: [
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'gemini', contextWindow: 1048576 },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'gemini', contextWindow: 2097152 },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'gemini', contextWindow: 1048576 },
      { id: 'gemini-2.0-flash-thinking-exp-01-21', name: 'Gemini 2.0 Flash Thinking Exp', provider: 'gemini', contextWindow: 1048576, reasoning: true },
      { id: 'gemini-2.0-pro-exp-02-05', name: 'Gemini 2.0 Pro Experimental', provider: 'gemini', contextWindow: 2097152 },
    ],
    anthropic: [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', provider: 'anthropic', contextWindow: 200000 },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', provider: 'anthropic', contextWindow: 200000 },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', provider: 'anthropic', contextWindow: 200000 },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', provider: 'anthropic', contextWindow: 200000 },
    ],
    deepseek: [
      { id: 'deepseek-chat', name: 'DeepSeek-V3 (deepseek-chat)', provider: 'deepseek', contextWindow: 64000 },
      { id: 'deepseek-reasoner', name: 'DeepSeek-R1 (deepseek-reasoner)', provider: 'deepseek', contextWindow: 64000, reasoning: true },
    ],
    mistral: [
      { id: 'mistral-large-latest', name: 'Mistral Large Latest', provider: 'mistral', contextWindow: 128000 },
      { id: 'mistral-small-latest', name: 'Mistral Small Latest', provider: 'mistral', contextWindow: 128000 },
      { id: 'codestral-latest', name: 'Codestral Latest', provider: 'mistral', contextWindow: 256000 },
      { id: 'open-mistral-nemo', name: 'Mistral Nemo (12B)', provider: 'mistral', contextWindow: 128000 },
      { id: 'pixtral-large-latest', name: 'Pixtral Large Latest', provider: 'mistral', contextWindow: 128000 },
    ],
    perplexity: [
      { id: 'sonar', name: 'Sonar (8B Online Search)', provider: 'perplexity', contextWindow: 127072 },
      { id: 'sonar-pro', name: 'Sonar Pro (70B Online Search)', provider: 'perplexity', contextWindow: 127072 },
      { id: 'sonar-reasoning-pro', name: 'Sonar Reasoning Pro', provider: 'perplexity', contextWindow: 127072, reasoning: true },
      { id: 'sonar-reasoning', name: 'Sonar Reasoning', provider: 'perplexity', contextWindow: 127072, reasoning: true },
    ],
    cohere: [
      { id: 'command-r-plus-08-2024', name: 'Command R+ (Enterprise)', provider: 'cohere', contextWindow: 128000 },
      { id: 'command-r-08-2024', name: 'Command R (Aug 2024)', provider: 'cohere', contextWindow: 128000 },
      { id: 'command-r', name: 'Command R', provider: 'cohere', contextWindow: 128000 },
      { id: 'command-light', name: 'Command Light', provider: 'cohere', contextWindow: 4096 },
    ],
    xai: [
      { id: 'grok-2-1212', name: 'Grok 2 (1212)', provider: 'xai', contextWindow: 131072 },
      { id: 'grok-2-vision-1212', name: 'Grok 2 Vision (1212)', provider: 'xai', contextWindow: 32768 },
      { id: 'grok-beta', name: 'Grok Beta', provider: 'xai', contextWindow: 131072 },
    ],
    openrouter: [
      { id: 'anthropic/claude-3.5-sonnet', name: 'Anthropic: Claude 3.5 Sonnet', provider: 'openrouter', contextWindow: 200000 },
      { id: 'openai/gpt-4o', name: 'OpenAI: GPT-4o', provider: 'openrouter', contextWindow: 128000 },
      { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Meta: Llama 3.3 70B Instruct', provider: 'openrouter', contextWindow: 131072 },
      { id: 'deepseek/deepseek-r1', name: 'DeepSeek: R1', provider: 'openrouter', contextWindow: 64000, reasoning: true },
      { id: 'google/gemini-flash-1.5', name: 'Google: Gemini Flash 1.5', provider: 'openrouter', contextWindow: 1000000 },
    ],
    custom: [
      { id: 'default', name: 'Default Custom Model', provider: 'custom', contextWindow: 32768 },
    ],
  };

  /**
   * Primary canonical default model for each provider used when a stored model is deprecated
   */
  static CANONICAL_DEFAULT_MODELS = {
    groq: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
    openai: 'gpt-4o',
    gemini: 'gemini-1.5-flash',
    anthropic: 'claude-3-5-sonnet-20241022',
    deepseek: 'deepseek-chat',
    mistral: 'mistral-large-latest',
    perplexity: 'sonar',
    cohere: 'command-r-plus-08-2024',
    xai: 'grok-2-1212',
    openrouter: 'anthropic/claude-3.5-sonnet',
    custom: 'default',
  };

  /**
   * Secondary fallback model when canonical default is also rejected or unavailable
   */
  static SECONDARY_DEFAULT_MODELS = {
    groq: 'llama-3.3-70b-versatile',
    openai: 'gpt-4o-mini',
    gemini: 'gemini-1.5-pro',
    anthropic: 'claude-3-5-haiku-20241022',
    deepseek: 'deepseek-reasoner',
    mistral: 'mistral-small-latest',
    perplexity: 'sonar-pro',
    cohere: 'command-r-08-2024',
    xai: 'grok-beta',
    openrouter: 'openai/gpt-4o',
    custom: 'default',
  };

  /**
   * Detects whether an API error indicates model deprecation, decommissioning, or unrecognised model id
   */
  static isModelDeprecationOrNotFoundError(err) {
    if (!err) return false;
    const msg = (err.message || '').toLowerCase();
    const code = (err.code || err.status || '').toString().toLowerCase();
    const type = (err.type || '').toLowerCase();

    return (
      code === '404' ||
      code === 'model_not_found' ||
      code === 'model_decommissioned' ||
      code === 'invalid_model' ||
      type === 'not_found_error' ||
      msg.includes('decommissioned') ||
      msg.includes('deprecated') ||
      msg.includes('does not exist') ||
      msg.includes('not found') ||
      msg.includes('is not recognized') ||
      msg.includes('is not supported') ||
      msg.includes('unsupported model') ||
      msg.includes('invalid model') ||
      msg.includes('call listmodels') ||
      msg.includes('unknown model')
    );
  }

  static getCacheKey(provider, apiKey, customBaseUrl) {
    const keyPart = apiKey ? (apiKey.length > 8 ? apiKey.slice(-8) : apiKey) : 'nokey';
    return `${provider}:${keyPart}:${customBaseUrl || ''}`;
  }

  static clearModelsCache(provider = null) {
    if (!provider) {
      this.modelsCache.clear();
      return;
    }
    for (const key of this.modelsCache.keys()) {
      if (key.startsWith(`${provider}:`)) {
        this.modelsCache.delete(key);
      }
    }
  }

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
   * Features in-memory TTL caching, live provider endpoint querying, and fallback to curated models.
   */
  static async listModels(provider = 'groq', apiKey = null, customBaseUrl = null, options = {}) {
    const effectiveApiKey = (provider === 'groq' && !apiKey) ? (process.env.GROQ_API_KEY || null) : apiKey;
    const now = Date.now();
    const cacheKey = this.getCacheKey(provider, effectiveApiKey, customBaseUrl);
    const cached = this.modelsCache.get(cacheKey);

    // Return cached list if available and within TTL unless forceRefresh is set
    if (!options.forceRefresh && cached && (now - cached.timestamp < this.CACHE_TTL)) {
      return cached.data;
    }

    const catalog = await this.getModelCatalog();
    const catalogKey = this.PROVIDER_CATALOG_MAP[provider] || provider;
    const providerCatalog = catalog[catalogKey]?.models || {};

    const getCatalogFallback = (prov) => {
      // 1. Stale cache
      const stale = this.modelsCache.get(cacheKey);
      if (stale && Array.isArray(stale.data) && stale.data.length > 0) {
        return stale.data;
      }
      // 2. models.dev catalog entries
      const entries = Object.values(providerCatalog);
      if (entries.length > 0) {
        const enriched = this.enrichAndFilterModels(
          entries.map(m => ({ id: m.id, name: m.name })),
          providerCatalog,
          prov
        );
        if (enriched.length > 0) return enriched;
      }
      // 3. Built-in curated fallback models
      return this.CURATED_FALLBACK_MODELS[prov] || [];
    };

    if (provider === 'openai') {
      if (!apiKey) return this.CURATED_FALLBACK_MODELS.openai || [];
      try {
        const client = new OpenAI({ apiKey });
        const res = await client.models.list();
        const raw = res.data
          .filter(m => m.id.startsWith('gpt-') || m.id.startsWith('o1') || m.id.startsWith('o2') || m.id.startsWith('o3') || m.id.startsWith('o4') || m.id.startsWith('chatgpt-'))
          .map(m => ({ id: m.id, name: m.id }));
        const enriched = this.enrichAndFilterModels(raw, providerCatalog, provider);
        if (enriched.length > 0) {
          this.modelsCache.set(cacheKey, { timestamp: now, data: enriched });
          return enriched;
        }
      } catch (err) {
        console.warn(`⚠️ OpenAI dynamic models fetch warning: ${err.message}`);
        if (options.throwOnError) {
          throw new Error(`OpenAI API Key verification failed: ${err.message}`);
        }
      }
      return getCatalogFallback('openai');
    } else if (provider === 'anthropic') {
      if (!apiKey) return this.CURATED_FALLBACK_MODELS.anthropic || [];
      try {
        const res = await fetch('https://api.anthropic.com/v1/models', {
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          signal: AbortSignal.timeout(6000),
        });
        const data = await res.json();
        if (Array.isArray(data.data) && data.data.length > 0) {
          const raw = data.data.map(m => ({ id: m.id, name: m.display_name || m.id }));
          const enriched = this.enrichAndFilterModels(raw, providerCatalog, provider);
          if (enriched.length > 0) {
            this.modelsCache.set(cacheKey, { timestamp: now, data: enriched });
            return enriched;
          }
        }
      } catch (e) {
        console.warn(`⚠️ Anthropic dynamic models fetch warning: ${e.message}`);
        if (options.throwOnError) throw e;
      }
      return getCatalogFallback('anthropic');
    } else if (provider === 'xai') {
      if (!apiKey) return this.CURATED_FALLBACK_MODELS.xai || [];
      try {
        const client = new OpenAI({ apiKey: apiKey, baseURL: 'https://api.x.ai/v1' });
        const res = await client.models.list();
        if (Array.isArray(res.data) && res.data.length > 0) {
          const raw = res.data.map(m => ({ id: m.id, name: m.id }));
          const enriched = this.enrichAndFilterModels(raw, providerCatalog, provider);
          if (enriched.length > 0) {
            this.modelsCache.set(cacheKey, { timestamp: now, data: enriched });
            return enriched;
          }
        }
      } catch (e) {
        console.warn(`⚠️ xAI dynamic models fetch warning: ${e.message}`);
        if (options.throwOnError) throw e;
      }
      return getCatalogFallback('xai');
    } else if (provider === 'openrouter') {
      if (!apiKey) return this.CURATED_FALLBACK_MODELS.openrouter || [];
      try {
        const res = await fetch('https://openrouter.ai/api/v1/models?output_modalities=text', {
          headers: { Authorization: `Bearer ${apiKey}` },
          signal: AbortSignal.timeout(6000),
        });
        const data = await res.json();
        if (Array.isArray(data.data) && data.data.length > 0) {
          const raw = data.data
            .filter(m => {
              const out = m.architecture?.output_modalities || [];
              if (out.length > 0 && (out.length !== 1 || out[0] !== 'text')) return false;
              return true;
            })
            .slice(0, 60)
            .map(m => ({ id: m.id, name: m.name || m.id, contextWindow: m.context_length }));
          const enriched = this.enrichAndFilterModels(raw, providerCatalog, provider);
          if (enriched.length > 0) {
            this.modelsCache.set(cacheKey, { timestamp: now, data: enriched });
            return enriched;
          }
        }
      } catch (e) {
        console.warn(`⚠️ OpenRouter dynamic models fetch warning: ${e.message}`);
        if (options.throwOnError) throw e;
      }
      return getCatalogFallback('openrouter');
    } else if (provider === 'gemini') {
      if (!apiKey) return this.CURATED_FALLBACK_MODELS.gemini || [];
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, {
          signal: AbortSignal.timeout(6000),
        });
        const data = await res.json();
        if (data.models && Array.isArray(data.models) && data.models.length > 0) {
          const raw = data.models
            .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
            .map(m => ({
              id: m.name.replace('models/', ''),
              name: m.displayName || m.name.replace('models/', ''),
              contextWindow: m.inputTokenLimit,
            }));
          const enriched = this.enrichAndFilterModels(raw, providerCatalog, provider);
          if (enriched.length > 0) {
            this.modelsCache.set(cacheKey, { timestamp: now, data: enriched });
            return enriched;
          }
        } else if (data.error && options.throwOnError) {
          throw new Error(data.error.message);
        }
      } catch (err) {
        console.warn(`⚠️ Gemini dynamic models fetch warning: ${err.message}`);
        if (options.throwOnError) {
          throw new Error(`Google Gemini API verification failed: ${err.message}`);
        }
      }
      return getCatalogFallback('gemini');
    } else if (provider === 'deepseek') {
      if (!apiKey) return this.CURATED_FALLBACK_MODELS.deepseek || [];
      try {
        const client = new OpenAI({ apiKey, baseURL: 'https://api.deepseek.com' });
        const res = await client.models.list();
        if (Array.isArray(res.data) && res.data.length > 0) {
          const raw = res.data.map(m => ({ id: m.id, name: m.id }));
          const enriched = this.enrichAndFilterModels(raw, providerCatalog, provider);
          if (enriched.length > 0) {
            this.modelsCache.set(cacheKey, { timestamp: now, data: enriched });
            return enriched;
          }
        }
      } catch (e) {
        console.warn(`⚠️ DeepSeek dynamic models fetch warning: ${e.message}`);
        if (options.throwOnError) throw e;
      }
      return getCatalogFallback('deepseek');
    } else if (provider === 'mistral') {
      if (!apiKey) return this.CURATED_FALLBACK_MODELS.mistral || [];
      try {
        const client = new OpenAI({ apiKey, baseURL: 'https://api.mistral.ai/v1' });
        const res = await client.models.list();
        if (Array.isArray(res.data) && res.data.length > 0) {
          const raw = res.data
            .filter(m => m.capabilities?.completion_chat !== false)
            .map(m => ({ id: m.id, name: m.id }));
          const enriched = this.enrichAndFilterModels(raw, providerCatalog, provider);
          if (enriched.length > 0) {
            this.modelsCache.set(cacheKey, { timestamp: now, data: enriched });
            return enriched;
          }
        }
      } catch (e) {
        console.warn(`⚠️ Mistral dynamic models fetch warning: ${e.message}`);
        if (options.throwOnError) throw e;
      }
      return getCatalogFallback('mistral');
    } else if (provider === 'perplexity') {
      if (!apiKey) return this.CURATED_FALLBACK_MODELS.perplexity || [];
      try {
        const client = new OpenAI({ apiKey, baseURL: 'https://api.perplexity.ai' });
        const res = await client.models.list();
        if (Array.isArray(res.data) && res.data.length > 0) {
          const raw = res.data.map(m => ({ id: m.id, name: m.id }));
          const enriched = this.enrichAndFilterModels(raw, providerCatalog, provider);
          if (enriched.length > 0) {
            this.modelsCache.set(cacheKey, { timestamp: now, data: enriched });
            return enriched;
          }
        }
      } catch (e) {}
      return getCatalogFallback('perplexity');
    } else if (provider === 'cohere') {
      if (!apiKey) return this.CURATED_FALLBACK_MODELS.cohere || [];
      try {
        const res = await fetch('https://api.cohere.com/v1/models?endpoint=chat', {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Request-Source': 'aptus-ai',
          },
          signal: AbortSignal.timeout(6000),
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.models) && data.models.length > 0) {
            const raw = data.models
              .filter(m => (m.endpoints || []).includes('chat') || this.isPureChatModel(m.name, m.name))
              .map(m => ({ id: m.name, name: m.name, contextWindow: m.context_length }));
            const enriched = this.enrichAndFilterModels(raw, providerCatalog, provider);
            if (enriched.length > 0) {
              this.modelsCache.set(cacheKey, { timestamp: now, data: enriched });
              return enriched;
            }
          }
        }
      } catch (e) {
        console.warn(`⚠️ Cohere dynamic models fetch warning: ${e.message}`);
      }
      return getCatalogFallback('cohere');
    } else if (provider === 'custom') {
      if (!customBaseUrl) return [];
      try {
        const client = new OpenAI({ apiKey: apiKey || 'dummy-key', baseURL: customBaseUrl });
        const res = await client.models.list();
        if (Array.isArray(res.data)) {
          const raw = res.data.map(m => ({ id: m.id, name: m.id }));
          const enriched = this.enrichAndFilterModels(raw, {}, provider);
          if (enriched.length > 0) {
            this.modelsCache.set(cacheKey, { timestamp: now, data: enriched });
            return enriched;
          }
        }
      } catch (e) {
        console.warn(`⚠️ Custom provider dynamic models fetch warning: ${e.message}`);
      }
      return this.CURATED_FALLBACK_MODELS.custom || [];
    } else {
      // Groq
      const effectiveKey = apiKey || process.env.GROQ_API_KEY;
      if (!effectiveKey) return this.CURATED_FALLBACK_MODELS.groq || [];
      try {
        const client = new Groq({ apiKey: effectiveKey });
        const res = await client.models.list();
        const raw = res.data
          .filter(m => m.active)
          .map(m => ({ id: m.id, name: m.id, contextWindow: m.context_window }));
        const enriched = this.enrichAndFilterModels(raw, providerCatalog, 'groq');
        if (enriched.length > 0) {
          this.modelsCache.set(cacheKey, { timestamp: now, data: enriched });
          return enriched;
        }
      } catch (err) {
        console.warn(`⚠️ Groq dynamic models fetch warning: ${err.message}`);
        if (options.throwOnError) {
          throw new Error(`Groq API Key verification failed: ${err.message}`);
        }
      }
      return getCatalogFallback('groq');
    }
  }

  /**
   * Fetch all available pure-chat models across ALL providers configured by the user in parallel
   */
  static async listAllConnectedModels(user, options = {}) {
    const providerKeyMap = {
      groq: user?.groqApiKey || process.env.GROQ_API_KEY,
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
        const models = await this.listModels(prov, providerKeyMap[prov], user?.customBaseUrl, options);
        return { provider: prov, models };
      } catch (e) {
        const fallback = this.CURATED_FALLBACK_MODELS[prov] || [];
        return { provider: prov, models: fallback, warning: e.message };
      }
    });

    const results = await Promise.all(tasks);
    const allModels = [];
    const modelsByProvider = {};

    for (const r of results) {
      modelsByProvider[r.provider] = r.models.map(m => ({ ...m, isConfigured: true }));
      allModels.push(...r.models);
    }

    // Also populate unconfigured providers with curated preview defaults
    const allSupported = Object.keys(this.CURATED_FALLBACK_MODELS);
    for (const prov of allSupported) {
      if (!modelsByProvider[prov]) {
        modelsByProvider[prov] = (this.CURATED_FALLBACK_MODELS[prov] || []).map(m => ({
          ...m,
          isConfigured: false,
        }));
      }
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
   * Generate text response across configured provider with automatic deprecation recovery
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

    const executeProviderCall = async () => {
      if (provider === 'openai') {
        const client = options.apiKey ? new OpenAI({ apiKey: options.apiKey }) : this.openaiClient;
        if (!client) throw new Error('OpenAI API key is missing.');

        const runOpenAI = async (modelToUse) => {
          console.log(`🟢 Calling OpenAI API (model: ${modelToUse})...`);
          const response = await client.chat.completions.create({
            model: modelToUse || 'gpt-4o',
            messages,
            temperature,
            max_tokens: maxTokens,
          });

          const content = response.choices[0]?.message?.content || '';
          const promptTokens = response.usage?.prompt_tokens || this.estimateTokens(prompt);
          const completionTokens = response.usage?.completion_tokens || this.estimateTokens(content);
          const totalTokens = response.usage?.total_tokens || (promptTokens + completionTokens);

          return { text: content, usage: { promptTokens, completionTokens, totalTokens }, activeModel: modelToUse };
        };

        try {
          return await runOpenAI(model || 'gpt-4o');
        } catch (err) {
          if (LLMService.isModelDeprecationOrNotFoundError(err)) {
            const fallbackModel = (model !== LLMService.CANONICAL_DEFAULT_MODELS.openai)
              ? LLMService.CANONICAL_DEFAULT_MODELS.openai
              : LLMService.SECONDARY_DEFAULT_MODELS.openai;
            console.warn(`⚠️ Model "${model}" failed on OpenAI (${err.message}). Falling back to "${fallbackModel}"...`);
            return await runOpenAI(fallbackModel);
          }
          throw err;
        }

      } else if (provider === 'anthropic') {
        const apiKey = options.apiKey || this.customApiKey || process.env.ANTHROPIC_API_KEY;
        if (!apiKey) throw new Error('Anthropic API key is missing.');

        const runAnthropic = async (modelToUse) => {
          console.log(`🟢 Calling Anthropic Claude API (model: ${modelToUse})...`);
          const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01',
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              model: modelToUse || 'claude-3-5-sonnet-20241022',
              max_tokens: maxTokens,
              temperature,
              system: systemPrompt || undefined,
              messages: [{ role: 'user', content: prompt }],
            }),
          });

          const data = await res.json();
          if (!res.ok) {
            const err = new Error(data.error?.message || 'Anthropic API request failed');
            err.status = res.status;
            err.type = data.error?.type;
            throw err;
          }

          const content = data.content?.[0]?.text || '';
          const promptTokens = data.usage?.input_tokens || this.estimateTokens(prompt);
          const completionTokens = data.usage?.output_tokens || this.estimateTokens(content);
          return { text: content, usage: { promptTokens, completionTokens, totalTokens: promptTokens + completionTokens }, activeModel: modelToUse };
        };

        try {
          return await runAnthropic(model || 'claude-3-5-sonnet-20241022');
        } catch (err) {
          if (LLMService.isModelDeprecationOrNotFoundError(err)) {
            const fallbackModel = (model !== LLMService.CANONICAL_DEFAULT_MODELS.anthropic)
              ? LLMService.CANONICAL_DEFAULT_MODELS.anthropic
              : LLMService.SECONDARY_DEFAULT_MODELS.anthropic;
            console.warn(`⚠️ Model "${model}" failed on Anthropic (${err.message}). Falling back to "${fallbackModel}"...`);
            return await runAnthropic(fallbackModel);
          }
          throw err;
        }

      } else if (provider === 'xai') {
        const apiKey = options.apiKey || this.customApiKey || process.env.XAI_API_KEY;
        if (!apiKey) throw new Error('xAI API key is missing.');
        const client = new OpenAI({ apiKey, baseURL: 'https://api.x.ai/v1' });

        const runXAI = async (modelToUse) => {
          console.log(`🟢 Calling xAI Grok API (model: ${modelToUse})...`);
          const response = await client.chat.completions.create({
            model: modelToUse || 'grok-2-1212',
            messages,
            temperature,
            max_tokens: maxTokens,
          });

          const content = response.choices[0]?.message?.content || '';
          const promptTokens = response.usage?.prompt_tokens || this.estimateTokens(prompt);
          const completionTokens = response.usage?.completion_tokens || this.estimateTokens(content);
          const totalTokens = response.usage?.total_tokens || (promptTokens + completionTokens);

          return { text: content, usage: { promptTokens, completionTokens, totalTokens }, activeModel: modelToUse };
        };

        try {
          return await runXAI(model || 'grok-2-1212');
        } catch (err) {
          if (LLMService.isModelDeprecationOrNotFoundError(err)) {
            const fallbackModel = (model !== LLMService.CANONICAL_DEFAULT_MODELS.xai)
              ? LLMService.CANONICAL_DEFAULT_MODELS.xai
              : LLMService.SECONDARY_DEFAULT_MODELS.xai;
            console.warn(`⚠️ Model "${model}" failed on xAI (${err.message}). Falling back to "${fallbackModel}"...`);
            return await runXAI(fallbackModel);
          }
          throw err;
        }

      } else if (provider === 'openrouter') {
        const apiKey = options.apiKey || this.customApiKey || process.env.OPENROUTER_API_KEY;
        if (!apiKey) throw new Error('OpenRouter API key is missing.');

        const client = new OpenAI({
          apiKey,
          baseURL: 'https://openrouter.ai/api/v1',
          defaultHeaders: {
            'HTTP-Referer': 'https://aptus.ai',
            'X-Title': 'Aptus AI Platform',
          },
        });

        const runOpenRouter = async (modelToUse) => {
          console.log(`🟢 Calling OpenRouter API (model: ${modelToUse})...`);
          const response = await client.chat.completions.create({
            model: modelToUse || 'anthropic/claude-3.5-sonnet',
            messages,
            temperature,
            max_tokens: maxTokens,
          });

          const content = response.choices[0]?.message?.content || '';
          const promptTokens = response.usage?.prompt_tokens || this.estimateTokens(prompt);
          const completionTokens = response.usage?.completion_tokens || this.estimateTokens(content);
          const totalTokens = response.usage?.total_tokens || (promptTokens + completionTokens);

          return { text: content, usage: { promptTokens, completionTokens, totalTokens }, activeModel: modelToUse };
        };

        try {
          return await runOpenRouter(model || 'anthropic/claude-3.5-sonnet');
        } catch (err) {
          if (LLMService.isModelDeprecationOrNotFoundError(err)) {
            const fallbackModel = (model !== LLMService.CANONICAL_DEFAULT_MODELS.openrouter)
              ? LLMService.CANONICAL_DEFAULT_MODELS.openrouter
              : LLMService.SECONDARY_DEFAULT_MODELS.openrouter;
            console.warn(`⚠️ Model "${model}" failed on OpenRouter (${err.message}). Falling back to "${fallbackModel}"...`);
            return await runOpenRouter(fallbackModel);
          }
          throw err;
        }

      } else if (provider === 'gemini') {
        const apiKey = options.apiKey || this.customApiKey || process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error('Google Gemini API key is missing.');

        const runGemini = async (modelToUse) => {
          console.log(`🟢 Calling Google Gemini API (model: ${modelToUse})...`);
          const geminiModel = modelToUse || 'gemini-1.5-flash';
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
            const err = new Error(data.error?.message || 'Gemini API request failed');
            err.status = res.status;
            err.code = data.error?.code;
            throw err;
          }

          const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const promptTokens = data.usageMetadata?.promptTokenCount || this.estimateTokens(prompt);
          const completionTokens = data.usageMetadata?.candidatesTokenCount || this.estimateTokens(content);
          return { text: content, usage: { promptTokens, completionTokens, totalTokens: promptTokens + completionTokens }, activeModel: modelToUse };
        };

        try {
          return await runGemini(model || 'gemini-1.5-flash');
        } catch (err) {
          if (LLMService.isModelDeprecationOrNotFoundError(err)) {
            const fallbackModel = (model !== LLMService.CANONICAL_DEFAULT_MODELS.gemini)
              ? LLMService.CANONICAL_DEFAULT_MODELS.gemini
              : LLMService.SECONDARY_DEFAULT_MODELS.gemini;
            console.warn(`⚠️ Model "${model}" failed on Gemini (${err.message}). Falling back to "${fallbackModel}"...`);
            return await runGemini(fallbackModel);
          }
          throw err;
        }

      } else if (provider === 'deepseek') {
        const apiKey = options.apiKey || this.customApiKey || process.env.DEEPSEEK_API_KEY;
        if (!apiKey) throw new Error('DeepSeek API key is missing.');

        const client = new OpenAI({ apiKey, baseURL: 'https://api.deepseek.com' });

        const runDeepSeek = async (modelToUse) => {
          console.log(`🟢 Calling DeepSeek API (model: ${modelToUse})...`);
          const response = await client.chat.completions.create({
            model: modelToUse || 'deepseek-chat',
            messages,
            temperature,
            max_tokens: maxTokens,
          });

          const content = response.choices[0]?.message?.content || '';
          const promptTokens = response.usage?.prompt_tokens || this.estimateTokens(prompt);
          const completionTokens = response.usage?.completion_tokens || this.estimateTokens(content);
          const totalTokens = response.usage?.total_tokens || (promptTokens + completionTokens);
          return { text: content, usage: { promptTokens, completionTokens, totalTokens }, activeModel: modelToUse };
        };

        try {
          return await runDeepSeek(model || 'deepseek-chat');
        } catch (err) {
          if (LLMService.isModelDeprecationOrNotFoundError(err)) {
            const fallbackModel = (model !== LLMService.CANONICAL_DEFAULT_MODELS.deepseek)
              ? LLMService.CANONICAL_DEFAULT_MODELS.deepseek
              : LLMService.SECONDARY_DEFAULT_MODELS.deepseek;
            console.warn(`⚠️ Model "${model}" failed on DeepSeek (${err.message}). Falling back to "${fallbackModel}"...`);
            return await runDeepSeek(fallbackModel);
          }
          throw err;
        }

      } else if (provider === 'mistral') {
        const apiKey = options.apiKey || this.customApiKey || process.env.MISTRAL_API_KEY;
        if (!apiKey) throw new Error('Mistral API key is missing.');

        const client = new OpenAI({ apiKey, baseURL: 'https://api.mistral.ai/v1' });

        const runMistral = async (modelToUse) => {
          console.log(`🟢 Calling Mistral API (model: ${modelToUse})...`);
          const response = await client.chat.completions.create({
            model: modelToUse || 'mistral-large-latest',
            messages,
            temperature,
            max_tokens: maxTokens,
          });

          const content = response.choices[0]?.message?.content || '';
          const promptTokens = response.usage?.prompt_tokens || this.estimateTokens(prompt);
          const completionTokens = response.usage?.completion_tokens || this.estimateTokens(content);
          const totalTokens = response.usage?.total_tokens || (promptTokens + completionTokens);
          return { text: content, usage: { promptTokens, completionTokens, totalTokens }, activeModel: modelToUse };
        };

        try {
          return await runMistral(model || 'mistral-large-latest');
        } catch (err) {
          if (LLMService.isModelDeprecationOrNotFoundError(err)) {
            const fallbackModel = (model !== LLMService.CANONICAL_DEFAULT_MODELS.mistral)
              ? LLMService.CANONICAL_DEFAULT_MODELS.mistral
              : LLMService.SECONDARY_DEFAULT_MODELS.mistral;
            console.warn(`⚠️ Model "${model}" failed on Mistral (${err.message}). Falling back to "${fallbackModel}"...`);
            return await runMistral(fallbackModel);
          }
          throw err;
        }

      } else if (provider === 'perplexity') {
        const apiKey = options.apiKey || this.customApiKey || process.env.PERPLEXITY_API_KEY;
        if (!apiKey) throw new Error('Perplexity API key is missing.');

        const client = new OpenAI({ apiKey, baseURL: 'https://api.perplexity.ai' });

        const runPerplexity = async (modelToUse) => {
          console.log(`🟢 Calling Perplexity API (model: ${modelToUse})...`);
          const response = await client.chat.completions.create({
            model: modelToUse || 'sonar',
            messages,
            temperature,
            max_tokens: maxTokens,
          });

          const content = response.choices[0]?.message?.content || '';
          const promptTokens = response.usage?.prompt_tokens || this.estimateTokens(prompt);
          const completionTokens = response.usage?.completion_tokens || this.estimateTokens(content);
          const totalTokens = response.usage?.total_tokens || (promptTokens + completionTokens);
          return { text: content, usage: { promptTokens, completionTokens, totalTokens }, activeModel: modelToUse };
        };

        try {
          return await runPerplexity(model || 'sonar');
        } catch (err) {
          if (LLMService.isModelDeprecationOrNotFoundError(err)) {
            const fallbackModel = (model !== LLMService.CANONICAL_DEFAULT_MODELS.perplexity)
              ? LLMService.CANONICAL_DEFAULT_MODELS.perplexity
              : LLMService.SECONDARY_DEFAULT_MODELS.perplexity;
            console.warn(`⚠️ Model "${model}" failed on Perplexity (${err.message}). Falling back to "${fallbackModel}"...`);
            return await runPerplexity(fallbackModel);
          }
          throw err;
        }

      } else if (provider === 'cohere') {
        const apiKey = options.apiKey || this.customApiKey || process.env.COHERE_API_KEY;
        if (!apiKey) throw new Error('Cohere API key is missing.');

        const client = new OpenAI({ apiKey, baseURL: 'https://api.cohere.ai/compatibility/v1' });

        const runCohere = async (modelToUse) => {
          console.log(`🟢 Calling Cohere API (model: ${modelToUse})...`);
          const response = await client.chat.completions.create({
            model: modelToUse || 'command-r-plus-08-2024',
            messages,
            temperature,
            max_tokens: maxTokens,
          });

          const content = response.choices[0]?.message?.content || '';
          const promptTokens = response.usage?.prompt_tokens || this.estimateTokens(prompt);
          const completionTokens = response.usage?.completion_tokens || this.estimateTokens(content);
          const totalTokens = response.usage?.total_tokens || (promptTokens + completionTokens);
          return { text: content, usage: { promptTokens, completionTokens, totalTokens }, activeModel: modelToUse };
        };

        try {
          return await runCohere(model || 'command-r-plus-08-2024');
        } catch (err) {
          if (LLMService.isModelDeprecationOrNotFoundError(err)) {
            const fallbackModel = (model !== LLMService.CANONICAL_DEFAULT_MODELS.cohere)
              ? LLMService.CANONICAL_DEFAULT_MODELS.cohere
              : LLMService.SECONDARY_DEFAULT_MODELS.cohere;
            console.warn(`⚠️ Model "${model}" failed on Cohere (${err.message}). Falling back to "${fallbackModel}"...`);
            return await runCohere(fallbackModel);
          }
          throw err;
        }

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

        return { text: content, usage: { promptTokens, completionTokens, totalTokens }, activeModel: model || 'default' };

      } else {
        // Default: Groq
        const client = options.apiKey ? new Groq({ apiKey: options.apiKey }) : this.groqClient;
        if (!client) {
          throw new Error('Groq API key is missing.');
        }

        let groqModel = model.includes('gpt-4o') || model.includes('claude') || model.includes('grok')
          ? this.defaultGroqModel
          : model;

        const runGroq = async (modelToUse) => {
          console.log(`🟢 Calling Groq API (model: ${modelToUse})...`);
          const response = await client.chat.completions.create({
            model: modelToUse,
            messages,
            temperature,
            max_tokens: maxTokens,
          });

          const content = response.choices[0]?.message?.content || '';
          const promptTokens = response.usage?.prompt_tokens || this.estimateTokens(prompt);
          const completionTokens = response.usage?.completion_tokens || this.estimateTokens(content);
          const totalTokens = response.usage?.total_tokens || (promptTokens + completionTokens);

          return { text: content, usage: { promptTokens, completionTokens, totalTokens }, activeModel: modelToUse };
        };

        try {
          return await runGroq(groqModel);
        } catch (err) {
          if (LLMService.isModelDeprecationOrNotFoundError(err) || groqModel !== 'openai/gpt-oss-120b') {
            const fallbackModel = (groqModel !== 'openai/gpt-oss-120b')
              ? 'openai/gpt-oss-120b'
              : 'llama-3.3-70b-versatile';
            console.warn(`⚠️ Model "${groqModel}" failed on Groq (${err.message}). Automatically falling back to "${fallbackModel}"...`);
            return await runGroq(fallbackModel);
          }
          throw err;
        }
      }
    };

    try {
      return await executeProviderCall();
    } catch (primaryErr) {
      // Safety net: If a secondary provider fails completely (e.g. invalid user key or external outage)
      // and we have the platform Groq key, fall back safely to Groq so user conversations are never dropped
      if (provider !== 'groq' && process.env.GROQ_API_KEY && options.allowCrossProviderFallback !== false) {
        console.warn(`⚠️ Provider "${provider}" call failed completely (${primaryErr.message}). Safely falling back to platform Groq service...`);
        return await this.generateText(prompt, {
          ...options,
          provider: 'groq',
          model: this.defaultGroqModel,
          apiKey: process.env.GROQ_API_KEY,
          allowCrossProviderFallback: false,
        });
      }
      throw primaryErr;
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
