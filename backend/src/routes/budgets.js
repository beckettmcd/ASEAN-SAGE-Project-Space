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

const router = express.Router();

router.get('/', authenticate, getBudgets);
router.get('/summary', authenticate, getBudgetSummary);
router.get('/:id', authenticate, getBudgetById);
router.post('/', authenticate, createBudget);
router.put('/:id', authenticate, updateBudget);
router.delete('/:id', authenticate, deleteBudget);

export default router;

