import express from 'express';
import { 
  getAssignments, 
  getAssignmentById, 
  createAssignment, 
  updateAssignment, 
  deleteAssignment 
} from '../controllers/assignmentController.js';
import { getAssignmentFinancials, getAllAssignmentsFinancials } from '../controllers/expenseController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/financials', authenticate, getAllAssignmentsFinancials);
router.get('/', authenticate, getAssignments);
router.get('/:id/financials', authenticate, getAssignmentFinancials);
router.get('/:id', authenticate, getAssignmentById);
router.post('/', authenticate, createAssignment);
router.put('/:id', authenticate, updateAssignment);
router.delete('/:id', authenticate, deleteAssignment);

export default router;

