import cv2
import numpy as np
import json                 # handles data exchange
import base64               # decode images sent by the frontend

# real time communication handling libraries 
import asyncio 
import websockets

from fastapi import APIRouter,WebSocket        # helps creating webSocket endpoints
from app.services.plank_tracker import PlankTracker

router=APIRouter()
plank_inst= PlankTracker()

@router.websocket("/ws/plank")
async def websocket_endpoint(websocket:WebSocket):
    await websocket.accept()
    print("client connected ")

    try:
        while True:
            data= await websocket.receive_text()                              # recieves a frame from the frontend in Base64 format
            frame_data= base64.b64decode(json.loads(data)["frame"])           # decodes the base64 data into an image
                  
            np_arr=np.frombuffer(frame_data,np.uint8)                         # converts the decoded image data into a NumPy array
            img=cv2.imdecode(np_arr,cv2.IMREAD_COLOR)                         # uses OpenCV to convert the Numpy array into an actual image

            img,lmList=plank_inst.process_frame(img)                          # passes the image through pose detection 
            feedback=plank_inst.check_plank(img,lmList)                       # uses check_plank to analyze posture and determine plank correctness

            await websocket.send_text(json.dumps(feedback))

    except Exception as e :
        print(f"WebSocket Error : {e}")
    finally:
        await websocket.close()
