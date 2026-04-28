import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Edit3,
  Save,
  X,
  MapPin,
  Phone,
  Calendar,
  User,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import apiClient from "../../api/axiosConfig";

const UserProfile = () => {
  const { user: authUser, checkAuth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  
  // Initialize form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    style: "Men",
    phone: "",
    country: "",
    city: "",
    profilePic: null,
    bio: "",
  });

  // Sync with authUser on load
  useEffect(() => {
    if (authUser) {
      setFormData({
        firstName: authUser.firstName || "",
        lastName: authUser.lastName || "",
        email: authUser.email || "",
        dob: authUser.dob || "",
        style: authUser.gender || "Men", // Backend uses 'gender'
        phone: authUser.phoneNumber || "",
        country: authUser.location?.country || "",
        city: authUser.location?.city || "",
        profilePic: null, // Don't set file object from URL
        bio: authUser.bio || "",
      });
    }
  }, [authUser]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfilePreview(null);
    // Reset to current authUser data
    if (authUser) {
      setFormData({
        firstName: authUser.firstName || "",
        lastName: authUser.lastName || "",
        email: authUser.email || "",
        dob: authUser.dob || "",
        style: authUser.gender || "Men",
        phone: authUser.phoneNumber || "",
        country: authUser.location?.country || "",
        city: authUser.location?.city || "",
        profilePic: null,
        bio: authUser.bio || "",
      });
    }
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("dob", formData.dob);
      data.append("gender", formData.style); // Map style -> gender
      data.append("phoneNumber", formData.phone); // Map phone -> phoneNumber
      data.append("bio", formData.bio);

      // Handle location
      const locationObj = {
        city: formData.city,
        country: formData.country,
      };
      data.append("location", JSON.stringify(locationObj));

      if (formData.profilePic) {
        data.append("profilePhoto", formData.profilePic);
      }

      await apiClient.put("/api/updateUserInSetup", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated successfully!");
      await checkAuth(); // Refresh user data in context
      setIsEditing(false);
      setProfilePreview(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, profilePic: file }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const countries = ["USA", "India", "Germany", "France", "Japan"];
  const citiesByCountry = {
    USA: ["New York", "Los Angeles", "San Francisco"],
    India: ["Delhi", "Mumbai", "Bangalore"],
    Germany: ["Berlin", "Munich", "Frankfurt"],
    France: ["Paris", "Lyon", "Marseille"],
    Japan: ["Tokyo", "Osaka", "Yokohama"],
  };

  // Helper to get display image
  const getProfileImage = () => {
    if (profilePreview) return profilePreview;
    if (authUser?.profilePhoto?.url) return authUser.profilePhoto.url;
    return null;
  };

  if (!authUser) return <div className="text-white text-center mt-10">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-gray-700"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">User Profile</h1>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                >
                  <Edit3 size={18} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8 flex flex-col lg:flex-row gap-8">
            {/* Left Column - Profile Picture */}
            <div className="lg:w-1/3 flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-48 h-48 rounded-full bg-gray-700 border-4 border-purple-500/30 overflow-hidden shadow-lg flex items-center justify-center">
                  {getProfileImage() ? (
                    <img
                      src={getProfileImage()}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400 p-4 text-center">
                      <User size={64} />
                      <span className="mt-2">No Photo</span>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-3 right-3 bg-purple-600 text-white p-3 rounded-full cursor-pointer shadow-lg hover:bg-purple-700 transition duration-300">
                    <Camera size={20} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>

              <div className="w-full bg-gray-700/50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Account Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar size={18} className="text-purple-400" />
                    <span>Member since: {new Date(authUser.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <User size={18} className="text-purple-400" />
                    <span>Style: {formData.style}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin size={18} className="text-purple-400" />
                    <span>
                      {formData.city || "City"}, {formData.country || "Country"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - User Details */}
            <div className="lg:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-600 bg-gray-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 transition"
                    />
                  ) : (
                    <div className="w-full rounded-lg bg-gray-700/50 text-white px-4 py-3">
                      {formData.firstName || "-"}
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-600 bg-gray-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 transition"
                    />
                  ) : (
                    <div className="w-full rounded-lg bg-gray-700/50 text-white px-4 py-3">
                      {formData.lastName || "-"}
                    </div>
                  )}
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Email Address
                  </label>
                  <div className="w-full rounded-lg bg-gray-700/50 text-gray-400 px-4 py-3 cursor-not-allowed">
                    {formData.email}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-600 bg-gray-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 transition"
                      placeholder="+1 (555) 000-0000"
                    />
                  ) : (
                    <div className="w-full rounded-lg bg-gray-700/50 text-white px-4 py-3 flex items-center gap-2">
                      <Phone size={16} className="text-purple-400" />
                      {formData.phone || "-"}
                    </div>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-600 bg-gray-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 transition"
                    />
                  ) : (
                    <div className="w-full rounded-lg bg-gray-700/50 text-white px-4 py-3 flex items-center gap-2">
                      <Calendar size={16} className="text-purple-400" />
                      {formData.dob ? new Date(formData.dob).toLocaleDateString() : "-"}
                    </div>
                  )}
                </div>

                {/* Style Preference (Gender) */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Gender Preference
                  </label>
                  {isEditing ? (
                    <div className="flex gap-6">
                      <label className="inline-flex items-center gap-2 text-gray-300 cursor-pointer">
                        <input
                          type="radio"
                          name="style"
                          value="Men"
                          checked={formData.style === "Men"}
                          onChange={handleInputChange}
                          className="accent-purple-500 w-4 h-4 cursor-pointer"
                        />
                        Men
                      </label>
                      <label className="inline-flex items-center gap-2 text-gray-300 cursor-pointer">
                        <input
                          type="radio"
                          name="style"
                          value="Women"
                          checked={formData.style === "Women"}
                          onChange={handleInputChange}
                          className="accent-pink-500 w-4 h-4 cursor-pointer"
                        />
                        Women
                      </label>
                    </div>
                  ) : (
                    <div className="w-full rounded-lg bg-gray-700/50 text-white px-4 py-3">
                      {formData.style}
                    </div>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Country
                  </label>
                  {isEditing ? (
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-600 bg-gray-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 transition"
                    >
                      <option value="">Select country</option>
                      {countries.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full rounded-lg bg-gray-700/50 text-white px-4 py-3 flex items-center gap-2">
                      <MapPin size={16} className="text-purple-400" />
                      {formData.country || "-"}
                    </div>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    City
                  </label>
                  {isEditing ? (
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-600 bg-gray-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 transition"
                      disabled={!formData.country}
                    >
                      <option value="">Select city</option>
                      {formData.country &&
                        citiesByCountry[formData.country]?.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <div className="w-full rounded-lg bg-gray-700/50 text-white px-4 py-3">
                      {formData.city || "-"}
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info Section */}
              <div className="mt-8 bg-gray-700/50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Additional Information
                </h2>
                <p className="text-gray-400">
                  {formData.bio || "No bio available. Click Edit Profile to add one."}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;