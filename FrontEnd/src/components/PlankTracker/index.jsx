// import React, { useEffect, useRef, useState } from "react";
// import { createWebSocket } from "../../util/websocket";

// const PlankTracker = () => {
//     const videoRef = useRef(null);
//     const canvasRef = useRef(document.createElement("canvas"));
//     const socketRef = useRef(null);
//     const [plankStatus, setPlankStatus] = useState("Not Detected");
//     const [angle, setAngle] = useState("-");
//     const [timeHeld, setTimeHeld] = useState(0);

//     useEffect(() => {
//         socketRef.current = createWebSocket(setPlankStatus, setAngle, setTimeHeld);

//         navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
//             if (videoRef.current) {
//                 videoRef.current.srcObject = stream;
//             }
//         });

//         const sendFrames = () => {
//             if (videoRef.current) {
//                 const video = videoRef.current;
//                 const canvas = canvasRef.current;
//                 const context = canvas.getContext("2d");

//                 canvas.width = video.videoWidth;
//                 canvas.height = video.videoHeight;
//                 context.drawImage(video, 0, 0, canvas.width, canvas.height);

//                 canvas.toBlob((blob) => {
//                     const reader = new FileReader();
//                     reader.readAsDataURL(blob);
//                     reader.onloadend = () => {
//                         const base64data = reader.result.split(",")[1];
//                         socketRef.current.send(JSON.stringify({ frame: base64data }));
//                     };
//                 }, "image/jpeg");
//             }
//         };

//         const frameInterval = setInterval(sendFrames, 20);

//         return () => {
//             clearInterval(frameInterval);
//             socketRef.current.close();
//         };
//     }, []);

//     return (
//         
//                 
//            
//     );
// };

// export default PlankTracker;

import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";

const WEBSOCKET_URL = "ws://localhost:8000/ws";

function PlankTracker() {
    const [feedback, setFeedback] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const websocketRef = useRef(null); // Store WebSocket instance
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
            if (response.feedback) {
                console.log(response.feedback)
                setFeedback(response.feedback);
            }
        };

        return () => {
            socket.close(); // Close WebSocket when the component unmounts
        };
    }, [feedback]);

    const sendFrame = () => {
        if (websocketRef.current?.readyState === WebSocket.OPEN && webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                websocketRef.current.send(JSON.stringify({
                    frame: imageSrc.split(",")[1] // Remove "data:image/jpeg;base64,"
                }));
            }
        }
    };

    useEffect(() => {
        if (isConnected && !intervalRef.current) {
            intervalRef.current = setInterval(sendFrame, 20); // Send frames every 100ms
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = null;
        };
    }, [isConnected]);

    return (
        <div className="flex justify-center items-center h-screen p-5 bg-gradient-to-br from-myTeal to-myPeach">
            {/* <div className="flex gap-6 max-w-5xl w-full bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/40"></div> */}
            <div className="flex-1 text-center">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 tracking-wide">Plank Exercise Tracker</h2>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width="100%"
                    videoConstraints={{ facingMode: "user" }}
                    className="w-full h-[700px] rounded-xl border-4 border-myPeach shadow-lg transition-all duration-300 hover:border-myTeal"
                />
                {feedback && (
                    <>
                        {/* <video ref={videoRef} autoPlay playsInline className="w-full h-[350px] rounded-xl border-4 border-myPeach shadow-lg transition-all duration-300 hover:border-myTeal" /> */}
                        <p className="mt-4 text-lg text-gray-800 font-semibold"><strong>Plank Status:</strong> {feedback.plank ? "Correct" : "Incorrect"}</p>
                        <p className="text-lg text-gray-800 font-semibold"><strong>Angle:</strong> {feedback.angle}°</p>
                        <p className="text-lg text-gray-800 font-semibold"><strong>Time Held:</strong> {feedback.time_held} sec</p>
                    </>
                )
                }
                <p>{isConnected ? "Connected to WebSocket" : "Connecting to WebSocket..."}</p>
            </div >
        </div>
    );
}

export default PlankTracker;