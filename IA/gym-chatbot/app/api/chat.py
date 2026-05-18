"""
Routes API — Chat avec l'IA.
POST /api/chat : Envoyer un message et recevoir la réponse du coach.
"""
from pydantic import BaseModel
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.postgresql import get_db_session
from app.services.chat_service import chat

router = APIRouter(prefix="/api", tags=["Chat"])


# --- Schémas de requête/réponse ---

class ChatRequest(BaseModel):
    """Corps de la requête POST /api/chat."""
    message: str
    user_id: int
    conversation_id: Optional[str] = None  # None = nouvelle conversation


class ChatResponse(BaseModel):
    """Réponse de POST /api/chat."""
    response: str
    conversation_id: str


# --- Routes ---

@router.post("/chat", response_model=ChatResponse)
async def send_message(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db_session),
):
    try:
        result = await chat(
            user_message=request.message,
            user_id=request.user_id,
            conversation_id=request.conversation_id,
            db_session=db,
        )
        return ChatResponse(**result)
    except Exception as e:
        print(f"❌ API Chat Error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

