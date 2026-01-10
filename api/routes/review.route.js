import express from 'express';
import { createReview, getReviews } from '../controllers/review.controller.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/create', verifyToken, createReview);
router.get('/get/:listingId', getReviews);

export default router;
