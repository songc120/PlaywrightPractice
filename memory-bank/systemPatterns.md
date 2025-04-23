# System Patterns

**API Test Structure:**

- **API Helper Classes (`api/`):** Encapsulate logic for interacting with specific groups of API endpoints (e.g., `AuthAPI`, `ProductsAPI`). These classes use `APIRequestContext` and return `APIResponse` objects without performing assertions.
- **Test Files (`tests/api/`):** Contain Playwright `test` blocks that utilize the API helper classes to perform actions and `expect` assertions to validate responses and system state.
- **Utilities (`utils/`):** Store shared resources like constants (`constants.ts`), test data factories, or potentially shared setup/teardown logic not handled by Playwright fixtures.

**Key Decisions:**

- Separation of Concerns: API interaction logic is kept separate from test assertion logic.
- Readability: Tests focus on the scenario steps and assertions, delegating API call details to helper classes.
- Maintainability: Changes to specific API endpoints primarily affect the corresponding helper class.
- Configuration: Use `.env` file and `utils/constants.ts` for managing environment-specific details like base URLs and credentials.
