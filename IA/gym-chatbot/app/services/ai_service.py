"""
Service IA — Appel à OpenRouter pour générer les réponses du coach.
"""
from openai import AsyncOpenAI
from app.config import get_settings


def get_ai_client() -> AsyncOpenAI:
    """Crée un client OpenAI pointant vers OpenRouter."""
    settings = get_settings()
    return AsyncOpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=settings.openrouter_api_key,
    )


async def call_ai(messages: list[dict], model: str = "openrouter/auto") -> str:
    """
    Envoie une liste de messages à l'IA et retourne la réponse texte.
    """
    client = get_ai_client()

    try:
        response = await client.chat.completions.create(
            model=model,
            messages=messages,
        )
        content = response.choices[0].message.content
        if content is None:
            raise Exception("L'IA a retourné une réponse vide (None).")
        return content
    except Exception as e:
        print(f"❌ AI Service Error: {e}")
        raise e

