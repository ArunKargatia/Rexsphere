import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import backendUrl from "../BackendUrlConfig";
import { useNavigate } from "react-router-dom";

const categories = [
  "TECHNOLOGY", "SPORTS", "MUSIC", "EDUCATION", "HEALTH",
  "TRAVEL", "GAMING", "FOOD", "BUSINESS", "MOVIES",
  "FITNESS", "ART", "SCIENCE", "BOOKS", "AUTOMOBILE",
  "ENTERTAINMENT", "PROGRAMMING", "LIFESTYLE", "OTHER"
];

const EditProfile = () => {
  const { token } = useAuth();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    mobileNumber: "",
    dateOfBirth: "",
    address: "",
    preferredCategories: [],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await backendUrl.get(`/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data;
        setUserData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          userName: user.userName || "",
          email: user.email || "",
          mobileNumber: user.mobileNumber || "",
          dateOfBirth: user.dateOfBirth || "",
          address: user.address || "",
          preferredCategories: user.preferredCategories || [],
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (category) => {
    setUserData((prevData) => {
      const isSelected = prevData.preferredCategories.includes(category);
      return {
        ...prevData,
        preferredCategories: isSelected
          ? prevData.preferredCategories.filter((c) => c !== category)
          : [...prevData.preferredCategories, category],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await backendUrl.put(
        `/user`,
        { ...userData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => navigate("/profile"), 1500);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Failed to update profile. Try again!" });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8 bg-[var(--color-card)] rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Edit Profile</h2>

      {message && (
        <p className={`mb-4 p-2 rounded-lg text-center ${message.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[ "firstName", "lastName", "userName", "email", "mobileNumber", "dateOfBirth"].map((field, index) => (
            <div key={index}>
              <label className="block text-[var(--color-text-secondary)] mb-1">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
              <input
                type={field === "dateOfBirth" ? "date" : "text"}
                name={field}
                value={userData[field] || ""}
                onChange={handleChange}
                className="w-full p-2 rounded-lg border bg-transparent text-[var(--color-text-primary)] border-gray-300 focus:border-[var(--color-primary)] focus:outline-none"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-[var(--color-text-secondary)] mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={userData.address || ""}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border bg-transparent text-[var(--color-text-primary)] border-gray-300 focus:border-[var(--color-primary)] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[var(--color-text-secondary)] mb-3">Select Categories</label>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 text-sm font-medium rounded-lg border border-gray-600 transition-all duration-200 ${
                  userData.preferredCategories.includes(category)
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-transparent text-[var(--color-text-secondary)] hover:bg-gray-800/30"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button type="button" onClick={() => navigate("/profile")} className="px-6 py-2 rounded-lg text-lg bg-gray-500 text-white shadow-md hover:bg-gray-600">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg text-lg bg-[var(--color-primary)] text-white shadow-md hover:bg-opacity-90">
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;