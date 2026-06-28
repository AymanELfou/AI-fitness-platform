"""
Routes API — Historique des conversations.
GET /api/history : Récupérer les conversations d'un utilisateur.
"""
from fastapi import APIRouter, HTTPException
from bson import ObjectId

from app.db.mongodb import get_conversations_collection

router = APIRouter(prefix="/api", tags=["History"])


@router.get("/history/{user_id}")
async def get_user_conversations(user_id: int, limit: int = 20):
    """
    Récupère les dernières conversations d'un utilisateur.
    
    - **user_id** : L'ID de l'utilisateur
    - **limit** : Nombre max de conversations (défaut: 20)
    """
    collection = get_conversations_collection()
    cursor = collection.find(
        {"user_id": user_id},
        sort=[("updated_at", -1)],
    ).limit(limit)

    conversations = []
    async for conv in cursor:
        conversations.append({
            "conversation_id": str(conv["_id"]),
            "user_id": conv["user_id"],
            "message_count": len(conv.get("messages", [])),
            "created_at": conv.get("created_at"),
            "updated_at": conv.get("updated_at"),
            # Aperçu du dernier message
            "last_message": conv["messages"][-1]["content"][:100] if conv.get("messages") else None,
        })

    return {"conversations": conversations}


@router.get("/history/{user_id}/{conversation_id}")
async def get_conversation_detail(user_id: int, conversation_id: str):
    """
    Récupère le détail complet d'une conversation (tous les messages).
    
    - **user_id** : L'ID de l'utilisateur
    - **conversation_id** : L'ID de la conversation MongoDB
    """
    collection = get_conversations_collection()

    try:
        conv = await collection.find_one({
            "_id": ObjectId(conversation_id),
            "user_id": user_id,
        })
    except Exception:
        raise HTTPException(status_code=400, detail="ID de conversation invalide")

    if not conv:
        raise HTTPException(status_code=404, detail="Conversation non trouvée")

    return {
        "conversation_id": str(conv["_id"]),
        "user_id": conv["user_id"],
        "messages": [
            {
                "role": msg["role"],
                "content": msg["content"],
                "timestamp": msg.get("timestamp"),
            }
            for msg in conv.get("messages", [])
        ],
        "created_at": conv.get("created_at"),
        "updated_at": conv.get("updated_at"),
    }
