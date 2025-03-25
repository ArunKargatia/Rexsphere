import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import backendUrl from "../BackendUrlConfig";
import { useNavigate } from "react-router-dom";
import {
  Edit,
  Lock,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Star,
  Clock,
  User as UserIcon
} from "lucide-react";

const Profile = () => {
  const { token, getUserIdFromToken } = useAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = getUserIdFromToken();
        if (!userId) return;

        const response = await backendUrl.get(`/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token, getUserIdFromToken]);

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[var(--color-text-secondary)] text-xl">
          Loading Profile...
        </div>
      </div>
    );

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
              transform transition-transform duration-300 hover:scale-105">
              <img
                src={
                  user.profilePictureUrl ||
                  "https://cdn-icons-png.flaticon.com/512/64/64572.png"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center mt-6">
              <h2 className="text-3xl font-bold
                bg-clip-text text-transparent bg-gradient-to-r 
                from-[var(--color-text-primary)] to-[var(--color-primary)]">
                {user.firstName || "Not Provided"} {user.lastName || ""}
              </h2>
              <p className="text-[var(--color-text-secondary)] text-lg mt-2">
                @{user.userName || "Not Provided"}
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <button
                onClick={() => navigate("/edit-profile")}
                className="w-full flex items-center justify-center space-x-3 
                  px-6 py-3 bg-[var(--color-primary)] text-white 
                  rounded-full font-semibold shadow-lg 
                  hover:shadow-xl transform hover:-translate-y-1 
                  transition-all duration-300 group"
              >
                <Edit className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => navigate("/update-password")}
                className="w-full flex items-center justify-center space-x-3 
                  px-6 py-3 bg-red-500 text-white 
                  rounded-full font-semibold shadow-lg 
                  hover:shadow-xl transform hover:-translate-y-1 
                  transition-all duration-300 group"
              >
                <Lock className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                <span>Change Password</span>
              </button>
            </div>
          </div>
        </div>

        {/* User Details Section */}
        <div className="md:col-span-2 space-y-8">
          {/* User Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                label: "Email",
                value: user.email,
                icon: Mail
              },
              {
                label: "Mobile",
                value: user.mobileNumber,
                icon: Phone
              },
              {
                label: "Date of Birth",
                value: user.dateOfBirth,
                icon: Calendar
              },
              {
                label: "Address",
                value: user.address,
                icon: MapPin
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 bg-[var(--color-card)] rounded-2xl 
                  shadow-lg border border-gray-700/20 
                  transform transition-transform hover:scale-105 
                  hover:shadow-xl duration-300 group"
              >
                <div className="flex items-center space-x-4 mb-3">
                  <item.icon
                    className="w-6 h-6 text-[var(--color-primary)] 
                      group-hover:rotate-12 transition-transform"
                  />
                  <p className="text-[var(--color-text-secondary)]">{item.label}</p>
                </div>
                <p className="font-semibold text-[var(--color-text-primary)] text-lg">
                  {item.value || "Not Provided"}
                </p>
              </div>
            ))}
          </div>

          {/* Full-width Sections */}
          {[
            {
              label: "Preferred Categories",
              value: user.preferredCategories?.join(", ") || "Not Provided",
              icon: Star
            },
            {
              label: "Joined",
              value: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Not Provided",
              icon: Clock
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-6 bg-[var(--color-card)] rounded-2xl 
                shadow-lg border border-gray-700/20 
                transform transition-transform hover:scale-105 
                hover:shadow-xl duration-300 group"
            >
              <div className="flex items-center space-x-4 mb-3">
                <item.icon
                  className="w-6 h-6 text-[var(--color-primary)] 
                    group-hover:rotate-12 transition-transform"
                />
                <p className="text-[var(--color-text-secondary)]">{item.label}</p>
              </div>
              <p className="font-semibold text-[var(--color-text-primary)] text-lg">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;