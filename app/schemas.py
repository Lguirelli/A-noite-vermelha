from pydantic import BaseModel, Field


class TokenMove(BaseModel):
    x: float
    y: float


class SecretReveal(BaseModel):
    target_user_id: int | None = None


class SceneElementCreate(BaseModel):
    kind: str = "marker"
    label: str = ""
    x: float = 0
    y: float = 0
    data: dict = Field(default_factory=dict)
    visibility_mask: list[str] = Field(default_factory=lambda: ["mundane"])
