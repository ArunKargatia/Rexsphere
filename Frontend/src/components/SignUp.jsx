import React, { useState } from 'react';
import backendUrl from '../BackendUrlConfig';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage("");

        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        const userData = {
            firstName,
            lastName,
            email,
            userName,
            password,
            mobileNumber,
            dateOfBirth,
            address
        };

        try {
            const response = await backendUrl.post('/public/register', userData);
            if (response.data) {
                setSuccessMessage('Registration successful! You can now sign in.');
                setTimeout(() => navigate('/signin'), 3000);
            }
        } catch (err) {
            setError('Failed to register. Please try again!');
            console.error(err);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-[var(--color-background)]">
            <div className="bg-[var(--color-card)] p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-4 text-[var(--color-text-primary)]">Register</h2>
                {error && <p className="text-[var(--color-downvote)] text-center mb-4">{error}</p>}
                {successMessage && <p className="text-[var(--color-upvote)] text-center mb-4">{successMessage}</p>}
                <form onSubmit={handleSubmit}>
                    {[{ label: "First Name", value: firstName, setter: setFirstName },
                      { label: "Last Name", value: lastName, setter: setLastName },
                      { label: "Email", value: email, setter: setEmail, type: "email" },
                      { label: "Username", value: userName, setter: setUserName },
                      { label: "Password", value: password, setter: setPassword, type: "password" },
                      { label: "Confirm Password", value: confirmPassword, setter: setConfirmPassword, type: "password" },
                      { label: "Mobile Number", value: mobileNumber, setter: setMobileNumber },
                      { label: "Date of Birth", value: dateOfBirth, setter: setDateOfBirth, type: "date" },
                      { label: "Address", value: address, setter: setAddress }]
                      .map(({ label, value, setter, type = "text" }) => (
                        <div key={label} className="mb-4">
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">{label}</label>
                            <input type={type} value={value} onChange={(e) => setter(e.target.value)} required
                                className="w-full p-2 mt-1 border border-gray-700 rounded-md bg-[var(--color-background)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                        </div>
                    ))}
                    <button type="submit" className="w-full py-2 px-4 bg-[var(--color-primary)] text-white font-bold rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
