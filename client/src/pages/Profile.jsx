import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  signOut,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from '../redux/User/userSlice';

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: '',
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [listingsFetched, setListingsFetched] = useState(false);

  const handleLogout = () => {
    dispatch(signOut());
    navigate('/');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser?.token) return dispatch(updateUserFailure('No token'));

    dispatch(updateUserStart());
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        dispatch(updateUserFailure(data.message || 'Update failed'));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    if (!currentUser?.token) return dispatch(deleteUserFailure('No token'));

    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess());
      navigate('/');
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      setListingsFetched(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });

      const data = await res.json();
      if (!res.ok || !Array.isArray(data)) throw new Error('Invalid response');
      setUserListings(data);
    } catch (error) {
      console.error('Listings error:', error.message);
      setShowListingsError(true);
    } finally {
      setListingsFetched(true);
    }
  };

  const handleDeleteListing = async (listingId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this listing?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        alert(data.message || 'Failed to delete listing');
        return;
      }

      setUserListings((prev) => prev.filter((item) => item._id !== listingId));
    } catch (error) {
      alert('Error deleting listing');
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-slate-800">
        My Profile
      </h1>

      {/* Update form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-lg mx-auto bg-white p-4 sm:p-6 shadow-lg rounded-lg"
      >
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          id="username"
          onChange={handleChange}
          className="border p-3 rounded-lg bg-gray-50 w-full"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          id="email"
          onChange={handleChange}
          className="border p-3 rounded-lg bg-gray-50 w-full"
        />
        <input
          type="password"
          placeholder="New Password"
          id="password"
          onChange={handleChange}
          className="border p-3 rounded-lg bg-gray-50 w-full"
        />
        <button
          disabled={loading}
          className="bg-blue-600 text-white p-3 rounded-lg uppercase hover:bg-green-600 transition duration-300 disabled:opacity-80"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
        <Link
          to="/create-listing"
          className="text-center bg-yellow-500 text-white p-3 rounded-lg uppercase hover:bg-yellow-600 transition duration-300"
        >
          + Create New Listing
        </Link>
      </form>

      <div className="flex flex-col sm:flex-row justify-between max-w-lg mx-auto mt-6 px-3 text-center sm:text-left">
        <span
          onClick={handleDeleteUser}
          className="text-red-600 cursor-pointer hover:underline mb-2 sm:mb-0"
        >
          Delete Account
        </span>
        <span
          onClick={handleLogout}
          className="text-red-600 cursor-pointer hover:underline"
        >
          Logout
        </span>
      </div>

      {updateSuccess && (
        <p className="text-green-600 text-center mt-4">
          Profile updated successfully.
        </p>
      )}
      {error && <p className="text-red-600 text-center mt-4">{error}</p>}

      <button
        onClick={handleShowListings}
        className="text-blue-600 w-full text-center mt-6 hover:underline"
      >
        Show My Listings
      </button>

      {showListingsError && (
        <p className="text-red-600 mt-4 text-center">Failed to load listings.</p>
      )}

      {userListings.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-slate-700">
            My Listings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className="border rounded-lg p-3 bg-white shadow hover:shadow-xl transition duration-300"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt="listing"
                    className="h-40 w-full object-cover rounded-md"
                  />
                </Link>
                <Link
                  to={`/listing/${listing._id}`}
                  className="text-slate-800 font-medium hover:underline block mt-2 truncate"
                >
                  {listing.name}
                </Link>
                <button
                  onClick={() => handleDeleteListing(listing._id)}
                  className="text-red-500 hover:underline text-sm mt-2"
                >
                   Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {listingsFetched && userListings.length === 0 && !showListingsError && (
        <p className="text-center text-gray-500 mt-6">
          You don’t have any listings yet.
        </p>
      )}
    </div>
  );
}

export default Profile;
