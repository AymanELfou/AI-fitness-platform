import asyncio
import os
import sys

# Ajouter le chemin du projet pour les imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.models.postgres_models import Base, User, ClientProfile, ClubProfile
from datetime import datetime

# Configuration de la connexion (Localhost pour execution hors Docker)
DATABASE_URL = "postgresql+asyncpg://postgres:postgres123@localhost:5432/smarttrainer"

async def seed():
    print("🚀 Initialisation de la base de données principale...")
    engine = create_async_engine(DATABASE_URL)
    
    async with engine.begin() as conn:
        # Création des tables
        await conn.run_sync(Base.metadata.create_all)
        print("✅ Tables créées avec succès.")

    async_session = async_sessionmaker(engine, expire_on_commit=False)
    
    async with async_session() as session:
        # 1. Créer une salle de sport
        club = ClubProfile(
            club_name="FitZone Casablanca",
            localisation="Maarif, Casablanca",
            capacity=200
        )
        session.add(club)
        await session.flush() # Pour récupérer l'ID
        
        # 2. Créer l'utilisateur Ilyas
        user = User(
            firstname="Ilyas",
            lastname="Ammor",
            email="ilyas@test.com",
            password="hashed_password_123", # Placeholder
            enabled=True
        )
        session.add(user)
        await session.flush()
        
        # 3. Créer son profil client
        profile = ClientProfile(
            user_id=user.id,
            age=25,
            poids=75.0,
            taille=180.0,
            but="Prise de masse musculaire et force",
            niveau="Intermédiaire",
            club_id=club.id
        )
        session.add(profile)
        
        await session.commit()
        print(f"✅ Données de test insérées pour {user.firstname} !")

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(seed())
