import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backendUrl from "../BackendUrlConfig";
import { useAuth } from "../AuthContext";
import { PlusCircle, HelpCircle, Send, AlertCircle, Tag, ArrowLeft } from "lucide-react";

const PostPage = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("rec");
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const categories = [
        "TECHNOLOGY", "SPORTS", "MUSIC", "EDUCATION", "HEALTH",
        "TRAVEL", "GAMING", "FOOD", "BUSINESS", "MOVIES",
        "FITNESS", "ART", "SCIENCE", "BOOKS", "AUTOMOBILE",
        "ENTERTAINMENT", "PROGRAMMING", "LIFESTYLE", "OTHER"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            setError("You must be logged in to post.");
            return;
        }

        if (!category) {
            setError("Please select a category.");
            return;
        }

        setIsSubmitting(true);
        const endpoint = type === "rec" ? "/rec" : "/ask";
        const payload = type === "rec" ? { category, content } : { category, question: content };

        try {
            const response = await backendUrl.post(endpoint, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Post created:", response.data);
            setContent("");
            setCategory("");
            setError(null);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
        } catch (err) {
            console.error("Error posting:", err);
            setError("Failed to create post. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] pt-20">
            <div className="flex justify-center items-center min-h-fit p-4 md:p-6">
                <div className="max-w-2xl w-full p-6 bg-[var(--color-card)] rounded-xl shadow-lg text-[var(--color-text-primary)] border border-gray-800">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/feed")}
                        className="flex items-center text-[var(--color-secondary)] hover:text-[var(--color-primary)] mb-6 transition-all"
                    >
                        <ArrowLeft size={18} className="mr-1" />
                        <span>Back to Feed</span>
                    </button>

                    <div className="mb-6 text-center">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[var(--color-primary)]">Create a New Post</h1>
                        <p className="text-[var(--color-text-secondary)] text-sm">Share recommendations or ask questions</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-900/20 border border-red-800/50 rounded-lg flex items-center gap-2 text-red-400">
                            <AlertCircle size={16} />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {showSuccess && (
                        <div className="mb-6 p-3 bg-green-900/20 border border-green-800/50 rounded-lg flex items-center gap-2 text-green-400 transition-opacity duration-300">
                            <AlertCircle size={16} className="text-green-400" />
                            <p className="text-sm">Post successfully created!</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* Post Type Selection */}
                        <div className="flex justify-center gap-4 mb-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="postType"
                                    value="rec"
                                    checked={type === "rec"}
                                    onChange={() => setType("rec")}
                                    className="hidden"
                                />
                                <span
                                    className={`px-5 py-3 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${type === "rec"
                                        ? "bg-[var(--color-primary)] text-white shadow-lg"
                                        : "bg-[var(--color-card)] text-[var(--color-text-secondary)] border border-gray-700"
                                        }`}
                                    style={type === "rec" ? { boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.2)" } : {}}
                                >
                                    <PlusCircle size={18} />
                                    Recommendation
                                </span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="postType"
                                    value="ask"
                                    checked={type === "ask"}
                                    onChange={() => setType("ask")}
                                    className="hidden"
                                />
                                <span
                                    className={`px-5 py-3 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${type === "ask"
                                        ? "bg-[var(--color-primary)] text-white shadow-lg"
                                        : "bg-[var(--color-card)] text-[var(--color-text-secondary)] border border-gray-700"
                                        }`}
                                    style={type === "ask" ? { boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.2)" } : {}}
                                >
                                    <HelpCircle size={18} />
                                    Ask
                                </span>
                            </label>
                        </div>

                        {/* Category Selection */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-1">
                                <Tag size={16} className="text-[var(--color-text-secondary)]" />
                                <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                                    Select a category
                                </label>
                            </div>

                            {category && (
                                <div className="flex items-center mb-2">
                                    <span className="px-3 py-1 bg-[var(--color-primary)] text-white rounded-full text-sm font-medium flex items-center">
                                        {category}
                                        <button
                                            type="button"
                                            className="ml-2 focus:outline-none"
                                            onClick={() => setCategory("")}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2 border border-gray-700 rounded-lg bg-black/10 p-3">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setCategory(cat)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${category === cat
                                            ? "bg-[var(--color-primary)] text-white"
                                            : "bg-gray-800 text-[var(--color-text-secondary)] hover:bg-gray-700"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Textarea */}
                        <div className="relative mt-2">
                            <textarea
                                className="w-full p-4 border border-gray-700 rounded-lg bg-black/20 text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none transition-all h-40"
                                placeholder={type === "rec" ? "Share your recommendation..." : "Ask your question..."}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            ></textarea>
                            <div className="absolute right-4 bottom-4 text-xs text-[var(--color-text-secondary)]">
                                {content ? content.length : 0}/500
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-4 w-full bg-[var(--color-primary)] text-white py-3 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center gap-2 relative overflow-hidden group disabled:opacity-70"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {isSubmitting ? "Posting..." : "Post"}
                                <Send size={18} className="transform group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-indigo-600"></div>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostPage;