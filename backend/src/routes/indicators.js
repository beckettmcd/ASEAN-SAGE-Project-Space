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

const router = express.Router();

router.get('/', authenticate, getIndicators);
router.get('/:id', authenticate, getIndicatorById);
router.post('/', authenticate, createIndicator);
router.put('/:id', authenticate, updateIndicator);
router.delete('/:id', authenticate, deleteIndicator);
router.post('/:id/results', authenticate, addResult);

export default router;

