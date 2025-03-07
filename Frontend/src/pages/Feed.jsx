import React, { useEffect, useState } from "react";
import backendUrl from "../BackendUrlConfig";
import { useAuth } from "../AuthContext";

const Feed = () => {
  const { token } = useAuth();
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preferredCategories, setPreferredCategories] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchPreferences = async () => {
      try {
        const res = await backendUrl.get("/user/preferences", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPreferredCategories(res.data);
      } catch (err) {
        setError("Failed to load preferences");
      }
    };

    fetchPreferences();
  }, [token]);

  useEffect(() => {
    if (!token || preferredCategories.length === 0) return;

    const fetchFeeds = async () => {
      try {
        setLoading(true);
        const feedPromises = preferredCategories.map((category) =>
          backendUrl.get(`/feed/category/${category}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );

        const responses = await Promise.all(feedPromises);
        const allFeeds = responses.flatMap((res) => res.data);
        setFeeds(allFeeds);
      } catch (err) {
        setError("Failed to load feeds");
      } finally {
        setLoading(false);
      }
    };

    fetchFeeds();
  }, [preferredCategories, token]);

  if (!token) {
    return <p className="text-center text-red-500">You need to log in to view the feed.</p>;
  }

  if (loading) return <p className="text-center">Loading feeds...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] flex justify-center p-6">
      <div className="max-w-2xl w-full bg-[var(--color-card)] p-6 rounded-2xl shadow-lg border border-gray-700/30 backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-4">Your Feed</h2>
        {feeds.length === 0 ? (
          <p className="text-center text-gray-500">No feeds available for your preferred categories.</p>
        ) : (
          <ul className="space-y-4">
            {feeds.map((feed) => (
              <li key={feed.id} className="p-4 border border-gray-600 rounded-lg bg-[var(--color-background)]/40">
                <p className="text-[var(--color-text-primary)]">{feed.content}</p>
                <p className="text-sm text-gray-400 mt-2">
                  Category: {feed.category} | Type: {feed.type} | User ID: {feed.user.id}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Feed;
