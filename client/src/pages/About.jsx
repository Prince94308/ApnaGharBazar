import React from 'react';
import { FaSearchLocation, FaFileContract, FaKey, FaHome } from 'react-icons/fa';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 text-slate-800 px-6 py-10">
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">About ApanaGharBazar</h1>
        <p className="text-lg md:text-xl text-gray-600">
          Your trusted partner in buying, selling, and renting the perfect property.
        </p>
      </div>

      {/* Image & Intro */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 mb-16 items-center">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1350&q=80"
          alt="Sahand Estate Office"
          className="rounded-xl shadow-xl w-full md:w-1/2 object-cover h-80"
        />
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-semibold text-blue-800 mb-4">Who We Are</h2>
          <p className="text-lg mb-4 leading-relaxed">
            ApnaGharBazar is a premier real estate agency committed to helping clients find their dream homes, secure investments, or rent properties in the most sought-after neighborhoods.
          </p>
          <p className="text-lg leading-relaxed">
            We simplify the entire process by offering guidance, market insights, and hands-on support to ensure every transaction is smooth and successful.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-8 mb-16 border-l-4 border-blue-600">
        <h3 className="text-2xl font-bold text-blue-700 mb-4">Our Mission</h3>
        <p className="text-lg leading-relaxed text-gray-700">
          At ApnaGharBazar, our mission is to empower our clients to achieve their real estate goals through expert advice, personalized service, and in-depth knowledge of the local market.
          Whether you're buying, selling, or renting, we walk with you every step of the way to ensure success and satisfaction.
        </p>
      </div>

      {/* Steps to Rent or Buy */}
      <div className="max-w-6xl mx-auto mb-16">
        <h3 className="text-3xl font-semibold text-slate-800 text-center mb-10">How It Works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white border shadow-lg rounded-xl p-6 text-center hover:scale-105 transition transform duration-300">
            <FaSearchLocation className="text-4xl text-indigo-600 mb-4 mx-auto" />
            <h4 className="text-xl font-bold mb-2">1. Browse Listings</h4>
            <p className="text-gray-600">Search for properties by location, type, price, and more.</p>
          </div>
          <div className="bg-white border shadow-lg rounded-xl p-6 text-center hover:scale-105 transition transform duration-300">
            <FaFileContract className="text-4xl text-green-600 mb-4 mx-auto" />
            <h4 className="text-xl font-bold mb-2">2. Schedule a Visit</h4>
            <p className="text-gray-600">Book a property tour to see homes in person or virtually.</p>
          </div>
          <div className="bg-white border shadow-lg rounded-xl p-6 text-center hover:scale-105 transition transform duration-300">
            <FaKey className="text-4xl text-yellow-500 mb-4 mx-auto" />
            <h4 className="text-xl font-bold mb-2">3. Finalize the Deal</h4>
            <p className="text-gray-600">Negotiate and sign contracts easily with our agent's help.</p>
          </div>
          <div className="bg-white border shadow-lg rounded-xl p-6 text-center hover:scale-105 transition transform duration-300">
            <FaHome className="text-4xl text-red-500 mb-4 mx-auto" />
            <h4 className="text-xl font-bold mb-2">4. Move In</h4>
            <p className="text-gray-600">Get the keys to your new home and settle in happily.</p>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white p-10 text-center shadow-lg">
        <h3 className="text-3xl font-bold mb-4">Ready to Find Your Dream Property?</h3>
        <p className="text-lg mb-6">Let ApnaGharBazar help you buy, sell, or rent with confidence and ease.</p>
        
      </div>
    </div>
  );
}
