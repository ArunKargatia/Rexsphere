import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, Shield, CheckCircle, AlertCircle } from "lucide-react";
import backendUrl from "../BackendUrlConfig";
import { useAuth } from "../AuthContext";

const UpdatePassword = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [updatedPassword, setUpdatedPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordMatch = confirmPassword && updatedPassword === confirmPassword;

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (updatedPassword !== confirmPassword) {
      setMessage("New passwords do not match");
      setMessageType("error");
      return;
    }

    setIsSubmitting(true);
    try {
      await backendUrl.put(
        "/user/update-password",
        { currentPassword, updatedPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Password updated successfully!");
      setMessageType("success");
      setTimeout(() => navigate("/profile"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update password");
      setMessageType("error");
      console.error("Error updating password:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-background)] to-[var(--color-background-light)] 
      flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full mx-auto p-8 bg-[var(--color-card)] text-[var(--color-text-primary)] 
        shadow-2xl rounded-3xl border border-gray-700/20 relative overflow-hidden">
        {/* Subtle Gradient Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        <button
          onClick={() => navigate("/profile")}
          className="flex items-center text-[var(--color-secondary)] 
            hover:text-[var(--color-primary)] mb-6 transition-colors duration-200"
        >
          <ArrowLeft size={18} className="mr-2" /> <span>Back to Profile</span>
        </button>

        <div className="flex items-center mb-6">
          <Shield className="text-[var(--color-primary)] mr-3" size={24} />
          <h2 className="text-2xl font-bold bg-clip-text text-transparent 
            bg-gradient-to-r from-[var(--color-text-primary)] to-[var(--color-primary)]">
            Update Password
          </h2>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${messageType === "success"
            ? "bg-green-900/20 border border-green-800/50 text-green-400"
            : "bg-red-900/20 border border-red-800/50 text-red-400"
            }`}>
            {messageType === "success" ? (
              <CheckCircle size={18} className="mr-2" />
            ) : (
              <AlertCircle size={18} className="mr-2" />
            )}
            <p className="text-sm">{message}</p>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-5">
          {[
            {
              label: "Current Password",
              value: currentPassword,
              setValue: setCurrentPassword
            },
            {
              label: "New Password",
              value: updatedPassword,
              setValue: setUpdatedPassword
            },
            {
              label: "Confirm New Password",
              value: confirmPassword,
              setValue: setConfirmPassword,
              showValidation: true
            }
          ].map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                {field.label}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={field.value}
                  onChange={(e) => field.setValue(e.target.value)}
                  className={`w-full p-3 pl-4 pr-10 bg-[var(--color-background)] 
                    border rounded-lg focus:outline-none focus:ring-2 
                    focus:ring-[var(--color-primary)] focus:border-transparent 
                    transition-all duration-200 ${field.showValidation && field.value
                      ? (passwordMatch ? 'border-green-500' : 'border-red-500')
                      : 'border-gray-600'
                    }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 
                    text-[var(--color-text-secondary)] 
                    hover:text-[var(--color-text-primary)] 
                    transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {field.showValidation && field.value && (
                <p className={`text-xs mt-1 ${passwordMatch ? 'text-green-400' : 'text-red-400'
                  }`}>
                  {passwordMatch ? 'Passwords match' : 'Passwords do not match'}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting || (confirmPassword && !passwordMatch)}
            className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-indigo-500 
              text-white p-3 rounded-lg hover:from-indigo-500 hover:to-indigo-400 
              transition duration-300 font-medium flex items-center justify-center 
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;