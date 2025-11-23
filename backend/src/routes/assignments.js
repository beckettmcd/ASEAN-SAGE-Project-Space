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
import { validateUUID } from '../middleware/validateParams.js';

const router = express.Router();

router.get('/financials', authenticate, getAllAssignmentsFinancials);
router.get('/', authenticate, getAssignments);
router.get('/:id/financials', authenticate, validateUUID, getAssignmentFinancials);
router.get('/:id', authenticate, validateUUID, getAssignmentById);
router.post('/', authenticate, createAssignment);
router.put('/:id', authenticate, validateUUID, updateAssignment);
router.delete('/:id', authenticate, validateUUID, deleteAssignment);

export default router;

