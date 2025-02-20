from fastapi import FastAPI, Depends, HTTPException, status, APIRouter, Form
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import aiosmtplib 
from email.message import EmailMessage
import random

load_dotenv()

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
    totalScore: int

class Token(BaseModel):
    access_token: str
    token_type: str
    message: str

class EmailSchema(BaseModel):
    email:str

class ChangePassSchema(BaseModel):
    email:str
    otp:str
    password:str

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


async def send_email_otp(email: str, otp: str):
    """ Sends an OTP email to the user """
    
    try:
        message = EmailMessage()
        message["From"] = "raunaksahni71@gmail.com" #os.getenv("EMAIL_ADDRESS")
        message["To"] = email
        message["Subject"] = "Your OTP for Password Reset"
        message.set_content(f"Your OTP for password reset is: {otp}. This OTP is valid for 5 minutes.")

        smtp = aiosmtplib.SMTP(hostname="smtp.gmail.com", port=587)

        await smtp.connect()
        # await smtp.starttls()
        await smtp.login(("raunaksahni71@gmail.com"),("cagkosdjupqhvorz"))
        await smtp.send_message(message)
        await smtp.quit()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")


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
        "totalScore":0,
        "otp": otp
    })
    return {"message": "User registered successfully."}

@router.post("/leaderBoard")
async def leaders(user:User):
    user_list = await users_collection.find().sort("score", -1).to_list(None) 
     if not user_list:
        raise HTTPException(status_code=404, detail="No users found")
    return {"leaderboard": user_list}

@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await users_collection.find_one({"email": form_data.username})  # username is actually the email field
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer", "message": "User logged in successfully"}


@router.get("/protected")
async def protected_route(user: dict = Depends(oauth2_scheme)):
    return {"message": f"Welcome, {user}!"}



@router.post("/send-otp")
async def send_otp(request : EmailSchema):
    user= await users_collection.find_one({"email":request.email})

    if not user:
        raise HTTPException(status_code=404,detail="email not registered")
    otp = str(generate_otp())
    await users_collection.update_one({"email": request.email}, {"$set": {"otp": otp, "otp_expiry": datetime.utcnow() + timedelta(minutes=5)}})

    await send_email_otp(request.email, otp)

    return {"message": "OTP sent successfully. Check your email."}


@router.post("/change-pass")
async def change_password(request: ChangePassSchema):
    user= await users_collection.find_one({"email":request.email})
    if not user:
        raise HTTPException(status_code=404,detail="This email is not registered")
    
    if str(user["otp"])!=request.otp:
        raise HTTPException(status_code=404,detail="The otp you entered is incorrect or expired")
    
    hashed_password = hash_password(request.password)
    await users_collection.update_one({"email":request.email}, {"$set":{"password":hashed_password}})

    return {"message":"Password updated successfully ."}