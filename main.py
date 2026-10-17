"""ASGI deployment entrypoint.

The application implementation lives in app/main.py. Keeping a root main.py
makes FastAPI deployment discovery straightforward while preserving the
internal package layout.
"""
from app.main import app

__all__ = ["app"]
