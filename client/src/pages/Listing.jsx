import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import {
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaParking,
  FaBath,
  FaChair,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function Listing() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const initialOptions = {
    "client-id": "Ac_FRYimWjrsEsfCFW0JRwoZC4soHShBhycIyRMnhi7b_YzM7tVDYkXx3834Oawz0PlHgGuc-ssvdvzV",
    currency: "USD",
    intent: "capture",
  };

  const [coordinates, setCoordinates] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/review/get/${id}`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/review/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId: id,
          rating: parseInt(rating),
          comment,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        alert(data.message);
        return;
      }
      setComment("");
      setRating(5);
      fetchReviews(); // Refresh list
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/get/${id}`);
        const data = await res.json();
        if (!res.ok || data.success === false)
          throw new Error(data.message || 'Failed to fetch listing');
        setListing(data);

        // Geocode the address using Nominatim (Free)
        if (data.address) {
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(data.address)}`)
            .then(response => response.json())
            .then(results => {
              if (results && results.length > 0) {
                setCoordinates([parseFloat(results[0].lat), parseFloat(results[0].lon)]);
              }
            })
            .catch(err => console.error("Geocoding failed:", err));
        }

      } catch (err) {
        setError(true);
        console.error('Error fetching listing:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading listing...</p>;
  if (error || !listing)
    return <p className="text-center text-red-500 mt-10">Listing not found.</p>;

  return (
    <main className="w-full bg-gray-50 min-h-screen">
      {/* Image Swiper */}
      <div className="w-full flex justify-center mt-6">
        <div className="w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-300 bg-white relative">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            loop
            className="w-full h-[40vh] sm:h-[60vh] lg:h-[80vh]"
            onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex + 1)}
          >
            {listing.imageUrls?.map((url, index) => (
              <SwiperSlide key={index}>
                <img
                  src={url}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover object-center"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Share Button */}
          <div className="absolute top-4 right-4 z-10 border rounded-full w-10 h-10 flex justify-center items-center bg-slate-100 cursor-pointer shadow">
            <FaShare
              className="text-slate-600"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            />
          </div>

          {/* Slide Indicator */}
          <div className="absolute bottom-3 right-4 z-10 bg-white/80 text-xs sm:text-sm px-3 py-1 rounded shadow text-gray-700">
            Slide {currentSlide} of {listing.imageUrls?.length}
          </div>

          {copied && (
            <p className="absolute top-16 right-4 z-10 bg-white border px-4 py-1 rounded shadow text-xs sm:text-sm">
              Link copied!
            </p>
          )}
        </div>
      </div>

      {/* Listing Details */}
      <div className="flex flex-col max-w-4xl mx-auto p-4 sm:p-6 my-8 bg-white rounded-xl shadow-md">
        <p className="text-xl sm:text-2xl font-semibold">
          {listing.name} - ${listing.regularPrice.toLocaleString('en-US')}
          {listing.type === 'rent' && ' / month'}
        </p>

        <p className="flex items-center mt-4 gap-2 text-slate-600 text-sm sm:text-base">
          <FaMapMarkerAlt className="text-green-700" />
          {listing.address}
        </p>

        <div className="flex flex-wrap gap-4 mt-4">
          <p className="bg-red-900 text-white text-xs sm:text-sm px-3 py-1 rounded-md">
            {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
          </p>
          {listing.offer && (
            <p className="bg-green-900 text-white text-xs sm:text-sm px-3 py-1 rounded-md">
              ${+listing.discountPrice} OFF
            </p>
          )}
        </div>

        <p className="text-slate-800 mt-4 text-sm sm:text-base">
          <span className="font-semibold text-black">Description - </span>
          {listing.description}
        </p>

        {/* Features */}
        <ul className="mt-6 flex gap-4 text-green-700 flex-wrap text-sm sm:text-base">
          <li className="flex items-center gap-1">
            <FaBed /> {listing.bedrooms} Bed(s)
          </li>
          <li className="flex items-center gap-1">
            <FaBath /> {listing.bathroom} Bath(s)
          </li>
          <li className="flex items-center gap-1">
            <FaParking /> {listing.parking ? 'Parking' : 'No Parking'}
          </li>
          <li className="flex items-center gap-1">
            <FaChair /> {listing.furnished ? 'Furnished' : 'Unfurnished'}
          </li>
        </ul>

        {/* Contact Numbers */}
        {listing.contactNumbers?.length > 0 && (
          <div className="mt-6">
            <p className="font-semibold text-black mb-2 text-sm sm:text-base">
              Contact Number{listing.contactNumbers.length > 1 ? 's' : ''}:
            </p>
            <ul className="space-y-4">
              {listing.contactNumbers.map((num, index) => {
                const formattedNum = num.startsWith('+91') ? num : `+91${num}`;
                const whatsappLink = `https://wa.me/${formattedNum.replace(/\D/g, '')}`;
                const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(whatsappLink)}`;

                return (
                  <li key={index} className="flex items-center gap-4 flex-wrap">
                    <div className="text-xs sm:text-sm text-slate-800">
                      📞{' '}
                      <a
                        href={`tel:${num}`}
                        className="text-blue-600 hover:underline"
                      >
                        {num}
                      </a>{' '}
                      | 💬{' '}
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        WhatsApp
                      </a>
                    </div>
                    <button
                      className="text-xs px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition"
                      onClick={() => {
                        navigator.clipboard.writeText(num);
                        alert('Phone number copied to clipboard!');
                      }}
                    >
                      Copy
                    </button>
                    <img
                      src={qrCodeUrl}
                      alt="WhatsApp QR"
                      className="w-[50px] sm:w-[60px] h-[50px] sm:h-[60px] border border-gray-300 rounded"
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Map Section */}
        {coordinates && (
          <div className="mt-8 mb-4">
            <p className="font-semibold text-black mb-2 text-sm sm:text-base">Location:</p>
            <div className="h-[300px] w-full rounded-lg overflow-hidden border border-gray-300 z-0">
              <MapContainer center={coordinates} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={coordinates}>
                  <Popup>
                    {listing.name} <br /> {listing.address}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}

        {currentUser && !showPayment && (
          <button
            onClick={() => setShowPayment(true)}
            className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3 w-full mt-5 font-semibold text-lg shadow-lg transition-all"
          >
            Book Now for ${listing.offer ? (listing.regularPrice - +listing.discountPrice).toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
          </button>
        )}

        {showPayment && (
          <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
            <h3 className="text-xl font-bold mb-4 text-center text-slate-700">Complete Payment</h3>
            <PayPalScriptProvider options={initialOptions}>
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                  const price = listing.offer ? listing.regularPrice - +listing.discountPrice : listing.regularPrice;
                  return fetch("/api/payment/create-order", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      amount: price,
                      name: currentUser?.username || "Guest",
                      address: {
                        line1: "123 Main St",
                        city: "San Jose",
                        state: "CA",
                        postalCode: "95131",
                        countryCode: "US"
                      }
                    }),
                  })
                    .then((response) => response.json())
                    .then((order) => order.id);
                }}
                onApprove={(data, actions) => {
                  return fetch("/api/payment/capture-order", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ orderID: data.orderID }),
                  })
                    .then((response) => response.json())
                    .then((details) => {
                      alert("Transaction completed by " + details.payer.name.given_name);
                      setShowPayment(false);
                    });
                }}
              />
            </PayPalScriptProvider>
            <button
              onClick={() => setShowPayment(false)}
              className="text-red-600 hover:text-red-800 font-semibold w-full text-center mt-4 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
        {/* Reviews Section */}
        <div className="mt-8 border-t pt-8">
          <h3 className="text-xl font-bold mb-4">Reviews & Ratings</h3>

          {/* Review Form */}
          {currentUser ? (
            <form onSubmit={handleReviewSubmit} className="mb-8 p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold mb-2">Leave a Review</h4>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium">Rating:</span>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="border p-2 rounded"
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="w-full border p-3 rounded-lg mb-4 h-24 focus:outline-none focus:ring-2 focus:ring-slate-500"
                required
              />
              <button className="bg-slate-700 text-white px-6 py-2 rounded-lg hover:opacity-95 disabled:opacity-50">
                Submit Review
              </button>
            </form>
          ) : (
            <p className="mb-6 text-slate-500">Please sign in to leave a review.</p>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="border-b pb-4">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-slate-800">{review.username}</p>
                    <span className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex text-yellow-500 mb-2">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-slate-600">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-500 italic">No reviews yet. Be the first to add one!</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Listing;
