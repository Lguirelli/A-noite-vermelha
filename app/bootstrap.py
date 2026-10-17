from sqlalchemy.orm import Session

from .models import Campaign, Scene, Character, SceneElement, PlotPoint


PLOT_POINTS = [
    dict(code="arrival", title="Chegada sob a Noite Vermelha", description="O grupo entra na região e percebe que a noite não é comum.", act=1, point_type="fixed", status="available", can_be_lost=False, sort_order=10, player_reveal="A cidade está cercada por sinais de que algo antigo voltou a se mover."),
    dict(code="fearful_pactant", title="O pactuante em pânico", description="Alguém que fez um pacto confunde o grupo com cobradores e reage antes de ouvir explicações.", act=1, point_type="mobile", status="available", can_be_lost=True, sort_order=20, possible_locations=["mercado", "estrada", "hospedaria", "fazenda"], player_reveal="Alguém na região teme uma cobrança que vocês ainda não compreendem."),
    dict(code="collector_legend", title="A lenda dos Cobradores", description="O grupo entende que existe uma tradição de cobrança de pactos, mas não sabe quem a executa.", act=1, point_type="fixed", status="locked", can_be_lost=False, sort_order=30, prerequisites=["arrival"], player_reveal="Os moradores falam de cobradores que vêm buscar dívidas antigas."),
    dict(code="vilar_help", title="Vilar ajuda o grupo", description="Vilar aparece sob uma identidade confiável e oferece ajuda sem revelar sua natureza.", act=2, point_type="mobile", status="locked", can_be_lost=True, sort_order=10, prerequisites=["collector_legend"], possible_locations=["mata", "igreja", "rua", "fazenda"], player_reveal="Um estranho parece saber mais sobre a região do que deveria."),
    dict(code="entity_suspect", title="A entidade se torna o principal suspeito", description="As evidências disponíveis convergem para uma interpretação errada, porém plausível.", act=2, point_type="fixed", status="locked", can_be_lost=False, sort_order=20, prerequisites=["collector_legend"], player_reveal="As pistas começam a apontar para uma presença específica por trás das tragédias."),
    dict(code="contradiction", title="Uma contradição na versão conhecida", description="Uma pista opcional mostra que datas, testemunhos ou acontecimentos não encaixam perfeitamente.", act=3, point_type="mobile", status="locked", can_be_lost=True, sort_order=10, prerequisites=["entity_suspect"], possible_locations=["arquivo", "cemitério", "fazenda", "casa abandonada"], player_reveal="Há algo errado na cronologia dos acontecimentos."),
    dict(code="vilar_truth", title="A verdade sobre Vilar", description="O grupo descobre que Vilar fabricou parte do conflito e ocupa o papel do verdadeiro cobrador.", act=4, point_type="fixed", status="locked", can_be_lost=False, sort_order=10, prerequisites=["entity_suspect"], player_reveal="Vilar não estava guiando vocês para a verdade. Estava guiando vocês para o resultado que precisava."),
]


def ensure_plot_points(db: Session, campaign: Campaign) -> None:
    """Add missing narrative definitions without resetting existing progress."""
    existing = {p.code for p in db.query(PlotPoint).filter(PlotPoint.campaign_id == campaign.id).all()}
    for payload in PLOT_POINTS:
        if payload["code"] not in existing:
            db.add(PlotPoint(campaign_id=campaign.id, **payload))
    db.commit()


def ensure_demo_world(db: Session) -> Campaign:
    """Create the initial world and safely add new seed content on later deploys."""
    campaign = db.query(Campaign).first()
    if campaign:
        ensure_plot_points(db, campaign)
        return campaign

    campaign = Campaign(name="A Noite Vermelha", description="Quatro pontas soltas. Uma dívida antiga.")
    db.add(campaign)
    db.flush()

    scene = Scene(campaign_id=campaign.id, name="A Estrada sob o Céu Vermelho", grid_size=70)
    db.add(scene)
    db.flush()
    campaign.active_scene_id = scene.id

    db.add_all([
        Character(campaign_id=campaign.id, name="Damião", archetype="Condutor da Última Chama", perception_mask=["mundane", "cursed", "otherworld"]),
        Character(campaign_id=campaign.id, name="Baltazar", archetype="O homem feito de dívidas", perception_mask=["mundane", "cursed", "otherworld"]),
        Character(campaign_id=campaign.id, name="Octávio", archetype="A primeira testemunha", perception_mask=["mundane", "witness", "otherworld"]),
        Character(campaign_id=campaign.id, name="Turak", archetype="O último inteiramente humano", perception_mask=["mundane"]),
    ])

    db.add_all([
        SceneElement(scene_id=scene.id, kind="text", label="Uma placa velha aponta para a cidade.", x=320, y=260, visibility_mask=["mundane"]),
        SceneElement(scene_id=scene.id, kind="apparition", label="Uma figura observa da mata, sem rosto.", x=900, y=180, visibility_mask=["cursed", "witness", "otherworld"]),
        SceneElement(scene_id=scene.id, kind="passage", label="A trilha parece livre.", x=1100, y=640, visibility_mask=["mundane"]),
    ])
    db.commit()
    db.refresh(campaign)
    ensure_plot_points(db, campaign)
    return campaign
