from .. import models , schemas , oauth2
from ..utils import get_password_hash
from fastapi import FastAPI ,APIRouter, Response , status , HTTPException , Depends
from sqlalchemy.orm import Session
from ..database import get_db , engine

models.Base.metadata.create_all(bind=engine)

router = APIRouter(
    prefix="/register"
)

@router.post("/newuser",status_code=status.HTTP_201_CREATED,response_model=schemas.UserResponse)
async def create_user(user_details:schemas.UserCreate,db:Session=Depends(get_db)):

    hashed_pass = get_password_hash(user_details.password)
    user_details.password = hashed_pass

    new_user = models.User(**user_details.dict())
    db.add(new_user)
    db.commit()

    db.refresh(new_user)
    return new_user


