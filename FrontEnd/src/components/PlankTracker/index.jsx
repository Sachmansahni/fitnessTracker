import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";

const WEBSOCKET_URL = "ws://localhost:8000/ws";

function PlankTracker() {
    const [feedback, setFeedback] = useState({
        plank: false,
        angle: 0,
        time_held: 0,
        plank_message: "",
    });
    const [isConnected, setIsConnected] = useState(false);
    const websocketRef = useRef(null);
    const webcamRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        const socket = new WebSocket(WEBSOCKET_URL);
        websocketRef.current = socket;

        socket.onopen = () => {
            setIsConnected(true);
            console.log("Connected to WebSocket");
        };

        socket.onclose = () => {
            setIsConnected(false);
            console.log("Disconnected from WebSocket");
        };

        socket.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };

        socket.onmessage = (event) => {
            const response = JSON.parse(event.data);
            console.log("Received response:", response);

            if (response) {
                setFeedback(response); // Dynamically update feedback
            }
        };

        return () => {
            socket.close();
        };
    }, []);

    const sendFrame = () => {
        if (websocketRef.current?.readyState === WebSocket.OPEN && webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                websocketRef.current.send(
                    JSON.stringify({
                        frame: imageSrc.split(",")[1], // Remove "data:image/jpeg;base64,"
                    })
                );
            }
        }
    };

    useEffect(() => {
        if (isConnected && !intervalRef.current) {
            intervalRef.current = setInterval(sendFrame, 100); // Send frames every 100ms
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = null;
        };
    }, [isConnected]);

    // Destructure the feedback state and provide default values for missing properties
    const { angle = 0, plank = false, time_held = 0, plank_message = "" } = feedback;

    // Convert angle to stroke offset (360 degrees = 2 * π radians)
    const circumference = 2 * Math.PI * 50; // 50 is the radius of the circle
    const strokeOffset = circumference - (angle / 360) * circumference;

    // Conditional ring color based on plank status
    const ringColor = plank ? "#28a745" : "#dc3545"; // Green if plank is correct, red if incorrect

    return (
        <div className="flex min-h-screen p-5 bg-black">
            {/* Left Side: Heading and Webcam */}
            <div className="flex flex-col items-start justify-start w-2/3 p-6 rounded-2xl shadow-2xl">
                <h2 className="text-[80px] font-bold text-[#FFD700] tracking-wide">
                    Plank Exercise Tracker
                </h2>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width="100%"
                    videoConstraints={{ facingMode: "user" }}
                    className="w-full h-[600px] rounded-xl border-4 border-[#FFD700] shadow-lg transition-all duration-300 hover:border-white"
                />
            </div>

            {/* Right Side: Feedback Results */}
            <div className="flex-1 p-6 rounded-2xl shadow-2xl border border-white/50">
                {/* WebSocket Connection Status */}
                <p className={`mt-4 text-lg font-semibold ${isConnected ? "text-[#FFD700]" : "text-white"}`}>
                    {isConnected ? "Connected to Server ✅" : "Connecting to Server... ⏳"}
                </p>

                <h2 className="text-[#FFD700] text-[50px] font-bold uppercase">Status</h2>
                <p>
                    <span className="text-[25px] text-[#FFD700] font-semibold">Plank Status: </span>
                    <span className={plank ? "text-[#FFD700] text-[50px] font-semibold" : "text-white text-[50px] font-semibold"}>
                        {plank ? "Correct ✅" : "Incorrect ❌"}
                    </span>
                </p>
                
                {/* Circular Angle Representation */}
                <span className="text-[25px] text-[#FFD700] font-semibold">Angle: </span>
                <span className="flex justify-center items-center mt-4 relative">
                    <svg width="120" height="120" className="transform rotate-90">
                        {/* Grey Background Ring */}
                        <circle
                            cx="60"
                            cy="60"
                            r="50"
                            stroke="#444" // Grey color for the background ring
                            strokeWidth="10"
                            fill="none"
                        />
                        {/* Conditional Progress Ring */}
                        <circle
                            cx="60"
                            cy="60"
                            r="50"
                            stroke={ringColor} // Green or Red based on plank status
                            strokeWidth="10"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeOffset}
                            className="transition-all duration-300"
                        />
                    </svg>
                    <span className="absolute text-white text-[40px] font-bold">
                        {angle}°
                    </span>
                </span>

                <p>
                    <span className="text-[25px] text-[#FFD700] font-semibold">Time Held: </span>
                    <span className="text-[50px] text-[#FFFFFF] font-semibold"> {time_held} sec</span>
                </p>
                <p>
                    <span className="text-[25px] text-[#FFD700] font-semibold">Message: </span>
                    <span className="text-[50px] text-[#FFFFFF] font-semibold"> {plank_message}</span>
                </p>
            </div>
        </div>
    );
}

export default PlankTracker;