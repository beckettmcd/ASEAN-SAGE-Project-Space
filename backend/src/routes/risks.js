import express from 'express';
import { 
  getRisks, 
  getRiskById, 
  createRisk, 
  updateRisk, 
  deleteRisk,
  getRiskMatrix 
} from '../controllers/riskController.js';
import { authenticate } from '../middleware/auth.js';
import { validateUUID } from '../middleware/validateParams.js';

const router = express.Router();

router.get('/', authenticate, getRisks);
router.get('/matrix', authenticate, getRiskMatrix);
router.get('/:id', authenticate, validateUUID, getRiskById);
router.post('/', authenticate, createRisk);
router.put('/:id', authenticate, validateUUID, updateRisk);
router.delete('/:id', authenticate, validateUUID, deleteRisk);

export default router;

