from app.database import Base, engine, SessionLocal
from app.bootstrap import ensure_demo_world

Base.metadata.create_all(bind=engine)
with SessionLocal() as db:
    campaign = ensure_demo_world(db)
    print(f"Campanha pronta: id={campaign.id}, cena ativa={campaign.active_scene_id}")
