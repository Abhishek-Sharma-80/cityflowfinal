import os
from typing import Generator
from pydantic_settings import BaseSettings
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

class DatabaseSettings(BaseSettings):
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./cityflow_db.sqlite"  # Fallback to local SQLite or PostgreSQL when DATABASE_URL is set
    )
    DB_POOL_TIMEOUT: int = 30
    DB_ECHO: bool = False

    class Config:
        env_file = ".env"
        extra = "ignore"

db_settings = DatabaseSettings()

# Handle SQLite vs PostgreSQL connect_args
connect_args = {"check_same_thread": False} if db_settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    db_settings.DATABASE_URL,
    connect_args=connect_args,
    echo=db_settings.DB_ECHO,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    """Dependency injection helper for FastAPI route handlers."""
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
