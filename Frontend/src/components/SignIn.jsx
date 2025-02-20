import React, { useState } from 'react';
import backendUrl from '../BackendUrlConfig';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const SignIn = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage("");

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
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-[var(--color-background)]">
            <div className="bg-[var(--color-card)] p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-4 text-[var(--color-text-primary)]">Sign In</h2>
                {error && <p className="text-[var(--color-downvote)] text-center mb-4">{error}</p>}
                {successMessage && <p className="text-[var(--color-upvote)] text-center mb-4">{successMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-[var(--color-text-secondary)]">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-700 rounded-md bg-[var(--color-background)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-secondary)]">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-700 rounded-md bg-[var(--color-background)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[var(--color-primary)] text-white font-bold rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    >
                        Sign In
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-[var(--color-primary)] hover:underline">
                            Sign Up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
