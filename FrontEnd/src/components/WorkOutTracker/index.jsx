import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const WEBSOCKET_URL = "ws://localhost:8000/ws/workout";

const WorkoutTracker = () => {
    const [status, setStatus] = useState("Not Detected");
    const [exerciseTime, setExerciseTime] = useState(0);
    const socketRef = useRef(null);

    const webcamRef = useRef(null);

    useEffect(() => {
        // Create WebSocket connection
        socketRef.current = new WebSocket(WEBSOCKET_URL);

        // Handle WebSocket open event
        socketRef.current.onopen = () => {
            console.log("WebSocket connection established.");
        };

        // Handle WebSocket message event
        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.status) setStatus(data.status);
            if (data.exerciseTime) setExerciseTime(data.exerciseTime);
        };

        // Handle WebSocket close event
        socketRef.current.onclose = () => {
            console.log("WebSocket connection closed.");
        };

        // Handle WebSocket error event
        socketRef.current.onerror = (error) => {
            console.error("WebSocket error: ", error);
        };

        const sendFrames = () => {
            if (!webcamRef.current) return;
            const imageSrc = webcamRef.current.getScreenshot(); // Capture a frame

            if (imageSrc && socketRef.current.readyState === WebSocket.OPEN) {
                const base64data = imageSrc.split(",")[1];
                socketRef.current.send(JSON.stringify({ frame: base64data }));
            }
        };

        const frameInterval = setInterval(sendFrames, 100);

        return () => {
            clearInterval(frameInterval);
            socketRef.current?.close(); // Close WebSocket connection when the component unmounts
        };
    }, []);

    return (
        <div className="flex justify-center items-center h-screen p-5 bg-black">
            <div className="flex gap-6 w-full rounded-2xl shadow-2xl border border-white/40">
                {/* Left Side: Webcam Feed */}
                <div className="flex-1 text-center">
                    <h2 className="mb-4 text-2xl font-bold text-[#FFD700] tracking-wide">Workout Tracker</h2>
                    <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        width="100%"
                        videoConstraints={{
                            facingMode: "user",
                        }}
                        className="w-full h-[700px] rounded-xl border-4 border-[#FFD700] shadow-lg transition-all duration-300 hover:border-white"
                    />
                </div>

                {/* Right Side: Follow Along Video */}
                <div className="flex-1 text-center">
                    <h2 className="mb-4 text-2xl font-bold text-[#FFD700] tracking-wide">Follow Along</h2>
                    <iframe
                        width="100%"
                        height="700"
                        src="https://www.youtube.com/embed/LJwupStv_jE"
                        title="Workout Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-[700px] rounded-xl border-4 border-[#FFD700] shadow-lg transition-all duration-300 hover:border-white"
                    />
                </div>
            </div>
        </div>
    );
};

export default WorkoutTracker;