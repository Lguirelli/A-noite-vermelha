from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import get_current_user
from ..models import Scene, User
from ..services.visibility import visible_elements_for_user

router = APIRouter(prefix="/api/scenes", tags=["scenes"])


@router.get("/{scene_id}")
def get_scene(scene_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    scene = db.get(Scene, scene_id)
    if not scene:
        raise HTTPException(404, "Cena não encontrada")
    return {
        "id": scene.id,
        "campaign_id": scene.campaign_id,
        "name": scene.name,
        "map_url": scene.map_url,
        "width": scene.width,
        "height": scene.height,
        "grid_size": scene.grid_size,
        "elements": [
            {"id": e.id, "kind": e.kind, "label": e.label, "x": e.x, "y": e.y, "data": e.data, "visibility_mask": e.visibility_mask if user.role == "gm" else None}
            for e in visible_elements_for_user(db, scene_id, user)
        ],
    }
