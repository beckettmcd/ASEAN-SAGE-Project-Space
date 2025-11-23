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

const router = express.Router();

router.get('/', authenticate, getRisks);
router.get('/matrix', authenticate, getRiskMatrix);
router.get('/:id', authenticate, getRiskById);
router.post('/', authenticate, createRisk);
router.put('/:id', authenticate, updateRisk);
router.delete('/:id', authenticate, deleteRisk);

export default router;

