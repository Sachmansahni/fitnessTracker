import cv2
import mediapipe as mp
import numpy as np
import time
import asyncio
import websockets
import base64
import json

class ExerciseTracker:
    def __init__(self):
        self.pose = mp.solutions.pose.Pose()
        self.mpDraw = mp.solutions.drawing_utils
        self.start_time = None
        self.holding_time = 0
        self.rep_count = {"squat": 0, "pushup": 0, "jumping_jack": 0}
        self.exercise_state = {"squat": False, "pushup": False, "jumping_jack": False}

    def find_angle(self, a, b, c):
        """Calculate the angle between three points."""
        ang = np.degrees(
            np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
        )
        return abs(ang) if abs(ang) < 180 else 360 - abs(ang)

    def process_frame(self, img):
        """Process frame and detect landmarks."""
        imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = self.pose.process(imgRGB)
        lmList = []

        if results.pose_landmarks:
            h, w, _ = img.shape
            for lm in results.pose_landmarks.landmark:
                cx, cy = int(lm.x * w), int(lm.y * h)
                lmList.append((cx, cy))
            self.mpDraw.draw_landmarks(img, results.pose_landmarks, mp.solutions.pose.POSE_CONNECTIONS)

        return img, lmList

    def track_plank(self, lmList):
        """Check if the user is in a correct plank position."""
        if len(lmList) < 27:
            return {"plank": False, "time_held": 0}

        shoulder, hip, ankle = lmList[12], lmList[24], lmList[28]
        angle = self.find_angle(shoulder, hip, ankle)

        # 1. Check if the body is parallel to the ground (small Y difference)
        shoulder_hip_diff = abs(shoulder[1] - hip[1])  
        hip_ankle_diff = abs(hip[1] - ankle[1])

        # 2. Ensure the person is horizontal, not standing
        if shoulder_hip_diff < 50 and hip_ankle_diff < 50 and 160 <= angle <= 180:
            if self.start_time is None:
                self.start_time = time.time()
            self.holding_time = int(time.time() - self.start_time)

            if self.holding_time<10:
                return {"plank": True, "time_held": self.holding_time,"angle":int(angle),"message":"Keep going! Hold for a little longer"}
            elif self.holding_time>30:
                return {"plank":True ,"time_held":self.holding_time,"angle":int(angle),"message":"Great job! You're holding strong!"}
            elif self.holding_time%10==0:
                return {"plank":True,"time_held":self.holding_time,"angle":int(angle),"message":f"You've helf the plank for {self.holding_time} seconds!"}
            return {"plank": True, "time_held": self.holding_time,"angle":int(angle),"message":"try more"}
        else:
            self.start_time = None
            self.holding_time = 0
            return {"plank": False, "time_held": 0}


    def track_squat(self, lmList):
        """Count squat repetitions."""
        if len(lmList) < 27:
            return {"squat_reps": self.rep_count["squat"], "message": "Landmarks missing", "correct_squat": False}

        shoulder,hip,knee,ankle=lmList[12],lmList[24],lmList[26],lmList[28]
        
        squat_angle = self.find_angle(hip, knee, ankle)
        torso_angle = self.find_angle(shoulder,hip,knee)

        print(f"Squat Angle:{squat_angle},Torso Angle:{torso_angle}")

        if torso_angle>95:
            posture="Lean forward slightly"
        elif torso_angle<65:
            posture="Too much forward lean"
        else : 
            posture="Good postures"

        if squat_angle < 85:  # Detect squat down
            self.exercise_state["squat"] = True
        elif self.exercise_state["squat"] and squat_angle > 150:  # Detect standing up
            self.rep_count["squat"] += 1
            self.exercise_state["squat"] = False

        if self.rep_count["squat"] < 5:
            message = "Keep going! Squats in progress 💪"
        elif self.rep_count["squat"] % 5 == 0:
            message = f"🔥 Great job! {self.rep_count['squat']} squats done!"

        return {
            "squat_reps": self.rep_count["squat"],
            "message": message,
            "correct_squat": squat_angle < 90,
            "posture": posture  # Added posture feedback
        }

    def track_pushup(self, lmList):
        """Accurately count push-up reps by ensuring correct posture and movement."""
        if len(lmList) < 29:  # Ensure we have all keypoints
            return {"pushup_reps": self.rep_count["pushup"], "pushup_message": "Not enough landmarks detected"}

        # Upper body keypoints
        shoulder, elbow, wrist = lmList[12], lmList[14], lmList[16]
    
        # Lower body keypoints
        hip, knee, ankle = lmList[24], lmList[26], lmList[28] 

        #   Calculate angles
        pushup_angle = self.find_angle(shoulder, elbow, wrist)  # Arm movement
        body_angle = self.find_angle(shoulder, hip, ankle)  # Ensure body is straight

        # Debugging output (print angles for testing)
        print(f"Push-up angle: {pushup_angle}, Body angle: {body_angle}")

        # Ensure the body is in a push-up position before counting
        if body_angle < 160:  
            return {"pushup_reps": self.rep_count["pushup"], "pushup_message": "Keep your body straight"}

        # Detect push-up movement
        if pushup_angle < 45:  # Going down
            self.exercise_state["pushup"] = True
        elif self.exercise_state["pushup"] and pushup_angle > 160:  # Coming up (count rep)
            self.rep_count["pushup"] += 1
            self.exercise_state["pushup"] = False  # Reset for next rep

        return {"pushup_reps": self.rep_count["pushup"], "pushup_message": "Good form! Keep going"}


    def track_jumping_jack(self, lmList):
        """Count jumping jack repetitions."""
        if len(lmList) < 17:
            return {"jumping_jack_reps": self.rep_count["jumping_jack"]}

        wrist_left, wrist_right, shoulder_left, shoulder_right = (
            lmList[15], lmList[16], lmList[11], lmList[12])
        arm_angle = self.find_angle(wrist_left, shoulder_left, wrist_right)

        if arm_angle > 140:
            self.exercise_state["jumping_jack"] = True
        elif self.exercise_state["jumping_jack"] and arm_angle < 50:
            self.rep_count["jumping_jack"] += 1
            self.exercise_state["jumping_jack"] = False

        return {"jumping_jack_reps": self.rep_count["jumping_jack"]}

    def track_exercises(self, img, lmList):
        """Track all exercises and return feedback."""
        feedback = {}
        feedback.update(self.track_plank(lmList))
        feedback.update(self.track_squat(lmList))
        feedback.update(self.track_pushup(lmList))
        feedback.update(self.track_jumping_jack(lmList))
        return feedback

