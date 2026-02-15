from fastapi import APIRouter, Depends, status, HTTPException, Response
from sqlalchemy.orm import Session
from fastapi.security.oauth2 import OAuth2PasswordRequestForm

from ..database import get_db
from .. import models, oauth2
from ..utils import verify_password

router = APIRouter(
    prefix="/auth",
    tags=['Authentication']
)

@router.post("/login", status_code=status.HTTP_200_OK)
async def login_user(
    response: Response,  # <-- add Response to set cookies
    user_credentials: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # Find the user by username
    user = db.query(models.User).filter(
        models.User.username == user_credentials.username
    ).first()

    if not user or not verify_password(user_credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid credentials"
        )

    # Create JWT token
    access_token = oauth2.create_access_token(
        data={"user_id": user.id}
    )

    # Set the token in a secure HttpOnly cookie
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,       # JS cannot access this cookie
        secure=False,        # Set True in production (HTTPS)
        samesite="strict",   # Prevent CSRF attacks
        max_age=60*60*24     # Optional: expires in 1 day
    )

    # Optional: return a simple success message instead of the token
    return {"message": "Login successful"}
