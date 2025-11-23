import express from 'express';
import { exportToJSON, exportToCSV, exportToDevTracker, exportARPack } from '../controllers/exportController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/json', authenticate, exportToJSON);
router.get('/csv', authenticate, exportToCSV);
router.get('/devtracker', authenticate, exportToDevTracker);
router.get('/ar-pack', authenticate, exportARPack);

export default router;

