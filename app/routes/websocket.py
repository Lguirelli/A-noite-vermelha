from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from ..services.websocket import manager

router = APIRouter(tags=["websocket"])


@router.websocket("/ws/campaign/{campaign_id}/user/{user_id}")
async def campaign_socket(websocket: WebSocket, campaign_id: int, user_id: int):
    # TODO: validar a identidade do user_id por cookie/token antes de produção.
    await manager.connect(campaign_id, user_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            if data.get("type") == "ping":
                await websocket.send_json({"type": "pong"})
    except WebSocketDisconnect:
        manager.disconnect(campaign_id, websocket)
