from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    hash_password,
    hash_token,
    verify_password,
)
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.repositories import user_repository
from app.schemas.auth import AccessResponse, LoginRequest, LoginResponse, RegisterRequest, UserResponse


class UsernameAlreadyExistsError(Exception):
    pass


class EmailAlreadyExistsError(Exception):
    pass


class InvalidCredentialsError(Exception):
    pass


class InvalidRefreshTokenError(Exception):
    pass


def register_user(db: Session, payload: RegisterRequest) -> User:
    username = payload.username.strip()
    email = payload.email.strip().lower()

    if user_repository.get_by_username(db, username):
        raise UsernameAlreadyExistsError
    if user_repository.get_by_email(db, email):
        raise EmailAlreadyExistsError

    user = User(
        username=username,
        email=email,
        password_hash=hash_password(payload.password),
        terms_agreement=payload.terms_agreement,
    )
    return user_repository.create(db, user)


def login_user(db: Session, payload: LoginRequest) -> LoginResponse:
    user = user_repository.get_by_username(db, payload.username.strip())
    if not user or not user.is_active or not verify_password(payload.password, user.password_hash):
        raise InvalidCredentialsError

    refresh_token = create_refresh_token(user.id)
    token_payload = decode_refresh_token(refresh_token)
    if not token_payload:
        raise InvalidRefreshTokenError
    user_repository.save_refresh_token(
        db,
        RefreshToken(
            user_id=user.id,
            token_hash=hash_token(refresh_token),
            expires_at=datetime.fromtimestamp(token_payload['exp'], timezone.utc).replace(tzinfo=None),
        ),
    )

    return LoginResponse(
        access_token=create_access_token(user.id),
        refresh_token=refresh_token,
        user=UserResponse.model_validate(user),
    )


def logout_user(db: Session, refresh_token: str) -> None:
    if not decode_refresh_token(refresh_token):
        raise InvalidRefreshTokenError
    stored_token = user_repository.get_active_refresh_token(db, hash_token(refresh_token))
    if not stored_token:
        raise InvalidRefreshTokenError
    user_repository.revoke_refresh_token(db, stored_token)


def create_access_from_refresh_token(db: Session, refresh_token: str) -> AccessResponse:
    payload = decode_refresh_token(refresh_token)
    if not payload:
        raise InvalidRefreshTokenError

    stored_token = user_repository.get_active_refresh_token(db, hash_token(refresh_token))
    if not stored_token:
        raise InvalidRefreshTokenError

    user_id = int(payload['sub'])
    user = user_repository.get_by_id(db, user_id)
    if not user or not user.is_active:
        raise InvalidRefreshTokenError
    return AccessResponse(access_token=create_access_token(user.id))
