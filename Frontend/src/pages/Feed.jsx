import React, { useEffect, useState, useRef } from "react";
import backendUrl from "../BackendUrlConfig";
import { useAuth } from "../AuthContext";
import { ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [votes, setVotes] = useState({});
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const fetchFeed = async () => {
      try {
        const response = await backendUrl.get("/feed", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedItems(response.data);
      } catch (error) {
        console.error("Error fetching feed:", error);
      }
    };

    fetchFeed();
  }, [token]);

  useEffect(() => {
    const fetchAllVotes = async () => {
      if (!token || feedItems.length === 0) return;
  
      const updatedVotes = {};
      for (const item of feedItems) {
        try {
          const res = await backendUrl.get(`/rec/${item.id}/votes`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          updatedVotes[item.id] = {
            upVotes: res.data.upVotes,
            downVotes: res.data.downVotes,
          };
        } catch (error) {
          if (error.response?.status === 401) {
            console.warn("Unauthorized! Skipping vote fetch.");
          } else {
            console.error(`Error fetching votes for Rec ${item.id}:`, error);
          }
        }
      }
      setVotes(updatedVotes);
    };
  
    if (feedItems.length > 0) {
      fetchAllVotes();
    }
  }, [feedItems, token]);

  const handleVote = async (recId, isUpvote) => {
    try {
      await backendUrl.post(
        `/rec/${recId}/vote?isUpvote=${isUpvote}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setVotes((prevVotes) => {
        const currentVote = prevVotes[recId] || { upVotes: 0, downVotes: 0 };
        const upVoted = isUpvote ? (currentVote.upVotes === 1 ? 0 : 1) : 0;
        const downVoted = !isUpvote ? (currentVote.downVotes === 1 ? 0 : 1) : 0;

        return {
          ...prevVotes,
          [recId]: { upVotes: upVoted, downVotes: downVoted },
        };
      });
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[var(--color-background)] min-h-screen text-[var(--color-text-primary)]">
      <h1 className="text-3xl font-bold text-center mb-6">Feed</h1>

      {/* Category Scroll Buttons (Outside the category bar) */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={scrollLeft} className="p-2 bg-gray-800/70 text-white rounded-full">
          <ChevronLeft size={24} />
        </button>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto px-2 scrollbar-hide scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-lg shadow-md transition-all whitespace-nowrap ${
                category === cat
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-card)] hover:bg-opacity-80"
              }`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <button onClick={scrollRight} className="p-2 bg-gray-800/70 text-white rounded-full">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Feed Items */}
      <div className="space-y-6">
        {feedItems
          .filter((item) => category === "ALL" || item.category.toUpperCase() === category)
          .map((item) => (
            <div key={item.id} className="bg-[var(--color-card)] p-6 rounded-xl shadow-lg border border-gray-700/30">
              <div className="mb-2">
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-[var(--color-primary)] text-white">
                  {item.category}
                </span>
              </div>
              <h2 className="text-lg font-semibold mb-2">{item.content}</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">By: {item.user.userName}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Type: {item.type}</p>

              {/* Voting System */}
              {item.type === "REC" && (
                <div className="flex gap-4 mt-4 items-center">
                  {/* Upvote Button */}
                  <button
                    className={`transition-all duration-200 flex flex-col items-center gap-1 p-2 rounded-lg ${
                      votes[item.id]?.upVotes === 1
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                    onClick={() => handleVote(item.id, true)}
                  >
                    <ArrowUp size={20} />
                    <span className="text-sm">{votes[item.id]?.upVotes || 0}</span>
                  </button>

                  {/* Downvote Button */}
                  <button
                    className={`transition-all duration-200 flex flex-col items-center gap-1 p-2 rounded-lg ${
                      votes[item.id]?.downVotes === 1
                        ? "bg-red-500 text-white"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                    onClick={() => handleVote(item.id, false)}
                  >
                    <ArrowDown size={20} />
                    <span className="text-sm">{votes[item.id]?.downVotes || 0}</span>
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Feed;
