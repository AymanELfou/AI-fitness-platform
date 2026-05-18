"""
Connexion MongoDB asynchrone via Motor.
Stocke les données flexibles : conversations, programmes générés.
"""
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import get_settings

# Client et base de données (initialisés au démarrage)
client: AsyncIOMotorClient = None
database = None


async def init_mongodb():
    """Initialise la connexion MongoDB et crée les index."""
    global client, database

    settings = get_settings()
    client = AsyncIOMotorClient(settings.mongodb_uri)
    database = client[settings.mongodb_db]

    # Créer les index pour optimiser les requêtes
    await database.conversations.create_index("user_id")
    await database.conversations.create_index("created_at")
    await database.generated_programs.create_index("user_id")
    await database.generated_programs.create_index("conversation_id")

    print("✅ MongoDB connecté et index créés.")


async def close_mongodb():
    """Ferme proprement la connexion MongoDB."""
    global client
    if client:
        client.close()
        print("🔌 MongoDB déconnecté.")


def get_conversations_collection():
    """Retourne la collection des conversations."""
    return database["conversations"]


def get_programs_collection():
    """Retourne la collection des programmes générés."""
    return database["generated_programs"]
