from sqlalchemy.orm import Session
from ..models import Character, SceneElement, User


def masks_overlap(character_mask: list[str], visibility_mask: list[str]) -> bool:
    return bool(set(character_mask or ["mundane"]) & set(visibility_mask or ["mundane"]))


def visible_elements_for_user(db: Session, scene_id: int, user: User):
    elements = db.query(SceneElement).filter(SceneElement.scene_id == scene_id, SceneElement.revealed.is_(True)).all()
    if user.role == "gm":
        return elements

    chars = db.query(Character).filter(Character.owner_user_id == user.id).all()
    masks = set(["mundane"])
    for char in chars:
        masks.update(char.perception_mask or [])
    return [e for e in elements if masks_overlap(list(masks), e.visibility_mask)]
