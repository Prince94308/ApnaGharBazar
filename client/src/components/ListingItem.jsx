// ListingItem.jsx
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

// Array of Tailwind shadow colors
const shadowColors = [
  "shadow-blue-300",
  "shadow-green-300",
  "shadow-purple-300",
  "shadow-yellow-300",
  "shadow-pink-300",
  "shadow-red-300",
  "shadow-indigo-300",
  "shadow-emerald-300",
];

// Simple hash function to select a shadow color consistently
function getShadowColor(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return shadowColors[Math.abs(hash) % shadowColors.length];
}

export default function ListingItem({ listing }) {
  const shadowColor = getShadowColor(listing._id);

  return (
    <div className="relative w-full group [perspective:1000px]">
      <div
        className={`relative w-full h-full transition-transform duration-500 sm:group-hover:rotate-y-6 [transform-style:preserve-3d] bg-white rounded-xl overflow-hidden shadow-md sm:hover:shadow-xl ${shadowColor}`}
      >
        <Link to={`/listing/${listing._id}`} className="block">
          {/* Image */}
          <img
            src={
              listing.imageUrls?.[0] ||
              "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg"
            }
            alt="listing"
            className="h-48 sm:h-56 md:h-64 w-full object-cover sm:group-hover:scale-105 transition-transform duration-300"
          />

          {/* Content */}
          <div className="p-4 flex flex-col gap-2">
            <p className="truncate text-lg font-bold text-slate-800">
              {listing.name}
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MdLocationOn className="text-green-600 flex-shrink-0" />
              <span className="truncate">{listing.address}</span>
            </div>

            <p className="text-gray-600 text-sm line-clamp-2">
              {listing.description}
            </p>

            <p className="text-indigo-600 font-semibold text-md mt-1">
              ${listing.offer ? listing.offer.toLocaleString("en-US") : listing.regularPrice?.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>

            <div className="flex gap-4 text-sm font-medium text-gray-700">
              <span>
                {listing.bedrooms} {listing.bedrooms > 1 ? "Beds" : "Bed"}
              </span>
              <span>
                {listing.bathrooms} {listing.bathrooms > 1 ? "Baths" : "Bath"}
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
