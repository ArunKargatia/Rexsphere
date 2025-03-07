import React, { useState } from "react";
import backendUrl from "../BackendUrlConfig";
import { useNavigate, Link } from "react-router-dom";

const categories = [
    "Technology", "Sports", "Music", "Education", "Health",
    "Travel", "Gaming", "Food", "Business", "Movies",
    "Fitness", "Art", "Science", "Books", "Automobile",
    "Entertainment", "Programming", "Lifestyle", "Other"
];  

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "", email: "", userName: "", password: "",
    confirmPassword: "", preferredCategories: []
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (category) => {
    setFormData((prev) => ({
      ...prev,
      preferredCategories: prev.preferredCategories.includes(category)
        ? prev.preferredCategories.filter((cat) => cat !== category)
        : [...prev.preferredCategories, category],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await backendUrl.post("/public/register", formData);
      if (response.data) {
        setSuccessMessage("Registration successful! Redirecting...");
        setTimeout(() => navigate("/signin"), 1000);
      }
    } catch (err) {
      setError("Failed to register. Please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[var(--color-background)] to-[color-mix(in_srgb,var(--color-background),black_10%)]">
      <div className="bg-[var(--color-card)] p-8 rounded-2xl shadow-xl w-[460px] border border-gray-700/30 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">Create Account</h2>
          <p className="text-[var(--color-text-secondary)] text-sm mt-1">Sign up to explore recommendations</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-center text-sm">{error}</div>}
        {successMessage && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-center text-sm">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="p-3 border border-gray-700/50 rounded-lg bg-[var(--color-background)]/70 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/70 focus:border-transparent transition-all duration-200" required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="p-3 border border-gray-700/50 rounded-lg bg-[var(--color-background)]/70 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/70 focus:border-transparent transition-all duration-200" required />
          </div>

          <input type="text" name="userName" placeholder="Username" value={formData.userName} onChange={handleChange} className="w-full p-3 border border-gray-700/50 rounded-lg bg-[var(--color-background)]/70 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/70 focus:border-transparent transition-all duration-200" required />

          <div className="grid grid-cols-2 gap-3">
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="p-3 border border-gray-700/50 rounded-lg bg-[var(--color-background)]/70 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/70 focus:border-transparent transition-all duration-200" required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="p-3 border border-gray-700/50 rounded-lg bg-[var(--color-background)]/70 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/70 focus:border-transparent transition-all duration-200" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-3">Select Categories</label>
            <div className="grid grid-cols-3 gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border border-gray-600 transition-all duration-200 ${
                    formData.preferredCategories.includes(category)
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-transparent text-[var(--color-text-secondary)] hover:bg-gray-800/30"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-[var(--color-primary)] to-[color-mix(in_srgb,var(--color-primary),purple_20%)] text-white font-medium rounded-lg hover:shadow-lg hover:opacity-95 focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all duration-200 disabled:opacity-70"
          >
            {isLoading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
          Already have an account?
          <Link to="/signin" className="text-[var(--color-primary)] font-medium hover:underline"> Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
