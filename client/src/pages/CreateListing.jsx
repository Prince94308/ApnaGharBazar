import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function CreateListing() {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    contactNumbers: [""],
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50000,
    discountPrice: 3400,
    sale: false,
    rent: false,
    parking: false,
    furnished: false,
    offer: false,
    other: false,
    images: [],
  });

  const [images, setImages] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContactChange = (index, value) => {
    const updated = [...formData.contactNumbers];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, contactNumbers: updated }));
  };

  const addContactField = () => {
    setFormData((prev) => ({
      ...prev,
      contactNumbers: [...prev.contactNumbers, ""],
    }));
  };

  const removeContactField = (index) => {
    const updated = [...formData.contactNumbers];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, contactNumbers: updated }));
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
    setUploadStatus("");
  };

  const handleImageUpload = async () => {
    if (!images || images.length === 0) {
      setError("Please select image(s) first.");
      return;
    }

    if (images.length > 6) {
      setError("Maximum 6 images allowed.");
      return;
    }

    const data = new FormData();
    for (let i = 0; i < images.length; i++) {
      data.append("images", images[i]);
    }

    try {
      setImageUploading(true);
      setError("");
      setUploadStatus("Uploading images...");

      const res = await fetch("/upload", {
        method: "POST",
        body: data,
        credentials: "include",
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Image upload failed");

      setFormData((prev) => ({
        ...prev,
        images: result.files.map((file) => file.url),
      }));
      setUploadStatus("Images uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Image upload failed");
      setUploadStatus("");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.images || formData.images.length < 1) {
      return setError("You must upload at least one image");
    }

    if (+formData.discountPrice >= +formData.regularPrice) {
      return setError("Discount price must be lower than regular price");
    }

    const indianRegex = /^(\+91)?[6-9]\d{9}$/;
    if (!formData.contactNumbers.every((num) => indianRegex.test(num))) {
      return setError("One or more contact numbers are invalid");
    }

    try {
      setLoading(true);
      setError("");

      const listingData = {
        name: formData.title,
        description: formData.description,
        address: formData.address,
        contactNumbers: formData.contactNumbers,
        bedrooms: +formData.bedrooms,
        bathroom: +formData.bathrooms,
        regularPrice: +formData.regularPrice,
        discountPrice: +formData.discountPrice,
        parking: formData.parking,
        furnished: formData.furnished,
        offer: formData.offer,
        other: formData.other,
        type: formData.sale ? "sale" : "rent",
        imageUrls: formData.images,
        userRef: currentUser._id,
      };

      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        credentials: "include",
        body: JSON.stringify(listingData),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Something went wrong!");
      }

      alert("Listing created successfully!");
      navigate(`/listing/${data._id}`);
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || "Submit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <h1 className="text-3xl font-semibold text-center mb-6">
          Create a Listing
        </h1>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <input
            type="text"
            id="title"
            placeholder="Name"
            className="border p-3 rounded-lg"
            required
            onChange={handleChange}
            value={formData.title}
          />
          <textarea
            id="description"
            placeholder="Description"
            className="border p-3 rounded-lg"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            id="address"
            placeholder="Address"
            className="border p-3 rounded-lg"
            required
            onChange={handleChange}
            value={formData.address}
          />

          {/* Contact Numbers */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Contact Numbers </label>
            {formData.contactNumbers.map((num, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. 9876543210 or +919876543210"
                  value={num}
                  onChange={(e) => handleContactChange(index, e.target.value)}
                  required
                  pattern="^(\+91)?[6-9]\d{9}$"
                  title="Enter a valid 10-digit Indian number, optionally prefixed with +91"
                  className="border p-3 rounded-lg flex-1"
                />
                {formData.contactNumbers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeContactField(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:opacity-90"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addContactField}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:opacity-90 w-fit"
            >
              Add Another Number
            </button>
          </div>

          {/* Property Options */}
          <div className="flex flex-wrap gap-4">
            {["sale", "rent", "parking", "furnished", "offer", "other"].map(
              (id) => (
                <label key={id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={id}
                    className="w-5 h-5"
                    onChange={handleChange}
                    checked={formData[id]}
                  />
                  <span>{id.charAt(0).toUpperCase() + id.slice(1)}</span>
                </label>
              )
            )}
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="flex flex-wrap gap-6">
            <div>
              <label>Bedrooms</label>
              <input
                type="number"
                id="bedrooms"
                className="border p-3 rounded-lg border-gray-500"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bedrooms}
              />
            </div>
            <div>
              <label>Bathrooms</label>
              <input
                type="number"
                id="bathrooms"
                className="border p-3 rounded-lg border-gray-500"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bathrooms}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-4">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="1000000000"
                className="p-3 border border-gray-500 rounded-lg"
                required
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div>
                <p>Regular Price</p>
                <span className="text-xs text-gray-500">(in ₹/month)</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="number"
                id="discountPrice"
                min="0"
                max="1000000000"
                className="p-3 border border-gray-500 rounded-lg"
                required
                onChange={handleChange}
                value={formData.discountPrice}
              />
              <div>
                <p>Discounted Price</p>
                <span className="text-xs text-gray-500">(in ₹/month)</span>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="flex flex-col gap-4">
            <p className="font-semibold">
              Images:
              <span className="font-normal text-gray-600 ml-2">
                The first image will be the cover (max 6)
              </span>
            </p>
            <input
              className="p-3 border border-gray-300 rounded"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            <button
              type="button"
              onClick={handleImageUpload}
              className="p-3 bg-green-600 text-white rounded hover:opacity-90 w-fit disabled:opacity-50"
              disabled={!images.length || imageUploading}
            >
              {imageUploading ? "Uploading..." : "Upload Image(s)"}
            </button>
            {uploadStatus && (
              <p className="text-sm text-blue-700">{uploadStatus}</p>
            )}
          </div>

          {/* Preview */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {formData.images.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt="preview"
                  className="h-32 w-full object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-80 disabled:opacity-50"
            disabled={loading || !formData.images.length}
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </main>
  );
}

export default CreateListing;
