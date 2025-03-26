import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import backendUrl from '../BackendUrlConfig';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const SignIn = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage("");
        setIsLoading(true);

        try {
            const response = await backendUrl.post('/public/login', {
                userName,
                password
            });
            const token = response.data;
            console.log(token);

            if (token) {
                login(token);
                setSuccessMessage("You have successfully signed in! Redirecting...");
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            }
        } catch (err) {
            setError("Invalid username or password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[var(--color-background)] to-[color-mix(in_srgb,var(--color-background),black_10%)]">
            <div className="bg-[var(--color-card)] p-8 rounded-xl shadow-lg w-96 border border-gray-700/30 backdrop-blur-sm">
                <div className="flex flex-col items-center mb-6">
                    <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Welcome Back</h2>
                    <p className="text-[var(--color-text-secondary)] text-sm">Sign in to your account</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-red-500 text-center text-sm">{error}</p>
                    </div>
                )}

                {successMessage && (
                    <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <p className="text-green-500 text-center text-sm">{successMessage}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                            Username
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-[var(--color-text-secondary)]" />
                            </div>
                            <input
                                type="text"
                                id="username"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full p-3 pl-10 border border-gray-700/50 rounded-lg bg-[var(--color-background)]/70 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/70 focus:border-transparent transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-secondary)]">
                                Password
                            </label>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-[var(--color-text-secondary)]" />
                            </div>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 pl-10 border border-gray-700/50 rounded-lg bg-[var(--color-background)]/70 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/70 focus:border-transparent transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-[var(--color-primary)] to-[color-mix(in_srgb,var(--color-primary),purple_20%)] text-white font-medium rounded-lg hover:shadow-lg hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:ring-offset-2 focus:ring-offset-[var(--color-card)] transition-all duration-200 disabled:opacity-70 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <span className="inline-flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing In...
                            </span>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-[var(--color-primary)] font-medium hover:underline">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;