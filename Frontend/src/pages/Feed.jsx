import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import backendUrl from "../BackendUrlConfig";
import { useAuth } from "../AuthContext";
import { 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  Plus, 
  Edit2, 
  Trash2, 
  ArrowBigUp, 
  ArrowBigDown 
} from "lucide-react";

const categories = [
  "ALL", "TECHNOLOGY", "SPORTS", "MUSIC", "EDUCATION", "HEALTH",
  "TRAVEL", "GAMING", "FOOD", "BUSINESS", "MOVIES",
  "FITNESS", "ART", "SCIENCE", "BOOKS", "AUTOMOBILE",
  "ENTERTAINMENT", "PROGRAMMING", "LIFESTYLE", "OTHER"
];

const Feed = () => {
  const { token, getUserIdFromToken } = useAuth();
  const loggedInUserId = getUserIdFromToken();
  const navigate = useNavigate();
  const [feedItems, setFeedItems] = useState([]);
  const [category, setCategory] = useState("ALL");
  const [commentData, setCommentData] = useState({});
  const [voteData, setVoteData] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Fetch feed items when component mounts or category changes
  useEffect(() => {
    if (!token) return;
    fetchFeed();
  }, [token, category]);

  // Fetch feed items
  const fetchFeed = async () => {
    setIsLoading(true);
    try {
      const response = await backendUrl.get("/feed", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = response.data;
      setFeedItems(items);

      // Fetch comment and vote counts for each item
      items.forEach(item => {
        fetchCommentCount(item);
        fetchVoteCounts(item);
      });
    } catch (error) {
      console.error("Error fetching feed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch vote counts for an item
  const fetchVoteCounts = async (item) => {
    const compositeKey = `${item.type}-${item.referenceId}`;
    const apiPath = item.type.toLowerCase() === 'rec' 
      ? `/votes/rec/${item.referenceId}` 
      : `/votes/ask/${item.referenceId}`;

    try {
      const upvotesResponse = await backendUrl.get(`${apiPath}/upvotes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const downvotesResponse = await backendUrl.get(`${apiPath}/downvotes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setVoteData(prevData => ({
        ...prevData,
        [compositeKey]: {
          upvotes: upvotesResponse.data,
          downvotes: downvotesResponse.data
        }
      }));
    } catch (error) {
      console.error(`Error fetching vote counts for ${compositeKey}:`, error);
    }
  };

  // Handle voting for an item
  const handleVote = async (referenceId, type, isUpvote) => {
    const compositeKey = `${type}-${referenceId}`;
    const apiPath = type.toLowerCase() === 'rec' 
      ? `/votes/rec/${referenceId}` 
      : `/votes/ask/${referenceId}`;

    try {
      // Check current vote state
      const currentVote = userVotes[compositeKey];
      
      // Determine the vote action
      let voteAction;
      if (currentVote === isUpvote) {
        // Unvote if clicking the same vote again
        voteAction = 'unvote';
      } else {
        // Vote or change vote
        voteAction = 'vote';
      }

      // Send vote request
      await backendUrl.post(apiPath, null, {
        params: { 
          isUpvote, 
          action: voteAction 
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update local vote state
      setUserVotes(prevVotes => ({
        ...prevVotes,
        [compositeKey]: voteAction === 'vote' ? isUpvote : null
      }));

      // Refresh vote counts after voting
      const item = { type, referenceId };
      fetchVoteCounts(item);
    } catch (error) {
      console.error(`Error voting on ${type}:`, error);
    }
  };

  // Fetch comment count for a single item
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

      // Update state with 0 count on error
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

    // Toggle the expanded state
    setCommentData(prevData => ({
      ...prevData,
      [compositeKey]: {
        ...prevData[compositeKey],
        expanded: !prevData[compositeKey]?.expanded
      }
    }));

    // Check if we need to fetch comments
    const currentData = commentData[compositeKey];
    const needToFetchComments = !currentData?.expanded &&
      (!currentData?.comments || currentData.comments.length === 0);

    if (needToFetchComments) {
      fetchComments(referenceId, type);
    }
  };

  // Fetch comments for an item
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

      // Post comment
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
      // Update comment
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

  // Delete a comment
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

  return (
    <div className="
      w-full 
      max-w-full 
      lg:max-w-4xl 
      xl:max-w-5xl 
      mx-auto 
      px-4 
      md:px-6 
      lg:px-8 
      py-8 
      bg-[var(--color-background)] 
      min-h-screen 
      text-[var(--color-text-primary)] 
      pt-20
    ">
      <h1 className="
        text-3xl 
        md:text-4xl 
        font-extrabold 
        text-center 
        mb-10 
        tracking-tight
      ">Feed</h1>

      {/* Category navigation */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 flex items-center pl-2 z-10">
          <button
            onClick={() => scrollRef.current.scrollBy({ left: -200, behavior: "smooth" })}
            className="p-2 bg-gray-800/50 hover:bg-gray-800/70 text-white rounded-full transition-all"
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide px-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              className={`
                px-4 py-2 rounded-full shadow-md transition-all whitespace-nowrap 
                text-sm font-medium 
                ${category === cat
                  ? "bg-[var(--color-primary)] text-white scale-105"
                  : "bg-[var(--color-card)] text-[var(--color-text-secondary)] hover:bg-opacity-90"}
              `}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="absolute inset-y-0 right-0 flex items-center pr-2 z-10">
          <button
            onClick={() => scrollRef.current.scrollBy({ left: 200, behavior: "smooth" })}
            className="p-2 bg-gray-800/50 hover:bg-gray-800/70 text-white rounded-full transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-3 border-b-3 border-[var(--color-primary)]"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {feedItems
            .filter((item) => category === "ALL" || item.category.toUpperCase() === category)
            .map((item) => {
              const compositeKey = `${item.type}-${item.referenceId}`;
              const itemCommentData = commentData[compositeKey] || { count: 0, comments: [], expanded: false };
              const itemVoteData = voteData[compositeKey] || { upvotes: 0, downvotes: 0 };
              const currentUserVote = userVotes[compositeKey];

              return (
                <div
                  key={item.id}
                  className="
                    bg-[var(--color-card)] 
                    p-6 
                    rounded-2xl 
                    shadow-lg 
                    border 
                    border-gray-700/30 
                    transition-all 
                    hover:shadow-xl 
                    hover:-translate-y-1
                    flex 
                    flex-row 
                    gap-4 
                    items-start
                  "
                >
                  {/* Voting Section */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleVote(item.referenceId, item.type, true)}
                      className={`
                        group 
                        p-2 
                        rounded-full 
                        transition-all 
                        ${currentUserVote === true 
                          ? 'bg-green-100 text-green-600' 
                          : 'hover:bg-green-50 text-gray-500 hover:text-green-600'}
                      `}
                    >
                      <ArrowBigUp 
                        size={24} 
                        className={`
                          transition-transform 
                          group-hover:scale-110 
                          ${currentUserVote === true ? 'fill-current' : ''}
                        `}
                      />
                    </button>
                    <span 
                      className={`
                        text-lg 
                        font-bold 
                        my-1 
                        ${itemVoteData.upvotes - itemVoteData.downvotes > 0 
                          ? 'text-green-600' 
                          : itemVoteData.upvotes - itemVoteData.downvotes < 0 
                          ? 'text-red-600' 
                          : 'text-gray-500'}
                      `}
                    >
                      {itemVoteData.upvotes - itemVoteData.downvotes}
                    </span>
                    <button
                      onClick={() => handleVote(item.referenceId, item.type, false)}
                      className={`
                        group 
                        p-2 
                        rounded-full 
                        transition-all 
                        ${currentUserVote === false 
                          ? 'bg-red-100 text-red-600' 
                          : 'hover:bg-red-50 text-gray-500 hover:text-red-600'}
                      `}
                    >
                      <ArrowBigDown 
                        size={24} 
                        className={`
                          transition-transform 
                          group-hover:scale-110 
                          ${currentUserVote === false ? 'fill-current' : ''}
                        `}
                      />
                    </button>
                  </div>

                  {/* Feed Item Content */}
                  <div className="flex-1">
                    {/* Feed item header */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-[var(--color-text-secondary)] font-semibold bg-gray-200/20 px-3 py-1 rounded-full">
                        {item.category}
                      </span>
                      <span className="text-sm text-[var(--color-text-secondary)] font-medium opacity-70">
                        {item.type}
                      </span>
                    </div>

                    {/* Feed item content */}
                    <h2 className="text-xl font-bold mb-3 text-[var(--color-text-primary)]">{item.content}</h2>
                    <div className="flex items-center justify-between text-sm text-[var(--color-text-secondary)] mb-4">
                      <p>
                        By: <span className="hover:underline cursor-pointer font-semibold">@{item.user.userName}</span>
                      </p>
                      <p className="text-xs opacity-70">{formatDate(item.createdAt)}</p>
                    </div>

                    {/* Voting and Comments section */}
                    <div className="flex items-center justify-between mt-4">
                      {/* Comment toggle */}
                      <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => toggleComments(item.referenceId, item.type)}
                      >
                        <MessageSquare
                          size={20}
                          className="text-[var(--color-primary)] group-hover:scale-110 transition-transform"
                        />
                        <span className="text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors">
                          {itemCommentData.count || 0} Comments
                        </span>
                      </div>
                    </div>

                    {/* Comments section */}
                    {itemCommentData.expanded && (
                      <div className="mt-6 p-4 rounded-2xl bg-[var(--color-background-secondary)] shadow-inner">
                        {/* Comment list */}
                        {itemCommentData.comments?.length > 0 ? (
                          <div className="space-y-3">
                            {itemCommentData.comments.map((comment) => (
                              <div
                                key={comment.id}
                                className="p-3 bg-[var(--color-background)] rounded-xl flex items-start gap-3"
                              >
                                {itemCommentData.editingComment?.id === comment.id ? (
                                  <div className="flex-1 flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={itemCommentData.editingComment.content}
                                      onChange={(e) => updateEditingComment(compositeKey, e.target.value)}
                                      className="flex-1 p-2 rounded-full bg-[var(--color-background)] border"
                                    />
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() =>
                                          handleUpdateComment(
                                            item.referenceId,
                                            item.type,
                                            comment.id,
                                            itemCommentData.editingComment.content
                                          )
                                        }
                                        className="p-2 bg-[var(--color-primary)] text-white rounded-full hover:opacity-90"
                                      >
                                        Update
                                      </button>
                                      <button
                                        onClick={() => setEditingComment(compositeKey, null, "")}
                                        className="p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex-1">
                                    <p className="text-sm mb-1">{comment.content}</p>
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs text-[var(--color-text-secondary)] opacity-70">
                                        - {comment.user.userName}
                                      </span>
                                      {comment.user.id === getUserIdFromToken() && (
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => setEditingComment(compositeKey, comment.id, comment.content)}
                                            className="text-blue-500 hover:bg-blue-50 p-1 rounded-full"
                                          >
                                            <Edit2 size={16} />
                                          </button>
                                          <button
                                            onClick={() => handleDelete(comment.id, item.referenceId, item.type)}
                                            className="text-red-500 hover:bg-red-50 p-1 rounded-full"
                                          >
                                            <Trash2 size={16} />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-[var(--color-text-secondary)] py-4">No comments yet.</p>
                        )}

                        {/* New comment form */}
                        <div className="mt-4 flex items-center gap-3">
                          <input
                            type="text"
                            value={itemCommentData.newComment || ""}
                            onChange={(e) => handleCommentInputChange(compositeKey, e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 p-3 rounded-full bg-[var(--color-background)] border transition-all 
                                       focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                          />
                          <button
                            onClick={() => handleAddComment(item.referenceId, item.type, itemCommentData.newComment)}
                            className="px-5 py-3 bg-[var(--color-primary)] text-white rounded-full 
                                       hover:opacity-90 transition-all"
                          >
                            Comment
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Floating Add Post Button */}
      <button
        onClick={() => navigate("/post")}
        className="
          fixed 
          bottom-8 
          right-8 
          bg-[var(--color-primary)] 
          text-white 
          p-5 
          rounded-full 
          shadow-2xl 
          hover:scale-110 
          transition-all 
          group
          z-50
        "
      >
        <Plus
          size={28}
          className="group-hover:rotate-90 transition-transform duration-300"
        />
      </button>
    </div>
  );
};

export default Feed;