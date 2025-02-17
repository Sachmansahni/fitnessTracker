import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";

const WEBSOCKET_URL = "ws://localhost:8000/ws";

function PushupTracker() {
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
        <div className="flex min-h-screen p-5 bg-black">
            {/* Left Side: Heading and Webcam */}
            <div className="flex flex-col items-start justify-start w-2/3 p-6 rounded-2xl shadow-2xl">
                <h2 className="text-[80px] font-bold text-[#FFD700] tracking-wide">
                    Push-up Exercise Tracker
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
                
                {/* Push-up Feedback */}
                <div>
                    <p>
                        <span className="text-[25px] text-[#FFD700] font-semibold">Push-up Count: </span>
                        <span className="text-[50px] text-[#FFFFFF] font-semibold">{feedback?.pushup_reps}</span>
                    </p>
                    <p>
                        <span className="text-[25px] text-[#FFD700] font-semibold">Message: </span>
                        <span className="text-[50px] text-[#FFFFFF] font-semibold">{feedback?.pushup_message}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PushupTracker;