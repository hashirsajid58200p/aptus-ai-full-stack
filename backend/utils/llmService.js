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
    this.defaultGroqModel = process.env.GROQ_MODEL || 'groq/compound-mini';
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
        if (err.status === 404 && groqModel !== 'groq/compound-mini') {
          console.warn(`⚠️ Model "${groqModel}" not found on Groq. Automatically falling back to "groq/compound-mini"...`);
          response = await client.chat.completions.create({
            model: 'groq/compound-mini',
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
