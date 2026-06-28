from pydantic import BaseModel
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db.postgresql import get_db_session
from app.models.postgres_models import User, ClientProfile, ClubProfile

router = APIRouter(prefix="/api", tags=["Users"])

class UserResponse(BaseModel):
    id: int
    firstname: Optional[str]
    lastname: Optional[str]
    email: str
    age: Optional[int] = None
    poids: Optional[float] = None
    taille: Optional[float] = None
    but: Optional[str] = None
    niveau: Optional[str] = None
    club_name: Optional[str] = None

@router.get("/users", response_model=List[UserResponse])
async def list_users(db: AsyncSession = Depends(get_db_session)):
    """Liste les utilisateurs avec leur profil client."""
    result = await db.execute(
        select(User).options(selectinload(User.client).selectinload(ClientProfile.club))
    )
    users = result.scalars().all()
    
    response = []
    for u in users:
        res = {
            "id": u.id,
            "firstname": u.firstname,
            "lastname": u.lastname,
            "email": u.email,
        }
        if u.client:
            res.update({
                "age": u.client.age,
                "poids": u.client.poids,
                "taille": u.client.taille,
                "but": u.client.but,
                "niveau": u.client.niveau,
            })
            if u.client.club:
                res["club_name"] = u.client.club.club_name
        response.append(UserResponse(**res))
    return response

@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: AsyncSession = Depends(get_db_session)):
    """Récupère un utilisateur spécifique."""
    result = await db.execute(
        select(User)
        .where(User.id == user_id)
        .options(selectinload(User.client).selectinload(ClientProfile.club))
    )
    u = result.scalar_one_or_none()
    if not u:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
        
    res = {
        "id": u.id,
        "firstname": u.firstname,
        "lastname": u.lastname,
        "email": u.email,
    }
    if u.client:
        res.update({
            "age": u.client.age,
            "poids": u.client.poids,
            "taille": u.client.taille,
            "but": u.client.but,
            "niveau": u.client.niveau,
        })
        if u.client.club:
            res["club_name"] = u.client.club.club_name
    return UserResponse(**res)
