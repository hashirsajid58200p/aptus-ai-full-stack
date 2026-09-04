const express = require('express');
const router = express.Router();
const { handleDiscordWebhook, discordHealth } = require('../controllers/discordController');

router.route('/webhook')
  .post(handleDiscordWebhook);

router.route('/health')
  .get(discordHealth);

module.exports = router;
