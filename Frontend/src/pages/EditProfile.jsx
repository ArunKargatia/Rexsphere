import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import backendUrl from "../BackendUrlConfig";
import { useNavigate } from "react-router-dom";
import {
  Save,
  X,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Star,
  User as UserIcon,
  ImagePlus
} from "lucide-react";

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
    profilePictureUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
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
          profilePictureUrl: user.profilePictureUrl || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage({
          type: "error",
          text: "Failed to fetch user data. Please try again."
        });
      }
    };

    fetchUserData();
  }, [token]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);

      // Create a preview of the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData(prev => ({
          ...prev,
          profilePictureUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
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
      // First, upload profile picture if a new file is selected
      if (profilePictureFile) {
        const formData = new FormData();
        formData.append('file', profilePictureFile);

        const uploadResponse = await backendUrl.post(
          `/user/upload-profile-picture`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            },
          }
        );

        // Update profilePictureUrl in userData with the new URL
        setUserData(prev => ({
          ...prev,
          profilePictureUrl: uploadResponse.data
        }));
      }

      // Then update user profile
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
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-background)] to-[var(--color-background-light)] 
      pt-24 md:pt-32 px-4 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="bg-[var(--color-card)] p-8 rounded-3xl shadow-2xl 
          border border-gray-700/20 relative overflow-hidden">
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 
            to-[var(--color-primary)]/5 opacity-50 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden 
              border-4 border-[var(--color-primary)] shadow-2xl 
              transform transition-transform duration-300 hover:scale-105 relative">
              <input
                type="file"
                id="profilePicture"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
              />
              <div className="absolute inset-0 z-10 flex items-center justify-center 
                bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <ImagePlus className="w-10 h-10 text-white" />
              </div>
              <img
                src={userData.profilePictureUrl || "https://cdn-icons-png.flaticon.com/512/64/64572.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center mt-6">
              <h2 className="text-3xl font-bold
                bg-clip-text text-transparent bg-gradient-to-r 
                from-[var(--color-text-primary)] to-[var(--color-primary)]">
                Edit Profile
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                Click on the profile picture to upload a new image
              </p>
            </div>
          </div>
        </div>

        {/* Edit Profile Section */}
        <div className="md:col-span-2 space-y-8">
          {message && (
            <div className={`p-4 rounded-2xl text-center shadow-lg ${message.type === "success"
                ? "bg-green-500/20 text-green-600"
                : "bg-red-500/20 text-red-600"
              }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  name: "firstName",
                  label: "First Name",
                  icon: UserIcon
                },
                {
                  name: "lastName",
                  label: "Last Name",
                  icon: UserIcon
                },
                {
                  name: "userName",
                  label: "Username",
                  icon: UserPlus
                },
                {
                  name: "email",
                  label: "Email",
                  icon: Mail
                },
                {
                  name: "mobileNumber",
                  label: "Mobile Number",
                  icon: Phone
                },
                {
                  name: "dateOfBirth",
                  label: "Date of Birth",
                  icon: Calendar,
                  type: "date"
                },
              ].map((field) => (
                <div
                  key={field.name}
                  className="p-6 bg-[var(--color-card)] rounded-2xl 
                    shadow-lg border border-gray-700/20 
                    transform transition-transform hover:scale-105 
                    hover:shadow-xl duration-300 group"
                >
                  <div className="flex items-center space-x-4 mb-3">
                    <field.icon
                      className="w-6 h-6 text-[var(--color-primary)] 
                        group-hover:rotate-12 transition-transform"
                    />
                    <p className="text-[var(--color-text-secondary)]">{field.label}</p>
                  </div>
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={userData[field.name] || ""}
                    onChange={handleChange}
                    className="w-full bg-transparent text-[var(--color-text-primary)] 
                      text-lg font-semibold border-b border-gray-300 
                      focus:border-[var(--color-primary)] focus:outline-none 
                      transition-colors duration-300"
                  />
                </div>
              ))}
            </div>

            <div
              className="p-6 bg-[var(--color-card)] rounded-2xl 
                shadow-lg border border-gray-700/20 
                transform transition-transform hover:scale-105 
                hover:shadow-xl duration-300 group"
            >
              <div className="flex items-center space-x-4 mb-3">
                <MapPin
                  className="w-6 h-6 text-[var(--color-primary)] 
                    group-hover:rotate-12 transition-transform"
                />
                <p className="text-[var(--color-text-secondary)]">Address</p>
              </div>
              <input
                type="text"
                name="address"
                value={userData.address || ""}
                onChange={handleChange}
                className="w-full bg-transparent text-[var(--color-text-primary)] 
                  text-lg font-semibold border-b border-gray-300 
                  focus:border-[var(--color-primary)] focus:outline-none 
                  transition-colors duration-300"
              />
            </div>

            <div
              className="p-6 bg-[var(--color-card)] rounded-2xl 
                shadow-lg border border-gray-700/20 
                transform transition-transform hover:scale-105 
                hover:shadow-xl duration-300 group"
            >
              <div className="flex items-center space-x-4 mb-3">
                <Star
                  className="w-6 h-6 text-[var(--color-primary)] 
                    group-hover:rotate-12 transition-transform"
                />
                <p className="text-[var(--color-text-secondary)]">Select Categories</p>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryChange(category)}
                    className={`px-3 py-2 text-xs rounded-full border transition-all duration-200 ${userData.preferredCategories.includes(category)
                        ? "bg-[var(--color-primary)] text-white border-transparent"
                        : "bg-transparent text-[var(--color-text-secondary)] border-gray-300 hover:bg-gray-100/20"
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex items-center space-x-2 px-6 py-3 
                  bg-red-500 text-white rounded-full font-semibold 
                  shadow-lg hover:shadow-xl transform hover:-translate-y-1 
                  transition-all duration-300 group"
              >
                <X className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 
                  bg-[var(--color-primary)] text-white rounded-full 
                  font-semibold shadow-lg hover:shadow-xl 
                  transform hover:-translate-y-1 transition-all 
                  duration-300 group"
              >
                <Save className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                <span>{loading ? "Updating..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;