from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import get_current_user
from ..models import Character, User

router = APIRouter(prefix="/api/characters", tags=["characters"])


@router.get("/campaign/{campaign_id}")
def list_characters(campaign_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    query = db.query(Character).filter(Character.campaign_id == campaign_id)
    chars = query.all()
    if user.role == "gm":
        return chars
    # Jogador recebe ficha própria completa e versões reduzidas dos demais.
    return [
        {
            "id": c.id, "name": c.name, "archetype": c.archetype,
            "hp": c.hp, "hp_max": c.hp_max, "portrait_url": c.portrait_url,
            "public_notes": c.public_notes,
            "player_notes": c.player_notes if c.owner_user_id == user.id else None,
        }
        for c in chars
    ]
