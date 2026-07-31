from datetime import datetime
from typing import Generic, TypeVar

from pydantic import AliasChoices, BaseModel, ConfigDict, Field, field_validator, model_validator


T = TypeVar('T')


class RestResponse(BaseModel, Generic[T]):
    status_code: int = Field(serialization_alias='statusCode')
    error: str | None
    message: str | dict[str, object] | None
    data: T | None


class RegisterRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    username: str = Field(min_length=3, max_length=50)
    email: str = Field(min_length=5, max_length=255)
    password: str = Field(min_length=6, max_length=128)
    confirm_password: str = Field(validation_alias=AliasChoices('confirmPassword', 'confirm_password'))
    terms_agreement: bool = Field(
        validation_alias=AliasChoices('termsAgreement', 'terms_agreement'),
    )

    @field_validator('email')
    @classmethod
    def validate_email(cls, value: str) -> str:
        if '@' not in value or '.' not in value.rsplit('@', 1)[-1]:
            raise ValueError('Invalid email format')
        return value.lower()

    @field_validator('password')
    @classmethod
    def validate_password(cls, value: str) -> str:
        if not any(character.isalpha() for character in value):
            raise ValueError('Password must contain a letter')
        if not any(character.isdigit() for character in value):
            raise ValueError('Password must contain a number')
        return value

    @model_validator(mode='after')
    def validate_confirmation(self) -> 'RegisterRequest':
        if self.password != self.confirm_password:
            raise ValueError('Passwords do not match')
        if not self.terms_agreement:
            raise ValueError('Terms agreement is required')
        return self


class LoginRequest(BaseModel):
    username: str = Field(min_length=1, max_length=50)
    password: str = Field(min_length=1, max_length=128)


class LogoutRequest(BaseModel):
    refresh_token: str = Field(validation_alias=AliasChoices('refreshToken', 'refresh_token'))


class AccessRequest(BaseModel):
    refresh_token: str = Field(validation_alias=AliasChoices('refreshToken', 'refresh_token'))


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: str
    created_at: datetime


class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = 'bearer'
    user: UserResponse


class AccessResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'
