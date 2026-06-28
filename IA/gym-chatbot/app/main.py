"""
🏋️ Gym Chatbot — Point d'entrée de l'application FastAPI.

Chatbot coach sportif IA avec :
- PostgreSQL pour les données utilisateur
- MongoDB pour l'historique des conversations
- OpenRouter pour l'intelligence artificielle
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.postgresql import init_postgres, close_postgres
from app.db.mongodb import init_mongodb, close_mongodb
from app.api import chat, history, users


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gère le cycle de vie de l'application : connexion/déconnexion des bases de données."""
    print("🚀 Démarrage de l'application Gym Chatbot...")
    
    # Démarrage : initialiser les connexions
    await init_postgres()
    await init_mongodb()
    
    print("✅ Application prête !")
    yield
    
    # Arrêt : fermer proprement les connexions
    print("🛑 Arrêt de l'application...")
    await close_postgres()
    await close_mongodb()


# Création de l'application FastAPI
app = FastAPI(
    title="🏋️ Gym Chatbot API",
    description="API pour un chatbot coach sportif IA. "
                "L'utilisateur discute librement avec l'IA qui se base sur son profil "
                "(salle, machines, objectif) pour personnaliser ses conseils.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — permet au frontend (n'importe quel domaine) d'appeler l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enregistrement des routes
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(history.router, prefix="/api/history", tags=["History"])


@app.get("/", tags=["Health"])
async def root():
    """Endpoint de santé — vérifie que l'API est en ligne."""
    return {
        "status": "online",
        "app": "Gym Chatbot API",
        "version": "1.0.0",
        "docs": "/docs",
    }
