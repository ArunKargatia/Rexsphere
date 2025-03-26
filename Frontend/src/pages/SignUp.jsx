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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[var(--color-background)] to-[color-mix(in_srgb,var(--color-background),black_10%)] px-4 py-12">
      <div className="bg-[var(--color-card)] p-8 rounded-3xl shadow-2xl w-full max-w-[500px] border border-gray-700/30 backdrop-blur-sm">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-[var(--color-text-primary)] tracking-tight mb-2">Create Account</h2>
          <p className="text-[var(--color-text-secondary)] text-base opacity-80">Sign up to explore personalized recommendations</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-center text-sm flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-500 text-center text-sm flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" 
              name="firstName" 
              placeholder="First Name" 
              value={formData.firstName} 
              onChange={handleChange} 
              className="p-3.5 border border-gray-700/50 rounded-xl bg-[var(--color-background)]/70 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/70 focus:border-transparent transition-all duration-200 placeholder-gray-500 text-sm hover:scale-[1.02] focus:scale-[1.02]" 
              required 
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              value={formData.email} 
              onChange={handleChange} 
              className="p-3.5 border border-gray-700/50 rounded-xl bg-[var(--color-background)]/70 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/70 focus:border-transparent transition-all duration-200 placeholder-gray-500 text-sm hover:scale-[1.02] focus:scale-[1.02]" 
              required 
            />
          </div>

          <input 
            type="text" 
            name="userName" 
            placeholder="Username" 
            value={formData.userName} 
            onChange={handleChange} 
            className="w-full p-3.5 border border-gray-700/50 rounded-xl bg-[var(--color-background)]/70 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/70 focus:border-transparent transition-all duration-200 placeholder-gray-500 text-sm hover:scale-[1.02] focus:scale-[1.02]" 
            required 
          />

          <div className="grid grid-cols-2 gap-4">
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={formData.password} 
              onChange={handleChange} 
              className="p-3.5 border border-gray-700/50 rounded-xl bg-[var(--color-background)]/70 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/70 focus:border-transparent transition-all duration-200 placeholder-gray-500 text-sm hover:scale-[1.02] focus:scale-[1.02]" 
              required 
            />
            <input 
              type="password" 
              name="confirmPassword" 
              placeholder="Confirm Password" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              className="p-3.5 border border-gray-700/50 rounded-xl bg-[var(--color-background)]/70 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/70 focus:border-transparent transition-all duration-200 placeholder-gray-500 text-sm hover:scale-[1.02] focus:scale-[1.02]" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-4">Select Categories</label>
            <div className="grid grid-cols-3 gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 text-xs font-medium rounded-lg border border-gray-600 transition-all duration-200 truncate hover:scale-[1.05] ${formData.preferredCategories.includes(category)
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
            className="w-full py-3.5 bg-gradient-to-r from-[var(--color-primary)] to-[color-mix(in_srgb,var(--color-primary),purple_20%)] text-white font-semibold rounded-xl hover:shadow-xl hover:opacity-95 focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all duration-200 disabled:opacity-70 text-base tracking-wide hover:scale-[1.02] focus:scale-[1.02]"
          >
            {isLoading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Already have an account?{" "}
            <Link 
              to="/signin" 
              className="text-[var(--color-primary)] font-medium hover:underline transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;