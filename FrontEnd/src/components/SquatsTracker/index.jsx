import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";

const WEBSOCKET_URL = "ws://localhost:8000/ws";

function SquatTracker() {
    const [feedback, setFeedback] = useState(null);
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
                setFeedback(response);
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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-5 bg-gradient-to-br from-myTeal to-myPeach">
            <h2 className="mb-6 text-3xl font-bold text-gray-900 tracking-wide">
                Squat Exercise Tracker
            </h2>

            <div className="flex flex-col items-center w-full max-w-2xl bg-white/40 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/50">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width="100%"
                    videoConstraints={{ facingMode: "user" }}
                    className="w-full h-[400px] rounded-xl border-4 border-myPeach shadow-lg transition-all duration-300 hover:border-myTeal"
                />

                {/* WebSocket Connection Status */}
                <p className={`mt-4 text-lg font-semibold ${isConnected ? "text-green-600" : "text-red-600"}`}>
                    {isConnected ? "Connected to WebSocket ✅" : "Connecting to WebSocket... ⏳"}
                </p>

                {/* Display feedback data if available */}
                {feedback && (
                    <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md w-full text-center">
                        <p className="text-lg text-gray-800 font-semibold">
                            <strong>Squat Count:</strong> {feedback.count}
                        </p>
                        <p className="text-lg text-gray-800 font-semibold">
                            <strong>Depth Accuracy:</strong>{" "}
                            <span className={feedback.correct_squat ? "text-green-600" : "text-red-600"}>
                                {feedback.correct_squat ? "Good ✅" : "Too Shallow ❌"}
                            </span>
                        </p>
                        <p className="text-lg text-gray-800 font-semibold">
                            <strong>Posture Feedback:</strong> {feedback.posture}
                        </p>
                        <p className="text-lg text-gray-800 font-semibold">
                            <strong>Message:</strong> {feedback.message}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SquatTracker;