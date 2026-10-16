from pathlib import Path
from fastapi import FastAPI, Depends, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware
from sqlalchemy.orm import Session
from .config import get_settings
from .database import Base, engine, get_db
from .dependencies import get_current_user
from .models import Campaign, Scene, User
from .routes import campaigns, characters, scenes, tokens, secrets, websocket

settings = get_settings()
BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(title=settings.app_name)
app.add_middleware(SessionMiddleware, secret_key=settings.app_secret_key, same_site="lax")
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")
templates = Jinja2Templates(directory=BASE_DIR / "templates")

app.include_router(campaigns.router)
app.include_router(characters.router)
app.include_router(scenes.router)
app.include_router(tokens.router)
app.include_router(secrets.router)
app.include_router(websocket.router)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)


@app.get("/healthz")
def healthz():
    return {"ok": True, "app": settings.app_name}


@app.get("/", response_class=HTMLResponse)
def home(request: Request, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    campaign = db.query(Campaign).first()
    return templates.TemplateResponse("index.html", {"request": request, "user": user, "campaign": campaign})


@app.get("/table/{campaign_id}", response_class=HTMLResponse)
def tabletop(campaign_id: int, request: Request, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    campaign = db.get(Campaign, campaign_id)
    scene = db.get(Scene, campaign.active_scene_id) if campaign and campaign.active_scene_id else None
    return templates.TemplateResponse("tabletop.html", {"request": request, "user": user, "campaign": campaign, "scene": scene})
