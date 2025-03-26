import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { ArrowRight, Globe, Zap, Star, Users, TrendingUp } from "lucide-react";
import { useAuth } from '../AuthContext'; // Make sure to import the AuthContext

const categories = [
  { name: "Technology", icon: Globe },
  { name: "Sports", icon: Zap },
  { name: "Music", icon: Star },
  { name: "Education", icon: Users },
  { name: "Health", icon: TrendingUp },
  { name: "Gaming", icon: Globe },
  { name: "Business", icon: TrendingUp },
  { name: "Movies", icon: Star },
  { name: "Fitness", icon: Zap },
  { name: "Science", icon: Users }
];

const Home = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const { isAuthenticated } = useAuth(); // Use the AuthContext to check authentication status

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-background)] to-[var(--color-background-light)] 
      text-[var(--color-text-primary)] flex flex-col justify-center items-center px-6 py-12 overflow-hidden 
      pt-24 md:pt-32">  {/* Added top padding to prevent navbar overlap */}

      {/* Animated Background Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)] opacity-10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-secondary)] opacity-10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 text-center max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6 
          bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-text-primary)] to-[var(--color-primary)]">
          Explore. <br />Share. <br />Recommend.
        </h1>

        <p className="mt-5 text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 
          font-medium leading-relaxed opacity-80">
          Join a vibrant community where curiosity meets connection.
          Discover trending insights, share your passions, and explore
          recommendations that inspire and challenge you.
        </p>

        <div className="flex justify-center space-x-4">
          <Link
            to={isAuthenticated ? "/feed" : "/signup"} // Conditional routing based on authentication
            className="inline-flex items-center px-8 py-4 bg-[var(--color-primary)] 
              text-white rounded-full text-lg font-semibold 
              shadow-xl hover:shadow-2xl transform hover:-translate-y-1 
              transition-all duration-300 ease-in-out group"
          >
            {isAuthenticated ? "Go to Feed" : "Get Started"}
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Categories Showcase */}
      <div className="relative z-10 mt-20 w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-12 
          bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-text-primary)] to-[var(--color-primary)]">
          Popular Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {categories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <div
                key={category.name}
                onMouseEnter={() => setHoveredCategory(category.name)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`p-6 border border-gray-700/30 rounded-2xl text-center 
                  transition-all duration-300 ease-in-out transform 
                  ${hoveredCategory === category.name
                    ? 'scale-105 bg-[var(--color-primary)] text-white shadow-2xl'
                    : 'bg-[var(--color-card)] hover:bg-[var(--color-card-hover)]'}
                  flex flex-col items-center justify-center space-y-3 
                  cursor-pointer group`}
              >
                <CategoryIcon
                  className={`w-10 h-10 
                    ${hoveredCategory === category.name
                      ? 'text-white'
                      : 'text-[var(--color-primary)] group-hover:text-[var(--color-primary)]'}`}
                />
                <span className="text-lg font-semibold">{category.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;