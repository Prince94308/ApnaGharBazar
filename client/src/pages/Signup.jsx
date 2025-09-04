import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import React from 'react';

export default function SignUp() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-slate-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg p-6 sm:p-8 bg-white rounded-xl shadow-xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-slate-700 mb-6 sm:mb-8">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            required
          />
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            required
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-300 p-2 sm:p-3 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            required
          />
          <button
            disabled={loading}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 sm:py-3 rounded-lg transition shadow-md disabled:opacity-70 text-sm sm:text-base"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-center mt-4 font-medium text-sm sm:text-base">
            {error}
          </p>
        )}

        <div className="text-center mt-4 sm:mt-6 text-xs sm:text-sm text-gray-600">
          Already have an account?
          <Link to="/sign-in" className="text-blue-600 hover:underline ml-1">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
