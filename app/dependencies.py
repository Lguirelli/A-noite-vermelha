from fastapi import Depends, Request
from sqlalchemy.orm import Session
from .database import get_db
from .models import User
from .config import get_settings


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    # Protótipo: usa um usuário dev. Substituir por autenticação real.
    user_id = request.session.get("user_id")
    user = db.get(User, user_id) if user_id else None
    if user:
        return user

    settings = get_settings()
    user = User(name=settings.dev_user_name, role=settings.dev_user_role)
    db.add(user)
    db.commit()
    db.refresh(user)
    request.session["user_id"] = user.id
    return user
