const cheerio = require('cheerio');
const pdfParse = require('pdf-parse');
const KnowledgeBase = require('../models/knowledgeBaseModel');
const OpenAI = require('openai');

class RAGService {
  /**
   * Split document text into chunks with sliding window overlap
   */
  static chunkText(text, chunkSize = 600, overlap = 100) {
    if (!text || typeof text !== 'string') return [];
    const cleanText = text.replace(/\s+/g, ' ').trim();
    if (cleanText.length <= chunkSize) {
      return [cleanText];
    }

    const chunks = [];
    let start = 0;
    while (start < cleanText.length) {
      const end = Math.min(start + chunkSize, cleanText.length);
      const chunk = cleanText.substring(start, end).trim();
      if (chunk.length > 20) {
        chunks.push(chunk);
      }
      if (end >= cleanText.length) break;
      start += chunkSize - overlap;
    }
    return chunks;
  }

  /**
   * Generate vector embedding for a text string.
   * If OpenAI API key is available, uses text-embedding-3-small (1536 dims).
   * Otherwise, generates a normalized, deterministic term-frequency semantic vector (384 dims, $0 cost).
   */
  static async getEmbedding(text, apiKey = null) {
    const key = apiKey || process.env.OPENAI_API_KEY;
    if (key) {
      try {
        const openai = new OpenAI({ apiKey: key });
        const res = await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: text.substring(0, 8000),
        });
        return res.data[0].embedding;
      } catch (err) {
        console.warn('⚠️ OpenAI embedding failed, falling back to built-in semantic vector generator:', err.message);
      }
    }

    // High-performance $0-cost semantic vector generation (384-dimensional normalized vector)
    return this.generateSemanticVector(text, 384);
  }

  /**
   * Universal $0 cost semantic embedding hash (384 dimensions) using character 3-grams
   */
  static generateSemanticVector(text, dimensions = 384) {
    const vector = new Array(dimensions).fill(0);
    const clean = text.toLowerCase().replace(/[^a-z0-9]/g, ' ');
    const words = clean.split(/\s+/).filter((w) => w.length > 0);

    for (const word of words) {
      if (word.length < 3) {
        let hash = 0;
        for (let j = 0; j < word.length; j++) {
          hash = (hash << 5) - hash + word.charCodeAt(j);
          hash |= 0;
        }
        vector[Math.abs(hash) % dimensions] += 1.0;
      } else {
        for (let i = 0; i <= word.length - 3; i++) {
          const gram = word.substring(i, i + 3);
          let hash = 0;
          for (let j = 0; j < gram.length; j++) {
            hash = (hash << 5) - hash + gram.charCodeAt(j);
            hash |= 0;
          }
          vector[Math.abs(hash) % dimensions] += 1.0;
        }
      }
    }

    // Normalize vector (L2 norm)
    let magnitude = 0;
    for (let i = 0; i < dimensions; i++) {
      magnitude += vector[i] * vector[i];
    }
    magnitude = Math.sqrt(magnitude);

    if (magnitude > 0) {
      for (let i = 0; i < dimensions; i++) {
        vector[i] /= magnitude;
      }
    }
    return vector;
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  static cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
    const len = Math.min(vecA.length, vecB.length);
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < len; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dot / denom;
  }

  /**
   * Parse text from PDF buffer
   */
  static async extractTextFromPDF(pdfBuffer) {
    const data = await pdfParse(pdfBuffer);
    return data.text || '';
  }

  /**
   * Scrape and extract clean text from URL
   */
  static async extractTextFromURL(url) {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AptusAI-RAG/1.0)' },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: HTTP ${response.status}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove script, style, navigation, footer elements
    $('script, style, noscript, nav, footer, header, svg').remove();

    // Extract text from body
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    const title = $('title').text().trim() || url;

    return { title, text: bodyText };
  }

  /**
   * Ingest and store knowledge base document
   */
  static async ingestDocument({ chatbotId, sourceType, title, text, metadata = {}, apiKey = null }) {
    const chunks = this.chunkText(text);
    const docs = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await this.getEmbedding(chunk, apiKey);
      docs.push({
        chatbotId,
        sourceType,
        title,
        chunkText: chunk,
        chunkIndex: i,
        embedding,
        metadata: {
          ...metadata,
          charLength: chunk.length,
        },
      });
    }

    if (docs.length > 0) {
      await KnowledgeBase.insertMany(docs);
    }
    return { chunksCount: docs.length };
  }

  /**
   * Query knowledge base for relevant context
   */
  static async searchRelevantContext(chatbotId, queryText, topK = 3, apiKey = null) {
    const queryEmbedding = await this.getEmbedding(queryText, apiKey);
    const candidateChunks = await KnowledgeBase.find({ chatbotId }).lean();

    if (!candidateChunks || candidateChunks.length === 0) {
      return '';
    }

    const scored = candidateChunks.map(chunk => {
      const score = this.cosineSimilarity(queryEmbedding, chunk.embedding);
      return { ...chunk, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const topResults = scored.slice(0, topK).filter(r => r.score > 0.1);

    if (topResults.length === 0) return '';

    return topResults
      .map(
        (res, idx) =>
          `[Knowledge Source ${idx + 1}: ${res.title} (${res.sourceType})]\n${res.chunkText}`
      )
      .join('\n\n');
  }
}

module.exports = RAGService;
