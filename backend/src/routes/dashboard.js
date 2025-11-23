import express from 'express';
import { getRegionalDashboard, getCountryDashboard, getWorkstreamDashboard, getComprehensiveDashboard } from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/regional', authenticate, getRegionalDashboard);
router.get('/country/:countryId', authenticate, getCountryDashboard);
router.get('/workstream/:workstreamId', authenticate, getWorkstreamDashboard);
router.get('/comprehensive', authenticate, getComprehensiveDashboard);

export default router;

