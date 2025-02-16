from fastapi import FastAPI      # backend framework
from fastapi.middleware.cors import CORSMiddleware    # the CORS PROPERTY HANDLER -> frontend se request aane dega
from app.api.routes.websocket import router as websocket_router    # handles real time connections 
from app.services.auth_services import router as auth_router

app=FastAPI()       # fastapi app initialized

app.add_middleware(          # adds CORS middleware to allow request from any frontend 
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(websocket_router)  
# allows the WebSocket endpoints defined in websocket.py to be part of the FastAPI application.
app.include_router(auth_router)

@app.get("/")
def home():
    return {"message":"Fitness Tracker Backend is Running "}