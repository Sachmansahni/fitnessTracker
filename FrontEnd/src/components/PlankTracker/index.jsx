import React, { useEffect, useRef, useState } from "react";
import { createWebSocket } from "../../utils/websocket"; 

const PlankTracker = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(document.createElement("canvas"));
    const [plankStatus, setPlankStatus] = useState("Not Detected");
    const [angle, setAngle] = useState("-");
    const [timeHeld, setTimeHeld] = useState(0);
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = createWebSocket(setPlankStatus, setAngle, setTimeHeld);

        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        });

        const sendFrames = () => {
            if (videoRef.current) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                const context = canvas.getContext("2d");
                
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                canvas.toBlob((blob) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = () => {
                        const base64data = reader.result.split(",")[1];
                        socketRef.current.send(JSON.stringify({ frame: base64data }));
                    };
                }, "image/jpeg");
            }
        };

        const frameInterval = setInterval(sendFrames, 100);

        return () => {
            clearInterval(frameInterval);
            socketRef.current.close();
        };
    }, []);

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Plank Exercise Tracker</h2>
            <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxWidth: "500px", borderRadius: "10px" }} />
            <div style={{ marginTop: "20px", fontSize: "18px" }}>
                <p><strong>Plank Status:</strong> {plankStatus}</p>
                <p><strong>Angle:</strong> {angle}°</p>
                <p><strong>Time Held:</strong> {timeHeld} sec</p>
            </div>
        </div>
    );
};

export default PlankTracker;