"""
Configuration de l'application — charge les variables d'environnement via pydantic-settings.
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # OpenRouter
    openrouter_api_key: str

    # PostgreSQL
    postgres_user: str = "gymbot"
    postgres_password: str = "gymbot_secret_2024"
    postgres_db: str = "gymbot_db"
    postgres_host: str = "postgres"
    postgres_port: int = 5432

    # MongoDB
    mongodb_uri: str = "mongodb://mongodb:27017"
    mongodb_db: str = "gymbot_conversations"

    # App
    app_host: str = "0.0.0.0"
    app_port: int = 8000

    @property
    def postgres_url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    return Settings()
