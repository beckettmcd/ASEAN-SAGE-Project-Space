import express from 'express';
import { getRegionalDashboard, getCountryDashboard, getWorkstreamDashboard, getComprehensiveDashboard } from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/auth.js';
import { validateUUIDs } from '../middleware/validateParams.js';

const router = express.Router();

router.get('/regional', authenticate, getRegionalDashboard);
router.get('/country/:countryId', authenticate, validateUUIDs(['countryId']), getCountryDashboard);
router.get('/workstream/:workstreamId', authenticate, validateUUIDs(['workstreamId']), getWorkstreamDashboard);
router.get('/comprehensive', authenticate, getComprehensiveDashboard);

export default router;

