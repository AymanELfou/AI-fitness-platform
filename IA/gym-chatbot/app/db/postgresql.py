"""
Connexion PostgreSQL asynchrone via SQLAlchemy + asyncpg.
Stocke les données structurées : utilisateurs, salles, machines.
"""
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

from app.config import get_settings

# Engine et session factory (initialisés au démarrage)
engine = None
async_session_factory = None


class Base(DeclarativeBase):
    """Classe de base pour tous les modèles SQLAlchemy."""
    pass


async def init_postgres():
    """Crée l'engine, la session factory, et les tables."""
    global engine, async_session_factory

    settings = get_settings()
    if engine is None:
        engine = create_async_engine(settings.postgres_url, echo=False)
        async_session_factory = async_sessionmaker(engine, expire_on_commit=False)

    # Créer toutes les tables définies dans les modèles

    # On importe les modèles ici pour que SQLAlchemy les découvre
    from app.models import postgres_models  # noqa: F401

    # NOTE: On ne crée pas les tables ici car on se connecte à une base existante (Java)
    # async with engine.begin() as conn:
    #     await conn.run_sync(Base.metadata.create_all)

    print("✅ PostgreSQL connecté (Base principale).")


async def close_postgres():
    """Ferme proprement la connexion PostgreSQL."""
    global engine
    if engine:
        await engine.dispose()
        print("🔌 PostgreSQL déconnecté.")


async def get_db_session() -> AsyncSession:
    """Fournit une session de base de données pour les requêtes."""
    async with async_session_factory() as session:
        yield session
