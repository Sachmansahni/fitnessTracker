import React, { useState } from "react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [otpPopup, setOtpPopup] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("Processing...");
        
        try {
            const response = await fetch("/api/send-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            
            const data = await response.json();
            setMessage(data.message || "OTP has been sent to your email.");
            setTimeout(() => setOtpPopup(true), 1000); // Show OTP popup after success
        } catch (error) {
            setMessage("Error sending OTP. Please try again later.");
        }
    };

    if (otpPopup) {
        return <OTPVerification email={email} />;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                <button
                    onClick={() => window.history.back()}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-3 py-1"
                >
                    ✕
                </button>
                <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
                <p className="text-gray-600 mb-6 text-center">Enter your email to receive an OTP for password reset.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                        className="w-full p-2 border rounded"
                    />
                    <button 
                        type="submit" 
                        className="w-full bg-teal-500 text-white p-2 rounded hover:bg-teal-600"
                    >
                        Send OTP
                    </button>
                </form>
                {message && <p className="mt-4 text-center text-gray-800">{message}</p>}
            </div>
        </div>
    );
};

const OTPVerification = ({ email }) => {
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleReset = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch("/api/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, otp, newPassword }),
            });
            
            const data = await response.json();
            setMessage(data.message || "Password successfully reset.");
        } catch (error) {
            setMessage("Error resetting password. Please try again later.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                <h2 className="text-2xl font-bold mb-4 text-center">Verify OTP</h2>
                <p className="text-gray-600 mb-6 text-center">Enter the OTP sent to your email along with your new password.</p>
                <form onSubmit={handleReset} className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Enter OTP" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        required
                        className="w-full p-2 border rounded"
                    />
                    <input 
                        type="password" 
                        placeholder="New Password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required
                        className="w-full p-2 border rounded"
                    />
                    <input 
                        type="password" 
                        placeholder="Confirm Password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required
                        className="w-full p-2 border rounded"
                    />
                    <button 
                        type="submit" 
                        className="w-full bg-teal-500 text-white p-2 rounded hover:bg-teal-600"
                    >
                        Reset Password
                    </button>
                </form>
                {message && <p className="mt-4 text-center text-gray-800">{message}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword;