from app.database import Base, engine, SessionLocal
from app.models import Campaign, Scene, Character, SceneElement

Base.metadata.create_all(bind=engine)
db = SessionLocal()
try:
    if db.query(Campaign).first():
        print("Seed já carregado.")
        raise SystemExit(0)

    campaign = Campaign(name="A Noite Vermelha", description="Quatro pontas soltas. Uma dívida antiga.")
    db.add(campaign); db.flush()
    scene = Scene(campaign_id=campaign.id, name="A Estrada sob o Céu Vermelho", grid_size=70)
    db.add(scene); db.flush()
    campaign.active_scene_id = scene.id

    chars = [
        Character(campaign_id=campaign.id, name="Damião", archetype="Condutor da Última Chama", perception_mask=["mundane","cursed","otherworld"]),
        Character(campaign_id=campaign.id, name="Baltazar", archetype="O homem feito de dívidas", perception_mask=["mundane","cursed","otherworld"]),
        Character(campaign_id=campaign.id, name="Octávio", archetype="A primeira testemunha", perception_mask=["mundane","witness","otherworld"]),
        Character(campaign_id=campaign.id, name="Turak", archetype="O último inteiramente humano", perception_mask=["mundane"]),
    ]
    db.add_all(chars)
    db.add_all([
        SceneElement(scene_id=scene.id, kind="text", label="Uma placa velha aponta para a cidade.", x=320, y=260, visibility_mask=["mundane"]),
        SceneElement(scene_id=scene.id, kind="apparition", label="Uma figura observa da mata, sem rosto.", x=900, y=180, visibility_mask=["cursed","witness","otherworld"]),
        SceneElement(scene_id=scene.id, kind="passage", label="A trilha parece livre.", x=1100, y=640, visibility_mask=["mundane"]),
    ])
    db.commit()
    print(f"Campanha criada: id={campaign.id}, cena ativa={scene.id}")
finally:
    db.close()
