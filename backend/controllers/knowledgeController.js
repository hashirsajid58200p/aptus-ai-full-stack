const catchAsyncError = require('../middleware/catchAsyncError');
const KnowledgeBase = require('../models/knowledgeBaseModel');
const RAGService = require('../utils/ragService');

// Ingest Text document
exports.ingestText = catchAsyncError(async (req, res, next) => {
  const { title, text } = req.body;
  const chatbotId = req.user._id;

  if (!title || !text) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both title and text content.',
    });
  }

  const result = await RAGService.ingestDocument({
    chatbotId,
    sourceType: 'text',
    title,
    text,
    apiKey: req.user.openaiApiKey,
  });

  res.status(201).json({
    success: true,
    message: `Successfully ingested text document into ${result.chunksCount} chunks.`,
    data: result,
  });
});

// Ingest URL webpage content
exports.ingestURL = catchAsyncError(async (req, res, next) => {
  const { url, title } = req.body;
  const chatbotId = req.user._id;

  if (!url) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid URL to scrape.',
    });
  }

  const scraped = await RAGService.extractTextFromURL(url);
  const docTitle = title || scraped.title || url;

  const result = await RAGService.ingestDocument({
    chatbotId,
    sourceType: 'url',
    title: docTitle,
    text: scraped.text,
    metadata: { sourceUrl: url },
    apiKey: req.user.openaiApiKey,
  });

  res.status(201).json({
    success: true,
    message: `Successfully scraped and ingested ${url} into ${result.chunksCount} chunks.`,
    data: result,
  });
});

// Ingest PDF document (expects base64 data in req.body.pdfBase64)
exports.ingestPDF = catchAsyncError(async (req, res, next) => {
  const { title, pdfBase64 } = req.body;
  const chatbotId = req.user._id;

  if (!title || !pdfBase64) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a title and pdfBase64 string.',
    });
  }

  const buffer = Buffer.from(pdfBase64, 'base64');
  const extractedText = await RAGService.extractTextFromPDF(buffer);

  if (!extractedText.trim()) {
    return res.status(400).json({
      success: false,
      message: 'No readable text could be extracted from the uploaded PDF.',
    });
  }

  const result = await RAGService.ingestDocument({
    chatbotId,
    sourceType: 'pdf',
    title,
    text: extractedText,
    metadata: { fileName: title },
    apiKey: req.user.openaiApiKey,
  });

  res.status(201).json({
    success: true,
    message: `Successfully parsed and ingested PDF "${title}" into ${result.chunksCount} chunks.`,
    data: result,
  });
});

// List knowledge base items
exports.getKnowledgeBase = catchAsyncError(async (req, res, next) => {
  const chatbotId = req.user._id;
  const items = await KnowledgeBase.find({ chatbotId })
    .select('title sourceType chunkIndex createdAt metadata')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: items.length,
    data: items,
  });
});

// Delete knowledge base item or all chunks with matching title
exports.deleteKnowledgeItem = catchAsyncError(async (req, res, next) => {
  const chatbotId = req.user._id;
  const { id } = req.params;

  const item = await KnowledgeBase.findById(id);
  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Knowledge item not found.',
    });
  }

  if (item.chatbotId.toString() !== chatbotId.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized to delete this knowledge item.',
    });
  }

  // Delete all chunks for this title or specific chunk
  await KnowledgeBase.deleteMany({ chatbotId, title: item.title });

  res.status(200).json({
    success: true,
    message: `Deleted knowledge document "${item.title}".`,
  });
});
