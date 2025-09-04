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

function Listing() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/get/${id}`);
        const data = await res.json();
        if (!res.ok || data.success === false)
          throw new Error(data.message || 'Failed to fetch listing');
        setListing(data);
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
      </div>
    </main>
  );
}

export default Listing;
