import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import backendUrl from "../BackendUrlConfig";
import { useNavigate } from "react-router-dom";

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
      <p className="text-center text-[var(--color-text-secondary)] text-lg mt-10">
        Loading...
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto mt-12 p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Profile Sidebar */}
      <div className="bg-[var(--color-card)] p-6 rounded-2xl shadow-lg flex flex-col items-center">
        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[var(--color-primary)] shadow-lg">
          <img
            src={
              user.profilePictureUrl ||
              "https://cdn-icons-png.flaticon.com/512/64/64572.png"
            }
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-semibold mt-6 text-[var(--color-text-primary)]">
          {user.firstName || "Not Provided"} {user.lastName || ""}
        </h2>
        <p className="text-[var(--color-text-secondary)] text-lg">@{user.userName || "Not Provided"}</p>

        <div className="mt-8 space-y-3 w-full">
          <button
            onClick={() => navigate("/edit-profile")}
            className="w-full px-5 py-2 text-lg font-semibold bg-[var(--color-primary)] text-white rounded-lg shadow-md hover:bg-opacity-90 transition-transform transform hover:scale-105"
          >
            Edit Profile
          </button>
          <button
            onClick={() => navigate("/update-password")}
            className="w-full px-5 py-2 text-lg font-semibold bg-red-500 text-white rounded-lg shadow-md hover:bg-opacity-90 transition-transform transform hover:scale-105">
            Change Password
          </button>
        </div>
      </div>

      {/* User Details Section */}
      <div className="md:col-span-2 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* User Details Cards */}
          {[
            { label: "Email", value: user.email },
            { label: "Mobile", value: user.mobileNumber },
            { label: "Date of Birth", value: user.dateOfBirth },
            { label: "Address", value: user.address },
          ].map((item, index) => (
            <div key={index} className="p-6 bg-[var(--color-card)] rounded-lg shadow-lg">
              <p className="text-[var(--color-text-secondary)]">{item.label}</p>
              <p className="font-semibold text-[var(--color-text-primary)]">
                {item.value || "Not Provided"}
              </p>
            </div>
          ))}
        </div>

        {/* Full-width Section */}
        {[
          { label: "Preferred Categories", value: user.preferredCategories?.join(", ") || "Not Provided" },
          { label: "Joined", value: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Not Provided" },
        ].map((item, index) => (
          <div key={index} className="p-6 bg-[var(--color-card)] rounded-lg shadow-lg">
            <p className="text-[var(--color-text-secondary)]">{item.label}</p>
            <p className="font-semibold text-[var(--color-text-primary)]">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
