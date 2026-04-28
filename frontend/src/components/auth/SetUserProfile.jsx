import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Camera, ChevronDown } from "lucide-react";

const countries = ["USA", "India", "Germany", "France", "Japan"];
const citiesByCountry = {
  USA: ["New York", "Los Angeles", "San Francisco"],
  India: ["Delhi", "Mumbai", "Bangalore"],
  Germany: ["Berlin", "Munich", "Frankfurt"],
  France: ["Paris", "Lyon", "Marseille"],
  Japan: ["Tokyo", "Osaka", "Yokohama"],
};

const SetUserProfile = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    style: "Men",
    phone: "",
    country: "",
    city: "",
    profilePic: null,
  });
  const [profilePreview, setProfilePreview] = useState(null);

  const fileInput = useRef();
  const formRef = useRef(null);
  const inView = useInView(formRef, { once: true, margin: "-100px" });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "country" ? { city: "" } : {}),
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser((prev) => ({ ...prev, profilePic: file }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFile = () => fileInput.current.click();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit update logic here
    console.log("User data:", user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 py-8 px-2">
      <motion.form
        ref={formRef}
        initial={{ opacity: 0, y: 60 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-xl p-8 flex flex-col md:flex-row gap-10 border border-gray-700"
      >
        {/* Left side - Form */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-6 text-center text-purple-400">
            Set up your User account
          </h2>
          <div className="flex flex-col gap-5">
            {/* First & Last Name */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                First Name *
              </label>
              <input
                className="w-full rounded-md border border-gray-600 bg-gray-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 transition placeholder-gray-400"
                name="firstName"
                placeholder="Enter first name"
                required
                value={user.firstName}
                onChange={handleInput}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Last Name *
              </label>
              <input
                className="w-full rounded-md border border-gray-600 bg-gray-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 transition placeholder-gray-400"
                name="lastName"
                placeholder="Enter last name"
                required
                value={user.lastName}
                onChange={handleInput}
              />
            </div>
            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="flex items-center gap-3 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-600 transition group text-gray-200"
                  onClick={triggerFile}
                >
                  <span>
                    <Camera className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                  </span>
                  <span className="font-medium">
                    Select Profile Picture
                  </span>
                  <ChevronDown className="w-4 h-4 ml-2 text-gray-400" />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInput}
                  className="hidden"
                  onChange={handleImage}
                />
              </div>
              {profilePreview && (
                <div className="mt-3 flex justify-start">
                  <img
                    src={profilePreview}
                    alt="Profile Preview"
                    className="rounded-xl w-20 h-20 object-cover shadow border border-gray-600"
                  />
                </div>
              )}
            </div>
            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Date of Birth *
              </label>
              <input
                className="w-full rounded-md border border-gray-600 bg-gray-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 transition"
                name="dob"
                type="date"
                placeholder="dd-mm-yyyy"
                required
                value={user.dob}
                onChange={handleInput}
              />
            </div>
            {/* Style Preference */}
            <div>
              <legend className="block text-sm mb-2 font-medium text-gray-300">
                Style Preference *
              </legend>
              <div className="flex gap-8">
                <label className="inline-flex items-center gap-2 text-gray-300">
                  <input
                    type="radio"
                    name="style"
                    value="Men"
                    checked={user.style === "Men"}
                    onChange={handleInput}
                    className="accent-purple-500"
                  />
                  Men
                </label>
                <label className="inline-flex items-center gap-2 text-gray-300">
                  <input
                    type="radio"
                    name="style"
                    value="Women"
                    checked={user.style === "Women"}
                    onChange={handleInput}
                    className="accent-pink-500"
                  />
                  Women
                </label>
              </div>
            </div>
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                pattern="[0-9\- ]+"
                className="w-full rounded-md border border-gray-600 bg-gray-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 transition placeholder-gray-400"
                placeholder="Enter phone number"
                value={user.phone}
                onChange={handleInput}
              />
            </div>
          </div>
        </div>
        {/* Right side - Portrait & location */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          <div className="w-[280px] h-[280px] md:w-[330px] md:h-[330px] bg-gray-700 rounded-2xl overflow-hidden shadow-inner mb-4 flex items-center justify-center border border-gray-600 relative">
            {profilePreview ? (
              <img
                src={profilePreview}
                alt="profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-400 p-4 text-center">
                <Camera className="w-16 h-16 mb-4" />
                <span className="text-lg font-medium mb-1">Profile Preview</span>
                <span className="text-sm">Upload a photo to see preview</span>
              </div>
            )}
          </div>
          {/* Country/City */}
          <div className="w-full flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Country *
              </label>
              <select
                name="country"
                required
                value={user.country}
                className="w-full rounded-md border border-gray-600 bg-gray-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 transition"
                onChange={handleInput}
              >
                <option value="" className="text-gray-400">Select country</option>
                {countries.map((c) => (
                  <option key={c} value={c} className="text-gray-900">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">City</label>
              <select
                name="city"
                value={user.city}
                className="w-full rounded-md border border-gray-600 bg-gray-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 transition"
                onChange={handleInput}
                disabled={!user.country}
              >
                <option value="" className="text-gray-400">Select city</option>
                {user.country &&
                  citiesByCountry[user.country]?.map((city) => (
                    <option key={city} value={city} className="text-gray-900">
                      {city}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="w-full mt-4">
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300"
            >
              Complete Profile
            </button>
          </div>
        </div>
      </motion.form>
    </div>
  );
};

export default SetUserProfile;