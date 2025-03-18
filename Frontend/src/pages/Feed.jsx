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
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const fetchFeed = async () => {
      try {
        const response = await backendUrl.get("/feed", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedItems(response.data);
        
        // Loop through feed items and set comments directly from the response if available
        response.data.forEach((item) => {
          if (item.comments) {
            setComments((prev) => ({ ...prev, [item.id]: item.comments })); 
          }
        });

        // Fetch comment count for each post
        response.data.forEach(async (item) => {
          try {
            const res = await backendUrl.get(`/comment/${item.type.toLowerCase()}/${item.id}/count`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setCommentCounts((prev) => ({ ...prev, [item.id]: res.data.count }));
          } catch (error) {
            console.error(`Error fetching comment count for ${item.id}:`, error);
          }
        });

      } catch (error) {
        console.error("Error fetching feed:", error);
      }
    };
    
    fetchFeed();
  }, [token]);

  const fetchComments = async (itemId, type) => {
    if (!token) return;

    try {
      const res = await backendUrl.get(`/comment/${type.toLowerCase()}/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => ({ ...prev, [itemId]: res.data }));
    } catch (error) {
      console.error(`Error fetching comments for ${itemId}:`, error);
    }
  };

  const toggleComments = (itemId, type) => {
    setExpandedComments((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));

    // Only fetch comments if they're not already available
    if (!expandedComments[itemId] && !comments[itemId]) {
      fetchComments(itemId, type);
    }
  };

  const handleAddComment = async (itemId, type) => {
    if (!newComment[itemId]?.trim()) return;

    try {
      const payload =
        type.toLowerCase() === "ask"
          ? { content: newComment[itemId], askId: itemId }
          : { content: newComment[itemId], recId: itemId };

      const res = await backendUrl.post(
        "/comment",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments((prev) => ({
        ...prev,
        [itemId]: [...(prev[itemId] || []), res.data],
      }));

      setNewComment((prev) => ({ ...prev, [itemId]: "" }));

      // Update comment count dynamically
      setCommentCounts((prev) => ({
        ...prev,
        [itemId]: (prev[itemId] || 0) + 1,
      }));

    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleEditComment = (itemId, commentId, content) => {
    setEditingComment({ itemId, commentId, content });
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
        const updatedComments = prev[editingComment.itemId].map((comment) =>
          comment.id === editingComment.commentId ? res.data : comment
        );
        return { ...prev, [editingComment.itemId]: updatedComments };
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
        <button onClick={() => scrollRef.current.scrollBy({ left: -200, behavior: "smooth" })} className="p-2 bg-gray-800/70 text-white rounded-full">
          <ChevronLeft size={24} />
        </button>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto px-2 scrollbar-hide scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-lg shadow-md transition-all whitespace-nowrap ${
                category === cat ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-card)] hover:bg-opacity-80"
              }`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <button onClick={() => scrollRef.current.scrollBy({ left: 200, behavior: "smooth" })} className="p-2 bg-gray-800/70 text-white rounded-full">
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="space-y-6">
        {feedItems
          .filter((item) => category === "ALL" || item.category.toUpperCase() === category)
          .map((item) => (
            <div key={item.id} className="bg-[var(--color-card)] p-6 rounded-xl shadow-lg border border-gray-700/30">
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

              <div className="flex items-center gap-3 mt-4 cursor-pointer" onClick={() => toggleComments(item.id, item.type)}>
                <MessageSquare size={20} className="text-[var(--color-primary)]" />
                <span className="text-sm">{commentCounts[item.id] || 0} Comments</span>
              </div>

              {expandedComments[item.id] && (
                <div className="mt-4 p-4 rounded-2xl bg-[var(--color-background-secondary)] shadow-xl transition-all duration-300">
                  {comments[item.id]?.length > 0 ? (
                    comments[item.id].map((comment) => (
                      <div key={comment.id} className="p-2 mb-2 bg-[var(--color-background)] rounded-lg">
                        <p>{comment.content}</p>
                        <span className="text-xs text-[var(--color-text-secondary)]">- {comment.user.userName}</span>
                        <button
                          onClick={() => handleEditComment(item.id, comment.id, comment.content)}
                          className="text-blue-500 text-xs ml-2"
                        >
                          Edit
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No comments yet.</p>
                  )}

                  {editingComment && editingComment.itemId === item.id && (
                    <div className="mt-4 flex items-center gap-2">
                      <input
                        type="text"
                        value={editingComment.content}
                        onChange={(e) => setEditingComment((prev) => ({ ...prev, content: e.target.value }))}
                        className="flex-1 p-2 rounded-full bg-[var(--color-background)]"
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
                      value={newComment[item.id] || ""}
                      onChange={(e) => setNewComment((prev) => ({ ...prev, [item.id]: e.target.value }))}
                      placeholder="Add a comment..."
                      className="flex-1 p-2 rounded-full bg-[var(--color-background)]"
                    />
                    <button
                      onClick={() => handleAddComment(item.id, item.type)}
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
    </div>
  );
};

export default Feed;
