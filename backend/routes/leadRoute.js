const express = require('express');
const router = express.Router();
const { isAuthenticatedUser } = require('../middleware/Auth');
const { getOwnerLeads, exportLeadsCSV, deleteLead } = require('../controllers/leadController');
const { dashboardCors } = require('../config/cors');

router.use(dashboardCors);
router.use(isAuthenticatedUser);

router.route('/all').get(getOwnerLeads);
router.route('/export').get(exportLeadsCSV);
router.route('/:id').delete(deleteLead);

module.exports = router;
