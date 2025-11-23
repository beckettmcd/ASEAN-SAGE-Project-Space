import express from 'express';
import { 
  getBudgets, 
  getBudgetById, 
  createBudget, 
  updateBudget, 
  deleteBudget,
  getBudgetSummary 
} from '../controllers/budgetController.js';
import { authenticate } from '../middleware/auth.js';
import { validateUUID } from '../middleware/validateParams.js';

const router = express.Router();

router.get('/', authenticate, getBudgets);
router.get('/summary', authenticate, getBudgetSummary);
router.get('/:id', authenticate, validateUUID, getBudgetById);
router.post('/', authenticate, createBudget);
router.put('/:id', authenticate, validateUUID, updateBudget);
router.delete('/:id', authenticate, validateUUID, deleteBudget);

export default router;

