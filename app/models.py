from __future__ import annotations
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Text, Integer, Float, Boolean, DateTime, ForeignKey, JSON, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import Base


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    role: Mapped[str] = mapped_column(String(20), default="player")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class Campaign(Base):
    __tablename__ = "campaigns"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(160), default="A Noite Vermelha")
    description: Mapped[str] = mapped_column(Text, default="")
    active_scene_id: Mapped[Optional[int]] = mapped_column(nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class CampaignMember(Base):
    __tablename__ = "campaign_members"
    __table_args__ = (UniqueConstraint("campaign_id", "user_id"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    campaign_id: Mapped[int] = mapped_column(ForeignKey("campaigns.id", ondelete="CASCADE"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    is_gm: Mapped[bool] = mapped_column(Boolean, default=False)


class Character(Base):
    __tablename__ = "characters"
    id: Mapped[int] = mapped_column(primary_key=True)
    campaign_id: Mapped[int] = mapped_column(ForeignKey("campaigns.id", ondelete="CASCADE"))
    owner_user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    name: Mapped[str] = mapped_column(String(120))
    archetype: Mapped[str] = mapped_column(String(120), default="")
    hp: Mapped[int] = mapped_column(Integer, default=10)
    hp_max: Mapped[int] = mapped_column(Integer, default=10)
    portrait_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    perception_mask: Mapped[list] = mapped_column(JSON, default=lambda: ["mundane"])
    public_notes: Mapped[str] = mapped_column(Text, default="")
    player_notes: Mapped[str] = mapped_column(Text, default="")
    gm_notes: Mapped[str] = mapped_column(Text, default="")


class Scene(Base):
    __tablename__ = "scenes"
    id: Mapped[int] = mapped_column(primary_key=True)
    campaign_id: Mapped[int] = mapped_column(ForeignKey("campaigns.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(160))
    map_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    width: Mapped[int] = mapped_column(Integer, default=1920)
    height: Mapped[int] = mapped_column(Integer, default=1080)
    grid_size: Mapped[int] = mapped_column(Integer, default=70)
    gm_notes: Mapped[str] = mapped_column(Text, default="")


class SceneElement(Base):
    __tablename__ = "scene_elements"
    id: Mapped[int] = mapped_column(primary_key=True)
    scene_id: Mapped[int] = mapped_column(ForeignKey("scenes.id", ondelete="CASCADE"))
    kind: Mapped[str] = mapped_column(String(40), default="marker")
    label: Mapped[str] = mapped_column(String(160), default="")
    x: Mapped[float] = mapped_column(Float, default=0)
    y: Mapped[float] = mapped_column(Float, default=0)
    data: Mapped[dict] = mapped_column(JSON, default=dict)
    visibility_mask: Mapped[list] = mapped_column(JSON, default=lambda: ["mundane"])
    revealed: Mapped[bool] = mapped_column(Boolean, default=True)


class Token(Base):
    __tablename__ = "tokens"
    id: Mapped[int] = mapped_column(primary_key=True)
    scene_id: Mapped[int] = mapped_column(ForeignKey("scenes.id", ondelete="CASCADE"))
    character_id: Mapped[Optional[int]] = mapped_column(ForeignKey("characters.id", ondelete="SET NULL"), nullable=True)
    controller_user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    name: Mapped[str] = mapped_column(String(120))
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    x: Mapped[float] = mapped_column(Float, default=0)
    y: Mapped[float] = mapped_column(Float, default=0)
    size: Mapped[float] = mapped_column(Float, default=1.0)
    visible_to_all: Mapped[bool] = mapped_column(Boolean, default=True)


class Secret(Base):
    __tablename__ = "secrets"
    id: Mapped[int] = mapped_column(primary_key=True)
    campaign_id: Mapped[int] = mapped_column(ForeignKey("campaigns.id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(String(160))
    body: Mapped[str] = mapped_column(Text)
    target_user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    target_character_id: Mapped[Optional[int]] = mapped_column(ForeignKey("characters.id", ondelete="CASCADE"), nullable=True)
    is_revealed: Mapped[bool] = mapped_column(Boolean, default=False)
    revealed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
