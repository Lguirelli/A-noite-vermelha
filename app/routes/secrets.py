from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import get_current_user
from ..models import Secret, User
from ..services.websocket import manager

router = APIRouter(prefix="/api/secrets", tags=["secrets"])


@router.post("/{secret_id}/reveal")
async def reveal_secret(secret_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if user.role != "gm":
        raise HTTPException(403, "Somente o Mestre pode revelar segredos")
    secret = db.get(Secret, secret_id)
    if not secret:
        raise HTTPException(404, "Segredo não encontrado")
    secret.is_revealed = True
    secret.revealed_at = datetime.utcnow()
    db.commit()
    payload = {"type": "secret.revealed", "id": secret.id, "title": secret.title, "body": secret.body}
    if secret.target_user_id:
        await manager.send_user(secret.campaign_id, secret.target_user_id, payload)
    else:
        await manager.broadcast(secret.campaign_id, payload)
    return {"ok": True}
