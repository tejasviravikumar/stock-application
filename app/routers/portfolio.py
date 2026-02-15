from fastapi import APIRouter,Depends,status,HTTPException,Response
from sqlalchemy.orm import Session
from ..database import get_db
from .. import schemas , models , oauth2
from typing import List

router = APIRouter(
    prefix="/portfolio"
)

@router.get("/my",status_code=status.HTTP_200_OK,response_model=List[schemas.PortfolioResponse])
async def get_dashboard(db:Session=Depends(get_db),current_user: models.User = Depends(oauth2.get_current_user)):
    portfolios = db.query(models.Portfolio).filter(models.Portfolio.user_id == current_user.id).all()
    return portfolios