"""
Schémas Pydantic pour les données MongoDB — Conversations et messages.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class MessageSchema(BaseModel):
    """Un message dans une conversation (user ou assistant)."""
    role: str  # "system", "user", "assistant"
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ConversationSchema(BaseModel):
    """Une conversation complète entre un utilisateur et l'IA."""
    user_id: int
    messages: list[MessageSchema] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class GeneratedProgramSchema(BaseModel):
    """Un programme d'entraînement généré par l'IA."""
    user_id: int
    conversation_id: str
    program_json: dict
    created_at: datetime = Field(default_factory=datetime.utcnow)
