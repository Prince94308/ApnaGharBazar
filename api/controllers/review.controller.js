import Review from '../models/review.model.js';
import { errorHandler } from '../utils/error.js';

export const createReview = async (req, res, next) => {
    try {
        const { listingId, rating, comment } = req.body;

        // Basic validation
        if (!rating || !comment || !listingId) {
            return next(errorHandler(400, 'All fields are required'));
        }

        const newReview = new Review({
            listingId,
            userId: req.user.id,
            username: req.user.username || "Anonymous", // Ideally get from user object attached by verifyToken middleware
            rating,
            comment,
        });

        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        next(error);
    }
};

export const getReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ listingId: req.params.listingId }).sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
};
