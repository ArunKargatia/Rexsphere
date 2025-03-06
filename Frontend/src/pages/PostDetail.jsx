// src/pages/PostDetail.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const PostDetail = () => {
  const { id } = useParams();
  const [commentText, setCommentText] = useState('');
  
  // Dummy data for UI development
  const post = {
    id: id,
    title: "Best coffee shops in downtown",
    content: "After trying every coffee shop in the area, I've compiled my top recommendations based on atmosphere, price, and of course, coffee quality.\n\nTop picks:\n\n1. **Brew Haven** - Amazing atmosphere and their pour-over is incredible\n2. **Bean Counter** - Best value and they have great pastries\n3. **Caffeine Lab** - Most innovative drinks and nicest staff\n\nI've visited each place at least 5 times to make sure my recommendations are consistent. Let me know if you've been to any of these places and what you thought!",
    category: "Food & Drink",
    username: "coffeelover",
    createdAt: "2025-03-01T09:00:00Z",
    upvotes: 42,
    downvotes: 3,
    voteScore: 39
  };
  
  // Dummy comments
  const comments = [
    {
      id: 1,
      username: "latte_artist",
      content: "Great list! I'd also add 'Morning Bliss' to this list. Their cold brew is amazing.",
      createdAt: "2025-03-01T10:30:00Z",
      upvotes: 8,
      downvotes: 0
    },
    {
      id: 2,
      username: "espresso_man",
      content: "Bean Counter is overrated imo. Their coffee is good but not great.",
      createdAt: "2025-03-02T14:15:00Z",
      upvotes: 3,
      downvotes: 5
    },
    {
      id: 3,
      username: "coffeelover",
      content: "Thanks for the feedback! I'll check out Morning Bliss next week.",
      createdAt: "2025-03-02T16:45:00Z",
      upvotes: 4,
      downvotes: 0
    }
  ];
  
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // Would handle comment submission here
    setCommentText('');
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <Link to="/" className="flex items-center text-gray-600 hover:text-primary mb-6">
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Recommendations
      </Link>
      
      {/* Post card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="flex">
          {/* Vote buttons */}
          <div className="flex flex-col items-center justify-start p-4 bg-gray-50">
            <button className="p-1 rounded text-gray-400 hover:text-primary">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <span className="text-gray-700 font-medium my-1">{post.voteScore}</span>
            <button className="p-1 rounded text-gray-400 hover:text-red-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Post content */}
          <div className="flex-1 p-4">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs mr-2">
                {post.category}
              </span>
              <span>Posted by {post.username} • {formatRelativeDate(post.createdAt)}</span>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {post.title}
            </h1>
            
            <div className="prose max-w-none text-gray-700 mb-4">
              {post.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph.includes('**') 
                    ? paragraph.split('**').map((part, i) => 
                        i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                      )
                    : paragraph}
                </p>
              ))}
            </div>
            
            <div className="flex items-center text-gray-500 text-sm border-t pt-4">
              <button className="flex items-center hover:text-primary mr-4">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {comments.length} Comments
              </button>
              <button className="flex items-center hover:text-primary mr-4">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Save
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
      
      {/* Comment form */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add a Comment</h3>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            className="w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows="3"
            placeholder="What are your thoughts?"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
          ></textarea>
          <div className="flex justify-end mt-3">
            <button 
              type="submit" 
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Comment
            </button>
          </div>
        </form>
      </div>
      
      {/* Comments list */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Comments ({comments.length})
        </h3>
        
        {comments.map(comment => (
          <div key={comment.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span className="font-medium text-gray-700 mr-2">{comment.username}</span>
              <span>{formatRelativeDate(comment.createdAt)}</span>
            </div>
            <p className="text-gray-700 mb-3">{comment.content}</p>
            <div className="flex items-center text-gray-500 text-sm">
              <button className="flex items-center hover:text-primary mr-3">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                {comment.upvotes}
              </button>
              <button className="flex items-center hover:text-red-500 mr-3">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                </svg>
                {comment.downvotes}
              </button>
              <button className="text-gray-500 hover:text-primary">
                Reply
              </button>
            </div>
          </div>
        ))}
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

export default PostDetail;