from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.auth import (
    AccessRequest,
    AccessResponse,
    LoginRequest,
    LoginResponse,
    LogoutRequest,
    RegisterRequest,
    RestResponse,
    UserResponse,
)
from app.services.auth_service import (
    EmailAlreadyExistsError,
    InvalidCredentialsError,
    InvalidRefreshTokenError,
    UsernameAlreadyExistsError,
    create_access_from_refresh_token,
    login_user,
    logout_user,
    register_user,
)


router = APIRouter(prefix='/auth', tags=['Authentication'])


@router.post('/register', response_model=RestResponse[UserResponse], status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> RestResponse[UserResponse] | JSONResponse:
    try:
        user = register_user(db, payload)
        return RestResponse(
            status_code=201,
            error=None,
            message='Register successfully',
            data=user,
        )
    except UsernameAlreadyExistsError:
        return JSONResponse(
            status_code=409,
            content=RestResponse(
                status_code=409,
                error='Conflict',
                message='Username already exists',
                data=None,
            ).model_dump(by_alias=True),
        )
    except EmailAlreadyExistsError:
        return JSONResponse(
            status_code=409,
            content=RestResponse(
                status_code=409,
                error='Conflict',
                message='Email already exists',
                data=None,
            ).model_dump(by_alias=True),
        )
    except IntegrityError:
        db.rollback()
        return JSONResponse(
            status_code=409,
            content=RestResponse(
                status_code=409,
                error='Conflict',
                message='Username or email already exists',
                data=None,
            ).model_dump(by_alias=True),
        )


@router.post('/login', response_model=RestResponse[LoginResponse])
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> RestResponse[LoginResponse] | JSONResponse:
    try:
        return RestResponse(
            status_code=200,
            error=None,
            message='Login successfully',
            data=login_user(db, payload),
        )
    except InvalidCredentialsError:
        return JSONResponse(
            status_code=400,
            content=RestResponse(
                status_code=400,
                error='Bad Request',
                message='Invalid username or password',
                data=None,
            ).model_dump(by_alias=True),
        )


@router.post('/logout', response_model=RestResponse[None])
def logout(payload: LogoutRequest, db: Session = Depends(get_db)) -> RestResponse[None] | JSONResponse:
    try:
        logout_user(db, payload.refresh_token)
        return RestResponse(
            status_code=200,
            error=None,
            message='Logout successfully',
            data=None,
        )
    except InvalidRefreshTokenError:
        return JSONResponse(
            status_code=401,
            content=RestResponse(
                status_code=401,
                error='Unauthorized',
                message='Invalid or revoked refresh token',
                data=None,
            ).model_dump(by_alias=True),
        )


@router.get('/me', response_model=RestResponse[UserResponse])
def me(current_user: User = Depends(get_current_user)) -> RestResponse[UserResponse]:
    return RestResponse(
        status_code=200,
        error=None,
        message='Get current user successfully',
        data=current_user,
    )


@router.post('/access', response_model=RestResponse[AccessResponse])
def access(payload: AccessRequest, db: Session = Depends(get_db)) -> RestResponse[AccessResponse] | JSONResponse:
    try:
        return RestResponse(
            status_code=200,
            error=None,
            message='Access token refreshed successfully',
            data=create_access_from_refresh_token(db, payload.refresh_token),
        )
    except (InvalidRefreshTokenError, ValueError):
        return JSONResponse(
            status_code=401,
            content=RestResponse(
                status_code=401,
                error='Unauthorized',
                message='Invalid or revoked refresh token',
                data=None,
            ).model_dump(by_alias=True),
        )
