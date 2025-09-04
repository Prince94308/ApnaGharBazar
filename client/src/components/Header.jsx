import React, { useState, useEffect } from "react";
import { FaSearch, FaHome, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const term = params.get("searchTerm") || "";
    setSearchTerm(term);
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-500/40 backdrop-blur-md border-b border-slate-500/30 shadow-lg shadow-slate-900/20">
      <div className="flex justify-between items-center max-w-6xl mx-auto px-4 py-3">
        {/* Logo + Home Icon */}
        <Link to="/" className="flex items-center space-x-2 group">
          <FaHome className="text-white text-2xl hover:text-green-500 transition" />
          <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100 drop-shadow-sm transition-transform group-hover:scale-105">
            <span className="text-red-500">Apna</span>
            <span className="text-green-600">Ghar</span>
            <span className="text-black">Bazar</span>
          </h1>
        </Link>

        {/* Search Box */}
        <form
          onSubmit={handleSubmit}
          className="hidden sm:flex bg-slate-700/50 backdrop-blur-sm border border-slate-500/30 shadow-inner shadow-slate-900/10 px-3 py-1.5 rounded-xl items-center w-32 sm:w-64 focus-within:ring-2 focus-within:ring-slate-300 transition duration-300"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-slate-300 text-slate-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="ml-2 text-slate-300 hover:text-white transition"
          >
            <FaSearch />
          </button>
        </form>

        {/* Desktop Nav Links */}
        <ul className="hidden sm:flex gap-4 items-center text-sm sm:text-base font-medium text-black">
          <Link to="/">
            <li className="hover:underline hover:text-green-600 transition">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hover:underline hover:text-green-600 transition">
              About
            </li>
          </Link>
          {!currentUser ? (
            <Link to="/sign-in">
              <li className="hover:text-green-600 transition hover:underline">
                Sign In
              </li>
            </Link>
          ) : (
            <Link to="/profile">
              <li className="hover:text-green-600 hover:underline transition">
                Profile
              </li>
            </Link>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="sm:hidden bg-slate-800/90 backdrop-blur-md text-white px-4 py-3 space-y-3">
          {/* Mobile Search */}
          <form
            onSubmit={handleSubmit}
            className="flex bg-slate-700/50 border border-slate-500/30 px-3 py-1.5 rounded-xl items-center w-full focus-within:ring-2 focus-within:ring-slate-300 transition duration-300"
          >
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm w-full placeholder:text-slate-300 text-slate-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="ml-2 text-slate-300 hover:text-white transition"
            >
              <FaSearch />
            </button>
          </form>

          <Link to="/" onClick={() => setMenuOpen(false)}>
            <p className="block hover:text-green-400">Home</p>
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            <p className="block hover:text-green-400">About</p>
          </Link>
          {!currentUser ? (
            <Link to="/sign-in" onClick={() => setMenuOpen(false)}>
              <p className="block hover:text-green-400">Sign In</p>
            </Link>
          ) : (
            <Link to="/profile" onClick={() => setMenuOpen(false)}>
              <p className="block hover:text-green-400">Profile</p>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
