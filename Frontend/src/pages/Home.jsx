// src/pages/Home.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [filter, setFilter] = useState('latest');
  
  // Dummy data for UI development
  const posts = [
    {
      id: 1,
      title: "Best coffee shops in downtown",
      content: "After trying every coffee shop in the area, I've compiled my top recommendations based on atmosphere, price, and of course, coffee quality.",
      category: "Food & Drink",
      username: "coffeelover",
      createdAt: "2025-03-01T09:00:00Z",
      upvotes: 42,
      downvotes: 3,
      commentCount: 12
    },
    {
      id: 2,
      title: "Must-read sci-fi novels of 2024",
      content: "These are the science fiction books that have blown my mind this year. If you're looking for something new to read, start with these!",
      category: "Books",
      username: "bookworm",
      createdAt: "2025-03-04T14:30:00Z",
      upvotes: 128,
      downvotes: 5,
      commentCount: 24
    },
    {
      id: 3,
      title: "Most productive coding setup",
      content: "After years of experimenting, I've found the perfect hardware and software setup for coding productivity. Here's my complete recommendation.",
      category: "Technology",
      username: "devguru",
      createdAt: "2025-03-05T11:15:00Z",
      upvotes: 89,
      downvotes: 2,
      commentCount: 18
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header with filter options */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Recommendations</h1>
        <div className="flex space-x-2 bg-white p-1 rounded-lg shadow-sm">
          <button 
            onClick={() => setFilter('latest')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
              filter === 'latest' 
                ? 'bg-primary text-white' 
                : 'bg-transparent text-gray-600 hover:bg-gray-100'
            }`}
          >
            Latest
          </button>
          <button 
            onClick={() => setFilter('trending')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
              filter === 'trending' 
                ? 'bg-primary text-white' 
                : 'bg-transparent text-gray-600 hover:bg-gray-100'
            }`}
          >
            Trending
          </button>
          <button 
            onClick={() => setFilter('top')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
              filter === 'top' 
                ? 'bg-primary text-white' 
                : 'bg-transparent text-gray-600 hover:bg-gray-100'
            }`}
          >
            Top Rated
          </button>
        </div>
      </div>
      
      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          All
        </button>
        <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-full text-sm font-medium">
          Technology
        </button>
        <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-full text-sm font-medium">
          Food & Drink
        </button>
        <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-full text-sm font-medium">
          Travel
        </button>
        <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-full text-sm font-medium">
          Books
        </button>
        <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-full text-sm font-medium">
          Movies
        </button>
        <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-full text-sm font-medium">
          More...
        </button>
      </div>
      
      {/* Posts list */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex">
              {/* Vote buttons */}
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50">
                <button className="p-1 rounded text-gray-400 hover:text-primary">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className="text-gray-700 font-medium my-1">{post.upvotes - post.downvotes}</span>
                <button className="p-1 rounded text-gray-400 hover:text-red-500">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              {/* Post content */}
              <div className="flex-1 p-4">
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs mr-2">
                    {post.category}
                  </span>
                  <span>Posted by {post.username} • {formatRelativeDate(post.createdAt)}</span>
                </div>
                
                <Link to={`/post/${post.id}`}>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 hover:text-primary">
                    {post.title}
                  </h2>
                </Link>
                
                <p className="text-gray-600 mb-3 line-clamp-3">
                  {post.content}
                </p>
                
                <div className="flex items-center text-gray-500 text-sm">
                  <button className="flex items-center hover:text-primary mr-4">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {post.commentCount} Comments
                  </button>
                  <button className="flex items-center hover:text-primary">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Create Post floating button (mobile) */}
      <div className="fixed bottom-6 right-6 sm:hidden">
        <Link 
          to="/create-post" 
          className="bg-primary text-white p-4 rounded-full shadow-lg flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

// Helper function to format relative date
const formatRelativeDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
};

export default Home;