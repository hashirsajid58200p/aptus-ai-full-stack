const mongoose = require('mongoose');

const knowledgeBaseSchema = new mongoose.Schema({
  chatbotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sourceType: {
    type: String,
    enum: ['text', 'pdf', 'url'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  chunkText: {
    type: String,
    required: true,
  },
  chunkIndex: {
    type: Number,
    default: 0,
  },
  embedding: {
    type: [Number],
    default: [],
  },
  metadata: {
    sourceUrl: String,
    fileName: String,
    charLength: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for fast chatbot-specific retrieval
knowledgeBaseSchema.index({ chatbotId: 1, sourceType: 1 });

const KnowledgeBase = mongoose.model('KnowledgeBase', knowledgeBaseSchema);

module.exports = KnowledgeBase;
