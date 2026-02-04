
import express from 'express';
const router = express.Router();
import {
  getProperties,
  getPropertyById,
  getFeaturedProperties,
  getValuation,
} from '../controllers/propertyController.js';

router.route('/').get(getProperties);
router.route('/featured').get(getFeaturedProperties);
router.route('/valuation').post(getValuation);
router.route('/:id').get(getPropertyById);

export default router;
