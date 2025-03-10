import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const categories = [
  "Technology", "Sports", "Music", "Education", "Health",
  "Gaming", "Business", "Movies", "Fitness", "Science"
];

const Home = () => {
  return (
    <div className="h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] flex flex-col justify-center items-center px-6">
      {/* Hero Section */}
      <div className="text-center max-w-4xl">
      <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
        <span>Ask.</span>
        <span className="mx-2">Share.</span>
        <span>Recommend.</span>
        </h1>

        <p className="mt-5 text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          Discover trending topics, share insights, and explore what others love. 
          Join a growing community shaping the best recommendations.
        </p>
        <Link
          to="/signup"
          className="mt-8 inline-flex items-center px-8 py-4 bg-[var(--color-primary)] text-white rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          Get Started <ArrowRight className="ml-3 w-6 h-6" />
        </Link>
      </div>

      {/* Categories Showcase */}
      <div className="mt-16 w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-8">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {categories.map((category) => (
            <div
              key={category}
              className="p-6 border border-gray-700/50 rounded-xl bg-[var(--color-card)] text-center text-lg font-semibold cursor-pointer 
              hover:bg-[var(--color-primary)] hover:text-white transition-all transform hover:scale-105 shadow-md"
            >
              {category}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
