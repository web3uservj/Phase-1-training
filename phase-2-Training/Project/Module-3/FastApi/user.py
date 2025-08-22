from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, Session, declarative_base
from fastapi import FastAPI, Depends, HTTPException,status
from pydantic import BaseModel
from typing import List
import hashlib  # Use bcrypt for secure password hashing
import uvicorn
from fastapi.responses import RedirectResponse


url = "sqlite:///./user.db"
engine = create_engine(url, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


app = FastAPI()

class User(Base):
    __tablename__ = "user"
    Id = Column(Integer, primary_key=True, index=True)
    Name = Column(String(100), nullable=False)
    Password = Column(String(100), nullable=False)
    Role = Column(String(100), nullable=False)


Base.metadata.create_all(bind=engine)

class Users(BaseModel):
    Name: str
    Password: str
    Role: str

class UserResponse(BaseModel):
    Name: str
    Role: str

    class Config:
        orm_mode = True


class LoginRequest(BaseModel):
    name: str
    password: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def hash_password(password: str) -> str: 
    return hashlib.sha256(password.encode('utf-8')).hexdigest()


def verify_password(stored_hash: str, password: str) -> bool:
    return stored_hash == hash_password(password)


@app.post("/add_user")
def add_user(user: Users, db: Session = Depends(get_db)):
    hashed_pw = hash_password(user.Password)
    u = User(Name=user.Name, Password=hashed_pw, Role=user.Role)
    db.add(u)
    db.commit()
    db.refresh(u)
    
    return RedirectResponse(url="/get_users", status_code=303)


@app.get("/get_users", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@app.get("/get_userbyId/{id}", response_model=UserResponse)
def get_user(id: int, db: Session = Depends(get_db)):
    u = db.query(User).filter(User.Id == id).first()
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    return u


@app.post("/login", response_model=UserResponse)
def user_login(login_request: LoginRequest, db: Session = Depends(get_db)):
    name = login_request.name
    password = login_request.password
    u = db.query(User).filter(User.Name == name).first()
    if u is None or not verify_password(u.Password, password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    return UserResponse(Name=u.Name, Role=u.Role)


if __name__ == "__main__":
    uvicorn.run("user:app", host="127.0.0.1", port=8000, reload=True)
