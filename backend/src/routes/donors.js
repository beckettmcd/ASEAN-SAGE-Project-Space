import express from 'express';
import { 
  getAllDonors, 
  getDonorProjects, 
  getDonorProjectById, 
  getCountryDonorActivity 
} from '../controllers/donorController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all donor organizations
router.get('/', authenticate, getAllDonors);

// Get all donor projects (with optional filters)
router.get('/projects', authenticate, getDonorProjects);

// Get a specific donor project
router.get('/projects/:id', authenticate, getDonorProjectById);

// Get donor activity for a specific country
router.get('/activity/:countryCode', authenticate, getCountryDonorActivity);

export default router;
