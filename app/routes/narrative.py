from datetime import datetime
from fastapi import APIRouter, Depends, Form, HTTPException, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from pathlib import Path
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import get_current_user
from ..models import Campaign, PlotPoint, NarrativeLog, User

router = APIRouter(prefix="/narrative", tags=["narrative"])
templates = Jinja2Templates(directory=Path(__file__).resolve().parents[1] / "templates")


def _gm_only(user: User):
    if user.role != "gm":
        raise HTTPException(status_code=403, detail="Apenas o Mestre pode controlar a estrutura narrativa.")


def _unlock_ready(db: Session, campaign_id: int):
    points = db.query(PlotPoint).filter(PlotPoint.campaign_id == campaign_id).all()
    by_code = {p.code: p for p in points}
    for point in points:
        if point.status != "locked":
            continue
        if all(by_code.get(code) and by_code[code].status == "completed" for code in (point.prerequisites or [])):
            point.status = "available"
    db.commit()


@router.get("/{campaign_id}/gm", response_class=HTMLResponse, include_in_schema=False)
def gm_panel(campaign_id: int, request: Request, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _gm_only(user)
    _unlock_ready(db, campaign_id)
    campaign = db.get(Campaign, campaign_id)
    if not campaign:
        raise HTTPException(404, "Campanha não encontrada")
    points = db.query(PlotPoint).filter(PlotPoint.campaign_id == campaign_id).order_by(PlotPoint.act, PlotPoint.sort_order, PlotPoint.id).all()
    logs = db.query(NarrativeLog).filter(NarrativeLog.campaign_id == campaign_id).order_by(NarrativeLog.id.desc()).limit(20).all()
    return templates.TemplateResponse("narrative_gm.html", {"request": request, "user": user, "campaign": campaign, "points": points, "logs": logs})


@router.post("/{campaign_id}/plot/{plot_id}/status", include_in_schema=False)
def set_status(campaign_id: int, plot_id: int, status: str = Form(...), db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _gm_only(user)
    point = db.get(PlotPoint, plot_id)
    if not point or point.campaign_id != campaign_id:
        raise HTTPException(404, "Plot point não encontrado")
    allowed = {"locked", "available", "active", "completed", "lost"}
    if status not in allowed:
        raise HTTPException(400, "Status inválido")
    if status == "lost" and (point.point_type == "fixed" or not point.can_be_lost):
        raise HTTPException(400, "Plot points fixos não podem ser perdidos")
    point.status = status
    point.resolved_at = datetime.utcnow() if status in {"completed", "lost"} else None
    db.add(NarrativeLog(
        campaign_id=campaign_id,
        plot_point_id=point.id,
        event_type=status,
        text=(f"Concluído: {point.title}" if status == "completed" else f"Perdido: {point.title}" if status == "lost" else f"{point.title} → {status}"),
        is_player_visible=(status == "completed" and bool(point.player_reveal)),
    ))
    db.commit()
    _unlock_ready(db, campaign_id)
    return RedirectResponse(f"/narrative/{campaign_id}/gm", status_code=303)


@router.get("/{campaign_id}/state")
def narrative_state(campaign_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    query = db.query(PlotPoint).filter(PlotPoint.campaign_id == campaign_id)
    if user.role != "gm":
        query = query.filter(PlotPoint.status == "completed")
    points = query.order_by(PlotPoint.act, PlotPoint.sort_order).all()
    return [{"id": p.id, "code": p.code, "title": p.title, "act": p.act, "type": p.point_type, "status": p.status, "reveal": p.player_reveal if p.status == "completed" else ""} for p in points]
