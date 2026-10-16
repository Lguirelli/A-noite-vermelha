from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "A Noite Vermelha"
    app_secret_key: str = "dev-secret"
    app_port: int = 8013
    database_url: str = ""
    dev_user_name: str = "Mestre"
    dev_user_role: str = "gm"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def resolved_database_url(self) -> str:
        return self.database_url or "sqlite:///./anoitevermelha.db"


@lru_cache
def get_settings() -> Settings:
    return Settings()
