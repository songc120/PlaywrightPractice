# Tech Context

**Core Technologies:**

- **Test Runner/Framework:** Playwright (`@playwright/test`)
- **Language:** TypeScript
- **Environment Variables:** `dotenv` package for loading `.env` files.
- **Package Manager:** npm (implied by `package.json` and `package-lock.json`)

**Development Setup:**

- Requires Node.js and npm.
- Install dependencies with `npm install`.
- Run tests using `npx playwright test [path/to/test/file]`.
- Configure environment variables (API URLs, credentials) in a `.env` file at the project root.

**Dependencies:**

- `@playwright/test`: Core testing library.
- `typescript`: Language support.
- `dotenv`: Environment variable management.
- (Check `package.json` for a full list).

**Constraints:**

- Tests rely on the availability and state of the target API (`https://api.practicesoftwaretesting.com`).
- Credentials and potentially other sensitive data should be managed via `.env` and not committed to source control.
