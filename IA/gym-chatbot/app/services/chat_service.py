"""
Service Chat — Orchestre le flux complet :
1. Récupère le profil utilisateur (PostgreSQL)
2. Récupère/crée la conversation (MongoDB)
3. Construit le prompt système avec le contexte
4. Appelle l'IA
5. Sauvegarde les messages
"""
from datetime import datetime
from bson import ObjectId
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.postgres_models import User, ClientProfile, ClubProfile
from app.db.mongodb import get_conversations_collection
from app.services.ai_service import call_ai


# Prompt système de base — sera enrichi avec le contexte utilisateur
BASE_SYSTEM_PROMPT = """Tu es un coach sportif IA professionnel et motivant, travaillant pour un réseau de salles de sport.

TON RÔLE :
- Répondre aux questions sur l'entraînement, la nutrition, la récupération
- Créer des programmes d'entraînement personnalisés
- Motiver l'utilisateur et l'accompagner dans ses objectifs
- Adapter tes conseils aux machines disponibles dans la salle de l'utilisateur

RÈGLES :
1. Réponds TOUJOURS en français
2. Sois motivant, positif et professionnel
3. DOMAINE EXCLUSIF : Tu ne dois répondre QU'AUX questions liées au sport (gym, fitness, exercices), à la nutrition sportive, à la récupération et à la santé.
4. REFUS : Si l'utilisateur te pose une question sur un autre sujet (cuisine non-sportive, politique, technologie, etc.), réponds poliment que tu es un coach spécialisé uniquement dans le fitness et que tu ne peux pas l'aider sur ce point.
5. Si tu proposes des exercices, utilise en priorité les machines disponibles de la salle de l'utilisateur (si renseigné)
6. Adapte l'intensité à l'objectif de l'utilisateur (perte de poids, prise de muscle, etc.)
7. Sois concis mais complet dans tes réponses."""


def _build_system_prompt(user: User | None) -> str:
    """Construit le prompt système enrichi avec le contexte utilisateur."""
    prompt = BASE_SYSTEM_PROMPT

    if user:
        context = user.to_context_string()
        prompt += f"\n\nINFORMATIONS SUR L'UTILISATEUR :\n{context}"

    return prompt


async def get_or_create_conversation(user_id: int, conversation_id: str | None = None) -> dict:
    """
    Récupère une conversation existante ou en crée une nouvelle.
    
    Returns:
        Le document conversation MongoDB
    """
    collection = get_conversations_collection()

    if conversation_id:
        # Chercher la conversation existante
        conv = await collection.find_one({"_id": ObjectId(conversation_id), "user_id": user_id})
        if conv:
            return conv

    # Créer une nouvelle conversation
    new_conv = {
        "user_id": user_id,
        "messages": [],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    result = await collection.insert_one(new_conv)
    new_conv["_id"] = result.inserted_id
    return new_conv


async def chat(
    user_message: str,
    user_id: int,
    conversation_id: str | None,
    db_session: AsyncSession,
) -> dict:
    """
    Traite un message utilisateur et retourne la réponse de l'IA.
    
    Args:
        user_message: Le message envoyé par l'utilisateur
        user_id: L'ID de l'utilisateur dans PostgreSQL
        conversation_id: L'ID de la conversation MongoDB (None pour nouvelle conversation)
        db_session: Session PostgreSQL
    
    Returns:
        {
            "response": "texte de la réponse IA",
            "conversation_id": "id de la conversation"
        }
    """
    collection = get_conversations_collection()

    # 1. Récupérer le profil utilisateur depuis PostgreSQL avec ses relations
    from sqlalchemy.orm import selectinload
    query = (
        select(User)
        .where(User.id == user_id)
        .options(
            selectinload(User.client).selectinload(ClientProfile.club)
        )
    )
    result = await db_session.execute(query)
    user = result.scalar_one_or_none()


    # 2. Récupérer ou créer la conversation dans MongoDB
    conversation = await get_or_create_conversation(user_id, conversation_id)
    conv_id = conversation["_id"]

    # 3. Construire les messages pour l'IA
    system_prompt = _build_system_prompt(user)
    
    # Reconstituer l'historique des messages
    ai_messages = [{"role": "system", "content": system_prompt}]
    for msg in conversation.get("messages", []):
        ai_messages.append({"role": msg["role"], "content": msg["content"]})
    
    # Ajouter le nouveau message utilisateur
    ai_messages.append({"role": "user", "content": user_message})

    # 4. Appeler l'IA
    ai_response = await call_ai(ai_messages)

    # 5. Sauvegarder les deux messages dans MongoDB
    now = datetime.utcnow()
    await collection.update_one(
        {"_id": conv_id},
        {
            "$push": {
                "messages": {
                    "$each": [
                        {"role": "user", "content": user_message, "timestamp": now},
                        {"role": "assistant", "content": ai_response, "timestamp": now},
                    ]
                }
            },
            "$set": {"updated_at": now},
        },
    )

    return {
        "response": ai_response,
        "conversation_id": str(conv_id),
    }
