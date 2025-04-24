# API Test Plan

This document outlines the phased plan for implementing API tests for the e-commerce application (`https://api.practicesoftwaretesting.com`).

**Based on OpenAPI Spec v5.0.0**

## Phase 1: Core Authentication & User Management (Foundation - Expanded)

- **Goal:** Ensure users can register, log in, manage profile/addresses, handle passwords, TOTP, sessions, and basic user admin actions.
- **Flows/Tests:**
  - Login: (Existing tests + TOTP verification if enabled)
  - Registration: (Existing tests)
  - User Profile (`/users/me`): (Existing tests for fetch/update)
  - Address Management: (Existing tests - No dedicated endpoints in spec, likely part of user profile update)
  - **NEW:** Password Management (`/users/forgot-password`, `/users/change-password`): Test password reset and change flows.
  - **NEW:** Session Management (`/users/logout`, `/users/refresh`): Test logging out and refreshing tokens.
  - **NEW:** TOTP Management (`/totp/setup`, `/totp/verify`): Test setting up and verifying TOTP.
  - **NEW:** User Listing/Search (`/users`, `/users/search`): Test retrieving user lists and searching (Admin?).
  - **NEW:** Specific User Actions (`/users/{userId}` GET, PUT, PATCH, DELETE): Test fetching, updating, and deleting specific users (Admin?).
- **Files Involved:**
  - `api/auth-api.ts` (Rename/Refactor to `users-api.ts` or split?)
  - `api/users-api.ts` (Expand significantly)
  - `api/totp-api.ts` (New)
  - `tests/api/users.spec.ts` (Expand significantly)
  - `tests/api/auth.spec.ts` (Refocus/Merge?)
  - `tests/api/totp.spec.ts` (New)
- **Dependencies:** None initially, but subsequent phases depend on successful login.

## Phase 2: Product, Category & Brand Management (Expanded)

- **Goal:** Verify browsing, searching, and management of products, categories, and brands.
- **Flows/Tests:**
  - List Products (`/products`): (Existing tests + New params: `by_brand`, `by_category`, `is_rental`, `between`, `sort`, `page`)
  - Search Products (`/products/search`): (Existing tests)
  - Product Details (`/products/{productId}` GET): (Existing tests)
  - **NEW:** Create/Update/Delete Product (`/products` POST, `/products/{productId}` PUT/PATCH/DELETE): Test product lifecycle management (Admin?).
  - **NEW:** Related Products (`/products/{productId}/related` GET): Test fetching related products.
  - List Categories (`/categories` GET, `/categories/tree` GET): (Existing tests + Tree structure)
  - **NEW:** Create/Update/Delete Category (`/categories` POST, `/categories/{categoryId}` PUT/PATCH/DELETE): Test category management (Admin?).
  - **NEW:** Search Categories (`/categories/search` GET): Test searching categories.
  - List Brands (`/brands` GET): (Existing tests)
  - **NEW:** Create/Update/Delete Brand (`/brands` POST, `/brands/{brandId}` PUT/PATCH/DELETE): Test brand management (Admin?).
  - **NEW:** Search Brands (`/brands/search` GET): Test searching brands.
  - **NEW:** List Images (`/images` GET): Test retrieving image list.
- **Files Involved:**
  - `api/products-api.ts` (Expand)
  - `api/categories-api.ts` (New)
  - `api/brands-api.ts` (New)
  - `api/images-api.ts` (New)
  - `tests/api/products.spec.ts` (Expand)
  - `tests/api/categories.spec.ts` (New)
  - `tests/api/brands.spec.ts` (New)
  - `tests/api/images.spec.ts` (New)
- **Dependencies:** Some actions require Admin role (Phase 1).

## Phase 3: Shopping Cart & Favorites Management (Expanded)

- **Goal:** Ensure users can manage cart items and product favorites.
- **Flows/Tests:**
  - **NEW:** Create Cart (`/carts` POST): Test creating a new cart session.
  - Add to Cart (`/carts/{id}` POST): (Existing tests - Note path uses `{id}` not `{cartId}`)
  - View Cart (`/carts/{cartId}` GET): (Existing tests)
  - Update Quantity (`/carts/{cartId}/product/quantity` PUT): (Existing tests)
  - Remove Item (`/carts/{cartId}/product/{productId}` DELETE): (Existing tests)
  - **NEW:** Delete Cart (`/carts/{cartId}` DELETE): Test deleting the entire cart.
  - Cart Persistence: (Existing tests)
  - **NEW:** List Favorites (`/favorites` GET): Test retrieving user's favorites.
  - **NEW:** Add Favorite (`/favorites` POST): Test adding a product to favorites.
  - **NEW:** Get Favorite (`/favorites/{favoriteId}` GET): Test retrieving a specific favorite.
  - **NEW:** Remove Favorite (`/favorites/{favoriteId}` DELETE): Test removing a product from favorites.
- **Files Involved:**
  - `api/cart-api.ts` (Expand/Update paths)
  - `api/favorites-api.ts` (New)
  - `tests/api/cart.spec.ts` (Expand/Update)
  - `tests/api/favorites.spec.ts` (New)
