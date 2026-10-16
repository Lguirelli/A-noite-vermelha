from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import get_current_user
from ..models import Campaign, CampaignMember, User

router = APIRouter(prefix="/api/campaigns", tags=["campaigns"])


@router.get("")
def list_campaigns(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if user.role == "gm":
        return db.query(Campaign).all()
    ids = [m.campaign_id for m in db.query(CampaignMember).filter(CampaignMember.user_id == user.id)]
    return db.query(Campaign).filter(Campaign.id.in_(ids)).all() if ids else []
