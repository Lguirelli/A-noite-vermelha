from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import PlotPoint


def test_mobile_plot_can_be_lost():
    with TestClient(app) as client:
        with SessionLocal() as db:
            point = db.query(PlotPoint).filter(PlotPoint.code == "fearful_pactant").first()
            assert point is not None
            plot_id = point.id
            campaign_id = point.campaign_id
        r = client.post(f"/narrative/{campaign_id}/plot/{plot_id}/status", data={"status": "lost"}, follow_redirects=False)
        assert r.status_code == 303
        with SessionLocal() as db:
            point = db.get(PlotPoint, plot_id)
            assert point.status == "lost"


def test_fixed_plot_cannot_be_lost():
    with TestClient(app) as client:
        with SessionLocal() as db:
            point = db.query(PlotPoint).filter(PlotPoint.code == "arrival").first()
            plot_id = point.id
            campaign_id = point.campaign_id
        r = client.post(f"/narrative/{campaign_id}/plot/{plot_id}/status", data={"status": "lost"})
        assert r.status_code == 400
