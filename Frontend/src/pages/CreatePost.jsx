// src/pages/CreatePost.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Dummy categories for UI development
  const categories = [
    "Technology", 
    "Food & Drink", 
    "Travel", 
    "Books", 
    "Movies", 
    "Music", 
    "Sports", 
    "Fashion", 
    "Health"
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Here you would normally send the data to your API
    console.log({ title, content, category });
    
    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      // Redirect would happen here after successful creation
    }, 1000);
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Create Recommendation</h1>
        <Link to="/" className="text-gray-600 hover:text-primary">
          Cancel
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="What are you recommending?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          {/* Category */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
              Category
            </label>
            <select
              id="category"
              className="w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          {/* Content */}
          <div className="mb-6">
            <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
              Details
            </label>
            <textarea
              id="content"
              className="w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows="10"
              placeholder="Share your detailed recommendation..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
            <p className="text-gray-500 text-sm mt-1">
              Use **text** for bold and *text* for italic. You can also create lists with 1. or -.
            </p>
          </div>
          
          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Posting...
                </>
              ) : 'Post Recommendation'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-blue-800 font-medium mb-2">Posting Tips</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Be specific about what you're recommending</li>
          <li>• Explain why you recommend it</li>
          <li>• Include relevant details (price, location, etc.)</li>
          <li>• Consider mentioning alternatives</li>
          <li>• Be authentic - share your real experience</li>
        </ul>
      </div>
    </div>
  );
};

export default CreatePost;