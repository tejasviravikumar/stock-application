from pydantic import BaseModel,Field
from pydantic import EmailStr
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    username: str
    email: EmailStr
    
    class Config():
        from_attributes = True


class Token(BaseModel):
    access_token : str
    token_type : str

class TokenData(BaseModel):
    id: int | None = None


class Portfolio(BaseModel):
    name: str

class PortfolioBase(Portfolio):
    pass

class PortfolioResponse(PortfolioBase):
    portfolio_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

