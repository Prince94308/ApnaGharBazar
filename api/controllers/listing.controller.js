import mongoose from 'mongoose';
import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

// Create listing
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create({ ...req.body, userRef: req.user.id });
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

// Get listing by ID with ID validation
export const getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete listing with auth check
export const deleteListing = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid listing ID' });
    }

    const listing = await Listing.findById(id);
    if (!listing) return next(errorHandler(404, 'Listing not found'));

    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(403, 'You are not authorized to delete this listing'));
    }

    await Listing.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Listing deleted successfully' });
  } catch (error) {
    next(error);
  }
};


// /backend/controllers/listing.controller.js

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const offer = req.query.offer === 'true';
    const furnished = req.query.furnished === 'true';
    const parking = req.query.parking === 'true';
    const type = req.query.type;

    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    const filter = {
      name: { $regex: searchTerm, $options: 'i' },
    };

    if (req.query.offer !== undefined) filter.offer = offer;
    if (req.query.furnished !== undefined) filter.furnished = furnished;
    if (req.query.parking !== undefined) filter.parking = parking;
    if (type && type !== 'all') filter.type = type;

    const listings = await Listing.find(filter)
      .sort({ [sort]: order })
      .skip(startIndex)
      .limit(limit);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};