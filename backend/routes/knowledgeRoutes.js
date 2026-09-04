const express = require('express');
const router = express.Router();
const { isAuthenticatedUser } = require('../middleware/Auth');
const {
  ingestText,
  ingestURL,
  ingestPDF,
  getKnowledgeBase,
  deleteKnowledgeItem,
} = require('../controllers/knowledgeController');

// Authenticated business owner endpoints
router.use(isAuthenticatedUser);

router.route('/')
  .get(getKnowledgeBase);

router.route('/text')
  .post(ingestText);

router.route('/url')
  .post(ingestURL);

router.route('/pdf')
  .post(ingestPDF);

router.route('/:id')
  .delete(deleteKnowledgeItem);

module.exports = router;
