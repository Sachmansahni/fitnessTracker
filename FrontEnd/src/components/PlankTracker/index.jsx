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
//         <div className="flex justify-center items-center h-screen p-5 bg-gradient-to-br from-myTeal to-myPeach">
//             <div className="flex gap-6 max-w-5xl w-full bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/40">
//                 <div className="flex-1 text-center">
//                     <h2 className="mb-4 text-2xl font-bold text-gray-900 tracking-wide">Plank Exercise Tracker</h2>
//                     <video ref={videoRef} autoPlay playsInline className="w-full h-[350px] rounded-xl border-4 border-myPeach shadow-lg transition-all duration-300 hover:border-myTeal" />
//                     <p className="mt-4 text-lg text-gray-800 font-semibold"><strong>Plank Status:</strong> {plankStatus}</p>
//                     <p className="text-lg text-gray-800 font-semibold"><strong>Angle:</strong> {angle}°</p>
//                     <p className="text-lg text-gray-800 font-semibold"><strong>Time Held:</strong> {timeHeld} sec</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PlankTracker;




// import React, { useState, useRef, useEffect } from "react";
// import Webcam from "react-webcam";

// // The WebSocket URL should match the one in your FastAPI backend
// const WEBSOCKET_URL = "ws://localhost:8000/ws";

// function App() {
//   const [feedback, setFeedback] = useState(null); // To store feedback
//   const [isConnected, setIsConnected] = useState(false); // To track WebSocket connection status
//   const [websocket, setWebSocket] = useState(null); // WebSocket instance

//   const webcamRef = useRef(null); // To access the webcam
//   const intervalRef = useRef(null); // To manage periodic frame sending

//   useEffect(() => {
//     const socket = new WebSocket(WEBSOCKET_URL);

//     socket.onopen = () => {
//       setIsConnected(true);
//       console.log("Connected to WebSocket");
//     };

//     socket.onclose = () => {
//       setIsConnected(false);
//       console.log("Disconnected from WebSocket");
//     };

//     socket.onerror = (error) => {
//       console.error("WebSocket Error:", error);
//     };

//     socket.onmessage = (event) => {
//       const response = JSON.parse(event.data);
//       if (response.feedback) {
//         setFeedback(response.feedback); // Update feedback state
//       }
//       if (response.image) {
//         // Handle the base64-encoded image if needed (you can display it if you want)
//         console.log("Received processed image from server.");
//       }
//     };

//     setWebSocket(socket);

//     return () => {
//       socket.close(); // Close WebSocket when the component unmounts
//     };
//   }, []);

//   const sendFrame = () => {
//     if (websocket && webcamRef.current) {
//       const imageSrc = webcamRef.current.getScreenshot();
//       if (imageSrc) {
//         const frameData = {
//           frame: imageSrc.split(",")[1], // Remove the "data:image/jpeg;base64," part
//         };

//         websocket.send(JSON.stringify(frameData)); // Send the frame to the server
//       }
//     }
//   };

//   // Start sending frames at regular intervals
//   useEffect(() => {
//     if (isConnected && !intervalRef.current) {
//       intervalRef.current = setInterval(() => {
//         sendFrame();
//       }, 100); // Send frames every 100ms (10 fps)
//     }

//     // Clear the interval when disconnected or component unmounts
//     if (!isConnected && intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [isConnected]);

//   return (
//     <div>
//       <h1>Plank Tracker</h1>
//       <Webcam
//         audio={false}
//         ref={webcamRef}
//         screenshotFormat="image/jpeg"
//         width="100%"
//         videoConstraints={{ facingMode: "user" }}
//       />
//       <div>
//         {feedback && (
//           <div>
//             <p>Plank Status: {feedback.plank ? "Correct" : "Incorrect"}</p>
//             <p>Angle: {feedback.angle}°</p>
//             <p>Time Held: {feedback.time_held}s</p>
//           </div>
//         )}
//       </div>
//       <div>
//         {!isConnected && <p>Connecting to WebSocket...</p>}
//         {isConnected && <p>Connected to WebSocket</p>}
//       </div>
//     </div>
//   );
// }

// export default App;


import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";

const WEBSOCKET_URL = "ws://localhost:8000/ws";

function App() {
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
  }, []);

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
      intervalRef.current = setInterval(sendFrame, 100); // Send frames every 100ms
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isConnected]);

  return (
    <div>
      <h1>Plank Tracker</h1>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="100%"
        videoConstraints={{ facingMode: "user" }}
      />
      {feedback && (
        <div>
          <p>Plank Status: {feedback.plank ? "Correct" : "Incorrect"}</p>
          <p>Angle: {feedback.angle}°</p>
          <p>Time Held: {feedback.time_held}s</p>
        </div>
      )}
      <p>{isConnected ? "Connected to WebSocket" : "Connecting to WebSocket..."}</p>
    </div>
  );
}

export default App;
