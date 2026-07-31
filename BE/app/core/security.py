import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any

import jwt

from app.core.config import settings


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 120_000)
    return f'pbkdf2_sha256$120000${salt.hex()}${digest.hex()}'


def verify_password(password: str, password_hash: str) -> bool:
    algorithm, iterations, salt_hex, digest_hex = password_hash.split('$')
    if algorithm != 'pbkdf2_sha256':
        return False
    digest = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode(),
        bytes.fromhex(salt_hex),
        int(iterations),
    )
    return hmac.compare_digest(digest.hex(), digest_hex)


def create_access_token(user_id: int) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {'sub': str(user_id), 'type': 'access', 'exp': expires_at}
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def create_refresh_token(user_id: int) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days)
    payload = {'sub': str(user_id), 'type': 'refresh', 'jti': secrets.token_hex(16), 'exp': expires_at}
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def decode_token(token: str, token_type: str) -> dict[str, Any] | None:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except jwt.InvalidTokenError:
        return None
    if payload.get('type') != token_type or not payload.get('sub'):
        return None
    if token_type == 'refresh' and not payload.get('jti'):
        return None
    return payload


def decode_refresh_token(token: str) -> dict[str, Any] | None:
    return decode_token(token, 'refresh')


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()
