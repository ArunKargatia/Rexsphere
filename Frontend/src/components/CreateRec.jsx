import React, { useState } from 'react';
import backendUrl from '../BackendUrlConfig';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const CreateRec = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [askId, setAskId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const response = await backendUrl.post('/rec', { title, content }, {
                params: askId ? { askId } : {}
            });
            console.log(response.data);
            navigate('/');
        } catch (error) {
            console.error('Error creating recommendation:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Create Recommendation</h1>
                <Link to="/" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
                    Cancel
                </Link>
            </div>
            
            <div className="bg-[var(--color-card)] rounded-lg shadow-md p-6 border border-gray-700/30 backdrop-blur-sm">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-[var(--color-text-secondary)] font-medium mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            className="w-full border border-gray-700/50 rounded-lg p-3 bg-[var(--color-background)]/70 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/70 focus:border-transparent"
                            placeholder="What are you recommending?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="content" className="block text-[var(--color-text-secondary)] font-medium mb-2">
                            Details
                        </label>
                        <textarea
                            id="content"
                            className="w-full border border-gray-700/50 rounded-lg p-3 bg-[var(--color-background)]/70 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/70 focus:border-transparent"
                            rows="6"
                            placeholder="Share your detailed recommendation..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="askId" className="block text-[var(--color-text-secondary)] font-medium mb-2">
                            Ask ID (Optional)
                        </label>
                        <input
                            type="text"
                            id="askId"
                            className="w-full border border-gray-700/50 rounded-lg p-3 bg-[var(--color-background)]/70 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/70 focus:border-transparent"
                            placeholder="Enter Ask ID if applicable"
                            value={askId}
                            onChange={(e) => setAskId(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-[var(--color-primary)] to-[color-mix(in_srgb,var(--color-primary),purple_20%)] text-white px-6 py-2 rounded-lg hover:shadow-lg hover:opacity-95 transition-all duration-200 disabled:opacity-70"
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
        </div>
    );
};

export default CreateRec;