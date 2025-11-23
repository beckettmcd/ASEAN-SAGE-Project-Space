import express from 'express';
import { 
  getEvidence, 
  getEvidenceById, 
  createEvidence, 
  updateEvidence, 
  deleteEvidence,
  linkToIndicator 
} from '../controllers/evidenceController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getEvidence);
router.get('/:id', authenticate, getEvidenceById);
router.post('/', authenticate, createEvidence);
router.put('/:id', authenticate, updateEvidence);
router.delete('/:id', authenticate, deleteEvidence);
router.post('/:id/link-indicator', authenticate, linkToIndicator);

export default router;

