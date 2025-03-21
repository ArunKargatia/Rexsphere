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
  const { token, getUserIdFromToken } = useAuth();
  const loggedInUserId = getUserIdFromToken();
  const [feedItems, setFeedItems] = useState([]);
  const [category, setCategory] = useState("ALL");
  const [commentData, setCommentData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Fetch feed items when component mounts or category changes
  useEffect(() => {
    if (!token) return;
    fetchFeed();
  }, [token, category]);

  // Simple function to fetch feed items
  const fetchFeed = async () => {
    setIsLoading(true);
    try {
      // Simple axios GET request
      const response = await backendUrl.get("/feed", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = response.data;
      setFeedItems(items);

      // After getting feed items, fetch comment counts for each item
      items.forEach(item => {
        fetchCommentCount(item);
      });
    } catch (error) {
      console.error("Error fetching feed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple function to fetch comment count for a single item
  const fetchCommentCount = async (item) => {
    const compositeKey = `${item.type}-${item.referenceId}`;
    const url = `/comment/${item.type.toLowerCase()}/${item.referenceId}/count`;

    try {
      const response = await backendUrl.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const count = response.data.count;

      // Update comment data for this item
      setCommentData(prevData => ({
        ...prevData,
        [compositeKey]: {
          ...prevData[compositeKey],
          count: count,
          comments: prevData[compositeKey]?.comments || [],
          expanded: prevData[compositeKey]?.expanded || false
        }
      }));
    } catch (error) {
      console.error(`Error fetching comment count for ${compositeKey}:`, error);

      // Still update the state with 0 count on error
      setCommentData(prevData => ({
        ...prevData,
        [compositeKey]: {
          ...prevData[compositeKey],
          count: 0,
          comments: prevData[compositeKey]?.comments || [],
          expanded: prevData[compositeKey]?.expanded || false
        }
      }));
    }
  };

  // Toggle comments section and fetch comments if needed
  const toggleComments = async (referenceId, type) => {
    const compositeKey = `${type}-${referenceId}`;

    // First, toggle the expanded state
    setCommentData(prevData => ({
      ...prevData,
      [compositeKey]: {
        ...prevData[compositeKey],
        expanded: !prevData[compositeKey]?.expanded
      }
    }));

    // Then check if we need to fetch comments
    const currentData = commentData[compositeKey];
    const needToFetchComments = !currentData?.expanded &&
      (!currentData?.comments || currentData.comments.length === 0);

    if (needToFetchComments) {
      fetchComments(referenceId, type);
    }
  };

  // Updated function to fetch comments for an item, ensuring proper filtering
  const fetchComments = async (referenceId, type) => {

    if (!type) {
      console.error("Error: 'type' is undefined in fetchComments");
      return;
    }

    const compositeKey = `${type}-${referenceId}`;
    const lowerType = type.toLowerCase();

    try {
      const url = `/comment/${lowerType}/${referenceId}`;
      const response = await backendUrl.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter comments to ensure they match the correct type and referenceId
      const filteredComments = response.data.filter(comment => {
        return lowerType === "ask"
          ? comment.askId == referenceId
          : comment.recId == referenceId;
      });

      // Update comments in state
      setCommentData(prevData => ({
        ...prevData,
        [compositeKey]: {
          ...prevData[compositeKey],
          comments: filteredComments
        }
      }));
    } catch (error) {
      console.error(`Error fetching comments for ${compositeKey}:`, error);
    }
  };

  // Add a new comment
  const handleAddComment = async (referenceId, type, newCommentText) => {
    if (!newCommentText?.trim()) return;

    const compositeKey = `${type}-${referenceId}`;
    const lowerType = type.toLowerCase();

    try {
      // Prepare the payload based on type
      let payload;
      if (lowerType === "ask") {
        payload = {
          content: newCommentText,
          askId: referenceId
        };
      } else {
        payload = {
          content: newCommentText,
          recId: referenceId
        };
      }

      // Simple POST request to add a comment
      const response = await backendUrl.post(
        "/comment",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Ensure the returned comment has the correct ID for the current post type
      const newComment = response.data;
      const isCorrectType = (lowerType === "ask" && newComment.askId === referenceId) ||
        (lowerType === "rec" && newComment.recId === referenceId);

      if (isCorrectType) {
        // Update state with the new comment
        setCommentData(prevData => {
          const currentComments = prevData[compositeKey]?.comments || [];
          const currentCount = prevData[compositeKey]?.count || 0;

          return {
            ...prevData,
            [compositeKey]: {
              ...prevData[compositeKey],
              comments: [...currentComments, newComment],
              count: currentCount + 1,
              newComment: ""
            }
          };
        });
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Update an existing comment
  const handleUpdateComment = async (referenceId, type, commentId, content) => {
    if (!content.trim()) return;

    const compositeKey = `${type}-${referenceId}`;
    const lowerType = type.toLowerCase();

    try {
      // Simple PUT request to update a comment
      const response = await backendUrl.put(
        `/comment/${commentId}`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedComment = response.data;
      const isCorrectType = (lowerType === "ask" && updatedComment.askId === referenceId) ||
        (lowerType === "rec" && updatedComment.recId === referenceId);

      if (isCorrectType) {
        // Update the comment in state
        setCommentData(prevData => {
          // Find and update the specific comment
          const updatedComments = prevData[compositeKey].comments.map(comment =>
            comment.id === commentId ? updatedComment : comment
          );

          return {
            ...prevData,
            [compositeKey]: {
              ...prevData[compositeKey],
              comments: updatedComments,
              editingComment: null
            }
          };
        });
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  // Helper function to format dates
  const formatDate = (date) => {
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  // Update the comment input as user types
  const handleCommentInputChange = (compositeKey, value) => {
    setCommentData(prevData => ({
      ...prevData,
      [compositeKey]: {
        ...prevData[compositeKey],
        newComment: value
      }
    }));
  };

  // Set a comment to editing mode
  const setEditingComment = (compositeKey, commentId, content) => {
    setCommentData(prevData => ({
      ...prevData,
      [compositeKey]: {
        ...prevData[compositeKey],
        editingComment: commentId ? { id: commentId, content } : null
      }
    }));
  };

  // Update a comment being edited
  const updateEditingComment = (compositeKey, content) => {
    setCommentData(prevData => ({
      ...prevData,
      [compositeKey]: {
        ...prevData[compositeKey],
        editingComment: {
          ...prevData[compositeKey].editingComment,
          content
        }
      }
    }));
  };

  const handleDelete = async (commentId, referenceId, type) => {
  if (!type) {
    console.error("Error: 'type' is undefined in handleDelete");
    return; 
  }

  try {
    await backendUrl.delete(`/comment/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    fetchComments(referenceId, type); 
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
};


  return (
    <div className="max-w-4xl mx-auto p-6 bg-[var(--color-background)] min-h-screen text-[var(--color-text-primary)]">
      <h1 className="text-3xl font-bold text-center mb-6">Feed</h1>

      {/* Category navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => scrollRef.current.scrollBy({ left: -200, behavior: "smooth" })}
          className="p-2 bg-gray-800/70 text-white rounded-full"
        >
          <ChevronLeft size={24} />
        </button>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto px-2 scrollbar-hide scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-lg shadow-md transition-all whitespace-nowrap ${category === cat ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-card)] hover:bg-opacity-80"
                }`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollRef.current.scrollBy({ left: 200, behavior: "smooth" })}
          className="p-2 bg-gray-800/70 text-white rounded-full"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Loading indicator */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Feed items list */}
          {feedItems
            .filter((item) => category === "ALL" || item.category.toUpperCase() === category)
            .map((item) => {
              const compositeKey = `${item.type}-${item.referenceId}`;
              const itemCommentData = commentData[compositeKey] || { count: 0, comments: [], expanded: false };

              return (
                <div key={item.id} className="bg-[var(--color-card)] p-6 rounded-xl shadow-lg border border-gray-700/30">
                  {/* Feed item header */}
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-[var(--color-text-secondary)] font-semibold">{item.category}</p>
                    <p className="text-sm text-[var(--color-text-secondary)] font-semibold">{item.type}</p>
                  </div>

                  {/* Feed item content */}
                  <h2 className="text-lg font-semibold mb-2">{item.content}</h2>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    By: <span className="hover:underline cursor-pointer">@{item.user.userName}</span>
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Posted on: {formatDate(item.createdAt)}
                  </p>

                  {/* Comments toggle button */}
                  <div
                    className="flex items-center gap-3 mt-4 cursor-pointer"
                    onClick={() => toggleComments(item.referenceId, item.type)}
                  >
                    <MessageSquare size={20} className="text-[var(--color-primary)]" />
                    <span className="text-sm">{itemCommentData.count || 0} Comments</span>
                  </div>

                  {/* Comments section (conditionally rendered) */}
                  {itemCommentData.expanded && (
                    <div className="mt-4 p-4 rounded-2xl bg-[var(--color-background-secondary)] shadow-xl">
                      {/* Comment list */}
                      {itemCommentData.comments?.length > 0 ? (
                        itemCommentData.comments.map((comment) => (
                          <div key={comment.id} className="p-2 mb-2 bg-[var(--color-background)] rounded-lg">
                            {itemCommentData.editingComment?.id === comment.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={itemCommentData.editingComment.content}
                                  onChange={(e) => updateEditingComment(compositeKey, e.target.value)}
                                  className="flex-1 p-2 rounded-full bg-[var(--color-background)]"
                                />
                                <button
                                  onClick={() =>
                                    handleUpdateComment(
                                      item.referenceId,
                                      item.type,
                                      comment.id,
                                      itemCommentData.editingComment.content
                                    )
                                  }
                                  className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-full"
                                >
                                  Update
                                </button>
                                <button
                                  onClick={() => setEditingComment(compositeKey, null, "")} // Reset editing mode
                                  className="px-4 py-2 bg-gray-500 text-white rounded-full"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <>
                                <p>{comment.content}</p>
                                <span className="text-xs text-[var(--color-text-secondary)]">- {comment.user.userName}</span>

                                {comment.user.id === getUserIdFromToken() && (
                                  <div className="flex gap-2 mt-1">
                                    <button
                                      onClick={() => setEditingComment(compositeKey, comment.id, comment.content)}
                                      className="text-blue-500 text-xs"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDelete(comment.id, item.referenceId, item.type)}
                                      className="text-red-500 text-xs"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ))
                      ) : (
                        <p>No comments yet.</p>
                      )}

                      {/* New comment form */}
                      <div className="mt-4 flex items-center gap-2">
                        <input
                          type="text"
                          value={itemCommentData.newComment || ""}
                          onChange={(e) => handleCommentInputChange(compositeKey, e.target.value)}
                          placeholder="Add a comment..."
                          className="flex-1 p-2 rounded-full bg-[var(--color-background)]"
                        />
                        <button
                          onClick={() => handleAddComment(item.referenceId, item.type, itemCommentData.newComment)}
                          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-full"
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Feed;