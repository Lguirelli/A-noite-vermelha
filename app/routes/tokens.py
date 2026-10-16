from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import get_current_user
from ..models import Token, Scene, User
from ..schemas import TokenMove
from ..services.websocket import manager

router = APIRouter(prefix="/api/tokens", tags=["tokens"])


@router.get("/scene/{scene_id}")
def list_tokens(scene_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    tokens = db.query(Token).filter(Token.scene_id == scene_id).all()
    return [t for t in tokens if user.role == "gm" or t.visible_to_all or t.controller_user_id == user.id]


@router.patch("/{token_id}/move")
async def move_token(token_id: int, payload: TokenMove, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    token = db.get(Token, token_id)
    if not token:
        raise HTTPException(404, "Token não encontrado")
    if user.role != "gm" and token.controller_user_id != user.id:
        raise HTTPException(403, "Você não controla este token")
    token.x, token.y = payload.x, payload.y
    db.commit()
    scene = db.get(Scene, token.scene_id)
    if scene:
        await manager.broadcast(scene.campaign_id, {"type": "token.moved", "token_id": token.id, "x": token.x, "y": token.y})
    return {"ok": True}
