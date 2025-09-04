import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

SwiperCore.use([Navigation]);

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-[95vh] flex items-center justify-center text-center px-4">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1470&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="whitespace-normal text-4xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-xl leading-snug">
            Find Your <span className="text-yellow-400">Dream Home</span> with
            ApnaGharBazar
          </h1>

          <p className="mt-6 text-lg sm:text-xl font-medium italic text-gray-100 opacity-90">
            "A house is made of bricks and beams, but a home is built with love
            and dreams."
          </p>

          <p className="text-gray-200 text-base sm:text-lg mt-6 max-w-2xl mx-auto">
            Explore the finest homes in top locations. Buy, rent, or sell — we
            make it simple and elegant.
          </p>

          <Link
            to="/search"
            className="mt-6 inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-full text-lg transition duration-300 shadow-lg"
          >
            Start Exploring
          </Link>
        </div>
      </div>

      {/* Swiper Section */}
      <div className="max-w-6xl mx-auto my-12 px-4">
        <Swiper
          navigation
          loop
          className="rounded-xl overflow-hidden shadow-xl h-[250px] sm:h-[350px] md:h-[400px]"
        >
          {offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  backgroundImage: `url(${listing.imageUrls[0]})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className="h-full w-full"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Listings Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-14 pb-20">
        {/* Offers */}
        {offerListings.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">
                Recent Offers
              </h2>
              <Link
                to="/search?offer=true"
                className="text-blue-700 hover:underline text-sm font-medium"
              >
                Show all offers
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {offerListings.map((listing) => (
                <div
                  key={listing._id}
                  className="shadow-md rounded-xl bg-white overflow-hidden hover:scale-105 transition-transform h-[280px] sm:h-[300px]"
                >
                  <ListingItem listing={listing} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* For Rent */}
        {rentListings.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">
                For Rent
              </h2>
              <Link
                to="/search?type=rent"
                className="text-blue-700 hover:underline text-sm font-medium"
              >
                Show all rentals
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {rentListings.map((listing) => (
                <div
                  key={listing._id}
                  className="shadow-md rounded-xl bg-white overflow-hidden hover:scale-105 transition-transform h-[280px] sm:h-[300px]"
                >
                  <ListingItem listing={listing} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* For Sale */}
        {saleListings.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">
                For Sale
              </h2>
              <Link
                to="/search?type=sale"
                className="text-blue-700 hover:underline text-sm font-medium"
              >
                Show all sales
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {saleListings.map((listing) => (
                <div
                  key={listing._id}
                  className="shadow-md rounded-xl bg-white overflow-hidden hover:scale-105 transition-transform h-[280px] sm:h-[300px]"
                >
                  <ListingItem listing={listing} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-800 text-gray-300 py-10 mt-16">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-center md:text-left">
            © {new Date().getFullYear()} ApnaGharBazar. All rights reserved.
          </p>
          <div className="flex gap-6 text-lg">
            <a href="#" className="hover:text-white">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-white">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-white">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
