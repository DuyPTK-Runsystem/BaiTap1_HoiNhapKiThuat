# Functional Requirements

There are only three features.

## Register

Fields

- Username
- Email
- Password
- Confirm Password
- Agree Terms checkbox

Validation

Username

- required

Email

- required
- valid email format

Password

- required
- minimum 6 characters
- contains at least one letter
- contains at least one number

Confirm Password

- must equal Password

Terms

- must be checked

Business Rules

Username must be unique.

Email must be unique.

Since there is no backend,
the uniqueness should be checked from Local Storage.

If duplicated:

return

409 Conflict

Error message

"[field] already exists"

After successful register

redirect to Login page.

---

## Login

Fields

- Username
- Password

Validation

Both required.

Business Rules

Username must exist.

Password must match.

If invalid

return

400 Bad Request

Message

"Invalid username or password"

On success

- save current login session
- navigate to Home page

---

## Home

Display

- username
- email

Button

Logout

Logout should

- clear current session
- navigate back to Login

---

## Session

Refresh browser

User should remain logged in.

Use Local Storage.
