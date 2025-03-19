import React, { useEffect, useState, useRef } from "react";
import backendUrl from "../BackendUrlConfig";
import { useAuth } from "../AuthContext";
import { ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

const categories = [
  "ALL", "TECHNOLOGY", "SPORTS", "MUSIC", "EDUCATION", "HEALTH",
  "TRAVEL", "GAMING", "FOOD", "BUSINESS", "MOVIES",
  "FITNESS", "ART", "SCIENCE", "BOOKS", "AUTOMOBILE",
  "ENTERTAINMENT", "PROGRAMMING", "LIFESTYLE", "OTHER"
];

const Feed = () => {
  const { token } = useAuth();
  const [feedItems, setFeedItems] = useState([]);
  const [category, setCategory] = useState("ALL");
  const [comments, setComments] = useState({});
  const [commentCounts, setCommentCounts] = useState({});
  const [newComment, setNewComment] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [editingComment, setEditingComment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const fetchFeed = async () => {
      setIsLoading(true);
      try {
        const response = await backendUrl.get("/feed", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFeedItems(response.data);

        // Store all comments at once with deduplication
        const commentsMap = {};
        response.data.forEach((item) => {
          if (item.comments) {
            // Apply deduplication for each post's comments
            const uniqueComments = {};
            item.comments.forEach(comment => {
              uniqueComments[comment.id] = comment;
            });
            commentsMap[item.referenceId] = Object.values(uniqueComments);
          }
        });

        setComments((prev) => ({ ...prev, ...commentsMap }));

        // Batch comment count fetch operations
        const countPromises = response.data.map(item => 
          backendUrl.get(`/comment/${item.type.toLowerCase()}/${item.referenceId}/count`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(res => ({ referenceId: item.referenceId, count: res.data.count }))
          .catch(error => {
            console.error(`Error fetching comment count for ${item.referenceId}:`, error);
            return { referenceId: item.referenceId, count: 0 };
          })
        );

        // Process all count results at once to reduce state updates
        const counts = await Promise.all(countPromises);
        const countsMap = {};
        counts.forEach(({ referenceId, count }) => {
          countsMap[referenceId] = count;
        });
        
        setCommentCounts(prev => ({ ...prev, ...countsMap }));
      } catch (error) {
        console.error("Error fetching feed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, [token, category]); // Added category to dependencies to refresh when category changes

  const fetchComments = async (referenceId, type) => {
    if (!token) return;

    try {
      const res = await backendUrl.get(`/comment/${type.toLowerCase()}/${referenceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const uniqueComments = {};
      res.data.forEach(comment => {
        uniqueComments[comment.id] = comment;
      });

      setComments((prev) => ({
        ...prev,
        [referenceId]: Object.values(uniqueComments),
      }));
    } catch (error) {
      console.error(`Error fetching comments for ${referenceId}:`, error);
    }
  };

  const toggleComments = (referenceId, type) => {
    setExpandedComments((prev) => ({
      ...prev,
      [referenceId]: !prev[referenceId],
    }));

    // Only fetch comments if they're not already available
    if (!expandedComments[referenceId] && !comments[referenceId]) {
      fetchComments(referenceId, type);
    }
  };

  const handleAddComment = async (referenceId, type) => {
    if (!newComment[referenceId]?.trim()) return;

    try {
      const payload =
        type.toLowerCase() === "ask"
          ? { content: newComment[referenceId], askId: referenceId }
          : { content: newComment[referenceId], recId: referenceId };

      const res = await backendUrl.post(
        "/comment",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add the new comment to the list
      setComments((prev) => {
        // Create a new array with all existing comments plus the new one
        const existingComments = prev[referenceId] || [];
        // Make sure we don't add a duplicate
        const isDuplicate = existingComments.some(c => c.id === res.data.id);
        if (isDuplicate) return prev;
        
        return {
          ...prev,
          [referenceId]: [...existingComments, res.data],
        };
      });

      setNewComment((prev) => ({ ...prev, [referenceId]: "" }));

      // Update comment count dynamically
      setCommentCounts((prev) => ({
        ...prev,
        [referenceId]: (prev[referenceId] || 0) + 1,
      }));

    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleEditComment = (referenceId, commentId, content) => {
    setEditingComment({ referenceId, commentId, content });
  };

  const handleUpdateComment = async () => {
    if (!editingComment || !editingComment.content.trim()) return;

    try {
      const payload = {
        content: editingComment.content,
      };

      const res = await backendUrl.put(
        `/comment/${editingComment.commentId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the comment in the state
      setComments((prev) => {
        const updatedComments = prev[editingComment.referenceId].map((comment) =>
          comment.id === editingComment.commentId ? res.data : comment
        );
        return { ...prev, [editingComment.referenceId]: updatedComments };
      });

      setEditingComment(null); // Clear the editing state
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const formatDate = (date) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };


  return (
    <div className="max-w-4xl mx-auto p-6 bg-[var(--color-background)] min-h-screen text-[var(--color-text-primary)]">
      <h1 className="text-3xl font-bold text-center mb-6">Feed</h1>

      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => scrollRef.current.scrollBy({ left: -200, behavior: "smooth" })} 
          className="p-2 bg-gray-800/70 text-white rounded-full"
          aria-label="Scroll categories left"
        >
          <ChevronLeft size={24} />
        </button>

        <div 
          ref={scrollRef} 
          className="flex gap-4 overflow-x-auto px-2 scrollbar-hide scroll-smooth"
          role="tablist"
          aria-label="Content categories"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-lg shadow-md transition-all whitespace-nowrap ${
                category === cat ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-card)] hover:bg-opacity-80"
              }`}
              onClick={() => setCategory(cat)}
              role="tab"
              aria-selected={category === cat}
              aria-controls={`${cat.toLowerCase()}-content`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button 
          onClick={() => scrollRef.current.scrollBy({ left: 200, behavior: "smooth" })} 
          className="p-2 bg-gray-800/70 text-white rounded-full"
          aria-label="Scroll categories right"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {feedItems
            .filter((item) => category === "ALL" || item.category.toUpperCase() === category)
            .map((item) => (
              <div 
                key={item.referenceId} 
                className="bg-[var(--color-card)] p-6 rounded-xl shadow-lg border border-gray-700/30"
                role="article"
              >
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-[var(--color-text-secondary)] font-semibold">{item.category}</p>
                  <p className="text-sm text-[var(--color-text-secondary)] font-semibold">
                    {item.type === "REC" ? "REC" : "ASK"}
                  </p>
                </div>

                <h2 className="text-lg font-semibold mb-2">{item.content}</h2>

                {/* Enhanced Username Display */}
                <p className="text-sm text-[var(--color-text-secondary)]">
                  By: <span className="hover:underline cursor-pointer">@{item.user.userName}</span>
                </p>

                {/* Added Date */}
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Posted on: {formatDate(item.createdAt)}
                </p>

                <div 
                  className="flex items-center gap-3 mt-4 cursor-pointer" 
                  onClick={() => toggleComments(item.referenceId, item.type)}
                  role="button"
                  aria-expanded={expandedComments[item.referenceId]}
                  aria-controls={`comments-${item.referenceId}`}
                >
                  <MessageSquare size={20} className="text-[var(--color-primary)]" />
                  <span className="text-sm">{commentCounts[item.referenceId] || 0} Comments</span>
                </div>

                {expandedComments[item.referenceId] && (
                  <div 
                    id={`comments-${item.referenceId}`}
                    className="mt-4 p-4 rounded-2xl bg-[var(--color-background-secondary)] shadow-xl transition-all duration-300"
                  >
                    {comments[item.referenceId]?.length > 0 ? (
                      comments[item.referenceId]?.map((comment, index) => (
                        <div 
                          key={`${item.referenceId}-${comment.id}-${index}`} 
                          className="p-2 mb-2 bg-[var(--color-background)] rounded-lg"
                        >
                          <p>{comment.content}</p>
                          <span className="text-xs text-[var(--color-text-secondary)]">- {comment.user.userName}</span>
                          <button
                            onClick={() => handleEditComment(item.referenceId, comment.id, comment.content)}
                            className="text-blue-500 text-xs ml-2"
                            aria-label="Edit comment"
                          >
                            Edit
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>No comments yet.</p>
                    )}

                    {editingComment && editingComment.referenceId === item.referenceId && (
                      <div className="mt-4 flex items-center gap-2">
                        <input
                          type="text"
                          value={editingComment.content}
                          onChange={(e) => setEditingComment((prev) => ({ ...prev, content: e.target.value }))}
                          className="flex-1 p-2 rounded-full bg-[var(--color-background)]"
                          aria-label="Edit comment text"
                        />
                        <button
                          onClick={handleUpdateComment}
                          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-full"
                        >
                          Update
                        </button>
                      </div>
                    )}

                    <div className="mt-4 flex items-center gap-2">
                      <input
                        type="text"
                        value={newComment[item.referenceId] || ""}
                        onChange={(e) => setNewComment((prev) => ({ ...prev, [item.referenceId]: e.target.value }))}
                        placeholder="Add a comment..."
                        className="flex-1 p-2 rounded-full bg-[var(--color-background)]"
                        aria-label="New comment text"
                      />
                      <button
                        onClick={() => handleAddComment(item.referenceId, item.type)}
                        className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-full"
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Feed;