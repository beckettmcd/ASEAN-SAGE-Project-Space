import express from 'express';
import { 
  getTors, 
  getTorById, 
  createTor, 
  updateTor, 
  approveTor, 
  rejectTor,
  submitForApproval,
  deleteTor 
} from '../controllers/torController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { USER_ROLES } from '../config/constants.js';
import { validateUUID } from '../middleware/validateParams.js';

const router = express.Router();

router.get('/', authenticate, getTors);
router.get('/:id', authenticate, validateUUID, getTorById);
router.post('/', authenticate, createTor);
router.put('/:id', authenticate, validateUUID, updateTor);
router.post('/:id/submit', authenticate, validateUUID, submitForApproval);
router.post('/:id/approve', authenticate, validateUUID, authorize(USER_ROLES.FCDO_SRO, USER_ROLES.ADMIN), approveTor);
router.post('/:id/reject', authenticate, validateUUID, authorize(USER_ROLES.FCDO_SRO, USER_ROLES.ADMIN), rejectTor);
router.delete('/:id', authenticate, validateUUID, deleteTor);

export default router;

