import express from 'express';
import { createListing, getListing, deleteListing, getListings } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();


router.post('/create', verifyToken, createListing);
router.get('/get/:id', getListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.get('/get',getListings)
export default router;