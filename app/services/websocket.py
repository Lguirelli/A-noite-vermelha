from collections import defaultdict
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.connections: dict[int, list[tuple[int, WebSocket]]] = defaultdict(list)

    async def connect(self, campaign_id: int, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self.connections[campaign_id].append((user_id, websocket))

    def disconnect(self, campaign_id: int, websocket: WebSocket):
        self.connections[campaign_id] = [(uid, ws) for uid, ws in self.connections[campaign_id] if ws is not websocket]

    async def broadcast(self, campaign_id: int, payload: dict):
        dead = []
        for _, ws in self.connections[campaign_id]:
            try:
                await ws.send_json(payload)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(campaign_id, ws)

    async def send_user(self, campaign_id: int, user_id: int, payload: dict):
        for uid, ws in self.connections[campaign_id]:
            if uid == user_id:
                await ws.send_json(payload)


manager = ConnectionManager()
