import React, { useEffect, useRef, useState } from "react";
import { createWebSocket } from "../../util/websocket";

const WorkoutTracker = () => {
    const videoRef = useRef(null);
    const youtubeRef = useRef(null);
    const canvasRef = useRef(null);
    const socketRef = useRef(null);
    const [status, setStatus] = useState("Not Detected");
    const [exerciseTime, setExerciseTime] = useState(0);

    useEffect(() => {
        socketRef.current = createWebSocket(setStatus, setExerciseTime);

        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        });

        const sendFrames = () => {
            if (!videoRef.current || !canvasRef.current) return;
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                if (blob && socketRef.current) {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = () => {
                        const base64data = reader.result.split(",")[1];
                        socketRef.current.send(JSON.stringify({ frame: base64data }));
                    };
                }
            }, "image/jpeg");
        };

        const frameInterval = setInterval(sendFrames, 100);

        return () => {
            clearInterval(frameInterval);
            socketRef.current?.close();
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="flex justify-center items-center h-screen p-5 bg-black">
            <div className="flex gap-6 w-full rounded-2xl shadow-2xl border border-white/40">
                {/* Left Side: Video Feed */}
                <div className="flex-1 text-center">
                    <h2 className="mb-4 text-2xl font-bold text-[#FFD700] tracking-wide">Workout Tracker</h2>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-[700px] rounded-xl border-4 border-[#FFD700] shadow-lg transition-all duration-300 hover:border-white"
                    />
                </div>

                {/* Right Side: Follow Along Video */}
                <div className="flex-1 text-center">
                    <h2 className="mb-4 text-2xl font-bold text-[#FFD700] tracking-wide">Follow Along</h2>
                    <iframe
                        ref={youtubeRef}
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
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        </div>
    );
};

export default WorkoutTracker;