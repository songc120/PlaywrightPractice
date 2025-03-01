# Practice Software Testing - Test Automation Project

This repository contains automated tests using Playwright to practice and showcase Quality Assurance (QA) skills. The tests are written for the practice-software-testing website, implementing the Page Object Model design pattern.

## Project Structure

```bash
├── .github/
│ └── workflows/
│ └── playwright.yml # GitHub Actions workflow configuration
├── components/
│ ├── nav-bar.ts # Navigation bar component
│ ├── banner.ts # Banner component
│ ├── filters.ts # Filters component
│ └── product-container.ts # Product container component
├── pages/
│ ├── home-page.ts # Home page object
│ ├── login-page.ts # Login page object
│ └── product-details-page.ts # Product details page object
├── tests/ # Test files directory
└── utils/
└── constants.ts # Environment variables and constants
```

## Key Components

### GitHub Actions Workflow

- Configured in `.github/workflows/playwright.yml`
- Runs tests automatically on push/PR to main/master branches
- Uses environment secrets for test credentials
- Uploads test reports as artifacts

### Page Objects

1. **HomePage (`pages/home-page.ts`)**

   - Handles navigation to the main page
   - Manages product search and sorting
   - Controls price range filtering
   - Handles category navigation
   - Supports language switching

2. **LoginPage (`pages/login-page.ts`)**

   - Manages user authentication
   - Handles login form interactions
   - Provides error message retrieval

3. **ProductDetailsPage (`pages/product-details-page.ts`)**
   - Manages product details view and interactions (quantity, cart, favorites)

### Components

The project uses reusable components that are shared across different pages:

1. **Navigation Bar (`components/nav-bar.ts`)**

   - Handles top navigation menu interactions
   - Manages language switching
   - Controls user menu options
   - Handles category navigation
   - Manages authentication links (sign in/out)

2. **Banner (`components/banner.ts`)**

   - Manages site banner content and visibility
   - Handles banner interactions and dismissal
   - Controls promotional content display

3. **Filters (`components/filters.ts`)**

   - Manages product filtering operations
   - Handles price range selection
   - Controls sort options
   - Manages search functionality
   - Handles brand filtering
   - Supports category filtering

4. **Product Container (`components/product-container.ts`)**

   - Manages product grid/list display
   - Handles product card interactions
   - Controls product information display
   - Manages product sorting and filtering results
   - Provides product data retrieval methods

5. **Category Filter (`components/category-filter.ts`)**
   - Handles category selection and filtering
   - Manages category checkbox interactions
   - Provides category state verification
   - Controls category-based product filtering

### Utilities

- `constants.ts`: Manages environment variables for different user types:
  - Admin credentials
  - Regular user credentials (User1, User2)
  - Invalid user credentials
  - Non-existent user credentials

## Environment Variables

The following environment variables are required:

- `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- `USER1_EMAIL` / `USER1_PASSWORD`
- `USER2_EMAIL` / `USER2_PASSWORD`
- `NOT_USER_EMAIL` / `NOT_USER_PASSWORD`
- `INVALID_EMAIL` / `INVALID_PASSWORD`

## Test Execution

Tests can be run locally using:

```bash
npx playwright test
```

GitHub Actions will automatically run tests on push/PR to main/master branches.

## Reports

Test reports are automatically generated and stored as artifacts in GitHub Actions, retained for 30 days.
