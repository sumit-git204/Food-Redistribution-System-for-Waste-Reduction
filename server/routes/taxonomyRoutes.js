import express from 'express';
import { getTaxonomy, seedTaxonomy } from '../controllers/taxonomyController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTaxonomy);
router.post('/seed', protect, seedTaxonomy);

export default router;