- **Dependencies:** Requires successful user login (Phase 1). Requires product IDs (Phase 2).

## Phase 4: Checkout, Payment & Invoice Workflow (Expanded)

- **Goal:** Validate checkout, payment processing, and invoice generation/retrieval.
- **Flows/Tests:**
  - **NEW:** Payment Check (`/payment/check` POST): Test the standalone payment check endpoint.
  - **NEW:** Create Invoice (`/invoices` POST): Test initiating checkout/creating an invoice (replaces 'Place Order' concept). Requires cart ID, addresses, payment details.
  - **NEW:** List Invoices (`/invoices` GET): Test retrieving invoice history (Admin/User roles).
  - **NEW:** Get Invoice Details (`/invoices/{invoiceId}` GET): Test fetching details for a specific invoice.
  - **NEW:** Update Invoice (`/invoices/{invoiceId}` PUT/PATCH): Test updating invoice details (Admin?).
  - **NEW:** Update Invoice Status (`/invoices/{invoiceId}/status` PUT): Test updating the status of an invoice (Admin?).
  - **NEW:** Search Invoices (`/invoices/search` GET): Test searching invoices (Admin/User roles).
  - **NEW:** Download Invoice PDF (`/invoices/{invoice_number}/download-pdf` GET): Test downloading the PDF.
  - **NEW:** Check PDF Status (`/invoices/{invoice_number}/download-pdf-status` GET): Test checking PDF generation status.
- **Files Involved:**
  - `api/checkout-api.ts` (Remove/Refactor to `invoices-api.ts`?)
  - `api/invoices-api.ts` (New)
  - `api/payment-api.ts` (New)
  - `tests/api/checkout.spec.ts` (Remove/Refactor to `invoices.spec.ts`?)
  - `tests/api/invoices.spec.ts` (New)
  - `tests/api/payment.spec.ts` (New)
- **Dependencies:** Requires login (Phase 1), cart (Phase 3), potentially addresses (Phase 1).

## Phase 5: Contact Messages Management (NEW)

- **Goal:** Verify users and admins can manage contact messages.
- **Flows/Tests:**
  - Send Message (`/messages` POST): Test sending a message (authenticated and unauthenticated).
  - List Messages (`/messages` GET): Test retrieving messages (Admin/User roles).
  - Get Message (`/messages/{messageId}` GET): Test retrieving a specific message.
  - Reply to Message (`/messages/{messageId}/reply` POST): Test replying to a message (Admin?).
  - Update Message Status (`/messages/{messageId}/status` PUT): Test updating message status (Admin?).
  - Attach File (`/messages/{messageId}/attach-file` POST): Test attaching a file to a message.
- **Files Involved:**
  - `api/messages-api.ts` (New)
  - `tests/api/messages.spec.ts` (New)
- **Dependencies:** Some actions require login/Admin role (Phase 1).

## Phase 6: Reporting (NEW - Admin Focus)

- **Goal:** Verify admin users can retrieve various sales and customer reports.
- **Flows/Tests:**
  - All `/reports/*` endpoints (GET):
    - Total Sales Per Country
    - Top 10 Purchased Products
    - Top 10 Best Selling Categories
    - Total Sales of Years (with `years` parameter)
    - Average Sales Per Month (with `year` parameter)
    - Average Sales Per Week (with `year` parameter)
    - Customers By Country
- **Files Involved:**
  - `api/reports-api.ts` (New)
  - `tests/api/reports.spec.ts` (New)
- **Dependencies:** Requires Admin login (Phase 1). Requires sufficient test data (orders, customers).

## Phase 7: Security, Edge Cases & Negative Paths (Expanded)

- **Goal:** Ensure API robustness against invalid inputs, unauthorized access, and errors defined in the spec (`components/responses`).
- **Flows/Tests:**
  - Authorization: (Existing tests + Test role restrictions for Admin endpoints).
  - Input Validation: (Existing tests + Test specific validation rules from spec schemas).
  - **NEW:** Specific Error Responses: Test scenarios that trigger defined 4xx/5xx responses (e.g., `ItemNotFoundResponse`, `UnprocessableEntityResponse`, `ConflictResponse`).
- **Files Involved:** Integrated into all `*.spec.ts` files.
- **Dependencies:** Varies.

## Implementation Notes

- **Documentation:** Add TypeDoc comments to new classes and public methods as they are implemented, following `documentation.mdc`.
- **File Management:** Updates to `PROJECT_STRUCTURE.md` reflecting new files should be tracked.
- **Test Data:** Utilize reliable test data creation strategies (API setup hooks, data factories in `utils/`) and constants from `utils/constants.ts`. Ensure necessary preconditions (e.g., user logged in, product exists) are met for tests.
- **API Helpers:** Create dedicated helper classes in `api/` for each major resource (Brands, Categories, Carts, Favorites, Images, Invoices, Messages, Payment, Products, Reports, TOTP, Users).
- **Authentication:** Manage tokens effectively (login, refresh, logout) for tests requiring auth.
- **Roles:** Implement tests specifically targeting Admin vs User role permissions where applicable.
