import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },

  // ✅ Multiple Indian contact numbers validation
  contactNumbers: {
    type: [String],
    required: true,
    validate: {
      validator: function (numbers) {
        const indianRegex = /^(\+91)?[6-9]\d{9}$/;
        return numbers.every((num) => indianRegex.test(num));
      },
      message: (props) =>
        `All contact numbers must be valid Indian numbers (e.g. +919876543210 or 9876543210).`,
    },
  },

  regularPrice: { type: Number, required: true },
  discountPrice: { type: Number, required: true },
  bathroom: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  furnished: { type: Boolean, required: true },
  parking: { type: Boolean, required: true },
  type: { type: String, required: true },
  offer: { type: Boolean, required: true },
  other: { type: Boolean, required: true },
  imageUrls: {
    type: [String],
    required: true,
  },
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;
