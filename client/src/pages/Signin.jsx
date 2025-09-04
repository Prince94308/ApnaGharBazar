import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/User/userSlice';

export default function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        dispatch(signInFailure(data.message || 'Signin failed'));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/profile');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-slate-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg p-6 sm:p-8 shadow-xl bg-white rounded-xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-slate-700 mb-6 sm:mb-8">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {error && (
          <p className="text-center text-red-500 mt-4 font-medium text-sm sm:text-base">
            {error}
          </p>
        )}

        <div className="text-center mt-4 sm:mt-6 text-xs sm:text-sm text-gray-600">
          Don’t have an account?
          <Link to="/sign-up" className="text-blue-600 hover:underline ml-1">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
