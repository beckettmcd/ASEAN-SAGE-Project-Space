import express from 'express';
import { 
  getIndicators, 
  getIndicatorById, 
  createIndicator, 
  updateIndicator, 
  deleteIndicator,
  addResult 
} from '../controllers/indicatorController.js';
import { authenticate } from '../middleware/auth.js';
import { validateUUID } from '../middleware/validateParams.js';

const router = express.Router();

router.get('/', authenticate, getIndicators);
router.get('/:id', authenticate, validateUUID, getIndicatorById);
router.post('/', authenticate, createIndicator);
router.put('/:id', authenticate, validateUUID, updateIndicator);
router.delete('/:id', authenticate, validateUUID, deleteIndicator);
router.post('/:id/results', authenticate, validateUUID, addResult);

export default router;

