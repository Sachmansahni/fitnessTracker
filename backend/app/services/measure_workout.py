import cv2
import numpy as np
import mediapipe as mp
import asyncio
import json
from scipy.spatial import procrustes
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

def extract_keypoints(image):
    """Extracts and normalizes keypoints from an image."""
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = pose.process(image_rgb)

    keypoints = []
    if results.pose_landmarks:
        for landmark in results.pose_landmarks.landmark:
            keypoints.append((landmark.x, landmark.y))

    return np.array(keypoints) if keypoints else None

def align_keypoints(keypoints):
    """Align keypoints by shifting and normalizing w.r.t. the hip center."""
    if keypoints is None or len(keypoints) < 25:
        return None

    hip_center = (keypoints[23] + keypoints[24]) / 2
    keypoints -= hip_center

    max_dist = np.max(np.linalg.norm(keypoints, axis=1))
    keypoints /= max_dist

    return keypoints

def compute_similarity(keypoints1, keypoints2):
    """Computes similarity using Procrustes Analysis."""
    if keypoints1 is None or keypoints2 is None:
        return 0  

    keypoints1 = align_keypoints(keypoints1)
    keypoints2 = align_keypoints(keypoints2)

    _, transformed1, transformed2 = procrustes(keypoints1, keypoints2)

    mse = np.mean((transformed1 - transformed2) ** 2)
    similarity = (1 - mse) * 100  
    return max(0, similarity)

async def process_video(websocket: WebSocket):
    """Capture frames from webcam and send similarity scores to frontend."""
    cap = cv2.VideoCapture(0)  # Default camera

    try:
        await websocket.accept()

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            height, width, _ = frame.shape
            left_half = frame[:, :width // 2]   # Trainer
            right_half = frame[:, width // 2:]  # User

            keypoints_trainer = extract_keypoints(left_half)
            keypoints_user = extract_keypoints(right_half)

            similarity = compute_similarity(keypoints_trainer, keypoints_user)

            # Send similarity data to frontend
            await websocket.send_text(json.dumps({"similarity": similarity}))

            await asyncio.sleep(0.1)  # Adjust to match frame rate

    except Exception as e:
        print(f"WebSocket error: {e}")

    finally:
        cap.release()
        cv2.destroyAllWindows()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await process_video(websocket)
