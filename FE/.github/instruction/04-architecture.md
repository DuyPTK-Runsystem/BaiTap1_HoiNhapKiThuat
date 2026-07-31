# Architecture

Please use Feature-based architecture.

src/

components/

features/

auth/

components/

pages/

services/

hooks/

schemas/

types/

context/

layouts/

router/

utils/

constants/

storage/

tests/

Requirements

Every feature should be separated.

Do NOT place all code inside App.tsx.

Business logic should stay inside services.

Validation should stay inside schemas.

UI components should remain as dumb as possible.
