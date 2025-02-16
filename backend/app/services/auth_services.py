from fastapi import FastAPI, Depends, HTTPException, status, APIRouter, Form
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from aiosmtplib import SMTP
from email.message import EmailMessage
import random

load_dotenv()

EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587  # Change to 587 for TLS
EMAIL_USERNAME = os.getenv("EMAIL_USERNAME")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

router = APIRouter()

MONGO_URL = "mongodb+srv://sachman:namhcas@cluster0.izbq8.mongodb.net/"
client = AsyncIOMotorClient(MONGO_URL)
db = client["auth_db"]
users_collection = db["users"]

SECRET_KEY = "GHgfghjNBHUGhy56789IUJHGyukm"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class User(BaseModel):
    username: str
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    message: str

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def generate_otp() -> int:
    return random.randint(100000, 999999)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def send_email(to_email: str, subject: str, body: str):
    msg = EmailMessage()
    msg["From"] = EMAIL_USERNAME
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.set_content(body)

    try:
        async with SMTP(hostname=EMAIL_HOST, port=EMAIL_PORT, timeout=30) as smtp:
            await smtp.connect()
            await smtp.starttls()
            await smtp.login(EMAIL_USERNAME, EMAIL_PASSWORD)
            await smtp.send_message(msg)
        return {"message": "Email sent successfully!"}
    except Exception as e:
        return {"error": str(e)}

@router.post("/register")
async def register(user: User):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    otp = generate_otp()
    hashed_password = hash_password(user.password)
    await users_collection.insert_one({
        "username": user.username, 
        "email": user.email, 
        "password": hashed_password, 
        "otp": otp
    })
    return {"message": "User registered successfully."}

@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await users_collection.find_one({"email": form_data.username})  # `username` is actually the email field
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer", "message": "User logged in successfully"}


@router.get("/protected")
async def protected_route(user: dict = Depends(oauth2_scheme)):
    return {"message": f"Welcome, {user}!"}
