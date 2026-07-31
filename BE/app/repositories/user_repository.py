from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.refresh_token import RefreshToken


def get_by_username(db: Session, username: str) -> User | None:
    return db.scalar(select(User).where(User.username == username))


def get_by_email(db: Session, email: str) -> User | None:
    return db.scalar(select(User).where(User.email == email))


def get_by_id(db: Session, user_id: int) -> User | None:
    return db.get(User, user_id)


def create(db: Session, user: User) -> User:
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def save_refresh_token(db: Session, refresh_token: RefreshToken) -> RefreshToken:
    db.add(refresh_token)
    db.commit()
    db.refresh(refresh_token)
    return refresh_token


def get_active_refresh_token(db: Session, token_hash: str) -> RefreshToken | None:
    return db.scalar(
        select(RefreshToken).where(
            RefreshToken.token_hash == token_hash,
            RefreshToken.revoked_at.is_(None),
        ),
    )


def revoke_refresh_token(db: Session, refresh_token: RefreshToken) -> None:
    refresh_token.revoked_at = func.now()
    db.commit()
