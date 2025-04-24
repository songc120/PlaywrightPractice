# API Test Implementation Tasks (Based on OpenAPI v5.0.0)

## Implementation Plan Summary (PLAN Mode Output)

- **Approach:** Implement tests following the 7-phase structure defined in `API_TEST_PLAN.md`.
- **Priority:** Begin with **Phase 1: Core Authentication & User Management** as it's foundational.
- **Workflow:** For each feature/phase: 1. Implement API helper methods (`api/*.ts`). 2. Write corresponding tests (`tests/api/*.spec.ts`). 3. Add TypeDoc documentation.
- **Challenges & Mitigations:**
  - **Auth Tokens:** Use Playwright contexts (`request.newContext()`) or hooks (`beforeAll`/`beforeEach`) with helper functions to manage authentication for different user roles (Admin, User).
  - **Test Data:** Use API calls in `beforeEach`/`afterEach` or dedicated helper functions for dynamic test data setup/cleanup (e.g., `createTestProduct`, `placeTestOrder`). Use `utils/constants.ts` for static data.
  - **Roles:** Test role-specific access using separate authenticated contexts.
  - **Dependencies:** Follow the phased plan strictly, using earlier phase APIs for later phase data setup.
- **Creative Phase:** Not required for this implementation.
- **Next Mode:** IMPLEMENT

---

This checklist breaks down the revised `API_TEST_PLAN.md` into smaller implementation tasks.

## Phase 1: Core Authentication & User Management

- [x] Test: Login with valid admin credentials
- [x] Test: Login with valid regular user credentials
- [x] Test: Login attempt with invalid password
- [x] Test: Login attempt with non-existent user
- [x] Test: Login attempt with invalid email format
- [x] Test: Login attempt with missing email/password fields
- [x] Implement: Registration API helper method (`/users/register` POST)
- [x] Test: Successful user registration
- [ ] Test: Registration attempt with duplicate email
- [x] Test: Registration attempt with invalid data (e.g., weak password, invalid DOB format)
- [x] Implement: User Profile API helper methods (`/users/me` GET, `/users/{userId}` PUT/PATCH - need to clarify if `/users/me` can be updated or only `/users/{userId}`)
- [x] Implement: Users API tests file (`tests/api/users.spec.ts`)
- [x] Test: Fetch logged-in user's profile (`/users/me`)
- [ ] Test: Update logged-in user's profile information (Using `/users/{userId}` PUT/PATCH? Needs clarification)
- [ ] Implement: Address Management (Confirm how addresses are managed - part of User object?)
  - [ ] Test: Add/Update address info via User update
  - [ ] Test: Verify address info in User response
- **NEW Tasks:**
  - [ ] Implement: Password Management helpers (`/users/forgot-password` POST, `/users/change-password` POST)
  - [ ] Test: Request password reset (`/users/forgot-password`)
  - [ ] Test: Change password successfully (`/users/change-password`)
  - [ ] Test: Change password with incorrect current password
  - [ ] Test: Change password with non-matching new passwords
  - [ ] Implement: Session Management helpers (`/users/logout` GET, `/users/refresh` GET)
  - [ ] Test: Logout user (`/users/logout`) & verify token invalidation
  - [ ] Test: Refresh token (`/users/refresh`) & verify new token validity
  - [ ] Implement: TOTP helpers (`/totp/setup` POST, `/totp/verify` POST) (`api/totp-api.ts`)
  - [ ] Implement: TOTP tests file (`tests/api/totp.spec.ts`)
  - [ ] Test: Setup TOTP successfully (`/totp/setup`)
  - [ ] Test: Attempt TOTP setup when already enabled
  - [ ] Test: Verify TOTP code successfully (`/totp/verify`)
  - [ ] Test: Verify TOTP with invalid code
  - [ ] Implement: User Listing/Search helpers (`/users` GET, `/users/search` GET)
  - [ ] Test: List all users (Admin) (`/users`)
  - [ ] Test: List users with pagination (Admin)
  - [ ] Test: Search users by name/city (Admin) (`/users/search`)
  - [ ] Implement: Specific User Action helpers (`/users/{userId}` GET, PUT, PATCH, DELETE)
  - [ ] Test: Get specific user details (Admin) (`/users/{userId}` GET)
  - [ ] Test: Update specific user (Admin) (`/users/{userId}` PUT/PATCH)
  - [ ] Test: Delete specific user (Admin) (`/users/{userId}` DELETE)
  - [ ] Test: Attempt User Admin actions as regular user (should fail)

## Phase 2: Product, Category & Brand Management

- [ ] Implement: Products API helper class (`api/products-api.ts`) (Expand)
- [ ] Implement: Products tests file (`tests/api/products.spec.ts`) (Expand)
- [ ] Implement: List Products helper method (Expand with new params: `by_brand`, `by_category`, `is_rental`, `between`, `sort`, `page`)
- [ ] Test: Retrieve product list (default)
- [ ] Test: Retrieve product list with pagination (`page`)
- [ ] Test: Retrieve product list sorted (`sort`)
- [ ] Test: Retrieve product list filtered by brand/category/rental/price (`by_brand`, `by_category`, `is_rental`, `between`)
- [ ] Implement: Search Products helper method (`/products/search` GET)
- [ ] Test: Search products with matching term
- [ ] Test: Search products with non-matching term
- [ ] Test: Search products with partial term
- [ ] Implement: Get Product Details helper method (`/products/{productId}` GET)
- [ ] Test: Fetch details for a valid product ID
- [ ] Test: Fetch details for an invalid product ID
- **NEW Tasks:**
  - [ ] Implement: Product CRUD helpers (`/products` POST, `/products/{productId}` PUT/PATCH/DELETE)
  - [ ] Test: Create a new product (Admin?)
  - [ ] Test: Create product with invalid data
  - [ ] Test: Update an existing product (Admin?)
  - [ ] Test: Partially update (patch) an existing product (Admin?)
  - [ ] Test: Delete a product (Admin?)
  - [ ] Test: Attempt Product CRUD as regular user
  - [ ] Implement: Related Products helper (`/products/{productId}/related` GET)
  - [ ] Test: Get related products for a valid product ID
  - [ ] Implement: Categories API helper class (`api/categories-api.ts`)
  - [ ] Implement: Categories tests file (`tests/api/categories.spec.ts`)
  - [ ] Implement: List Categories helpers (`/categories` GET, `/categories/tree` GET)
  - [ ] Test: List available categories (flat list)
  - [ ] Test: List available categories (tree structure)
  - [ ] Test: List category tree by parent slug (`by_category_slug`)
  - [ ] Implement: Category CRUD helpers (`/categories` POST, `/categories/{categoryId}` GET (tree), PUT/PATCH/DELETE)
  - [ ] Test: Create a new category (Admin?)
  - [ ] Test: Get specific category tree (`/categories/tree/{categoryId}`)
  - [ ] Test: Update a category (Admin?)
  - [ ] Test: Partially update (patch) a category (Admin?)
  - [ ] Test: Delete a category (Admin?)
  - [ ] Implement: Search Categories helper (`/categories/search` GET)
  - [ ] Test: Search categories by name
  - [ ] Implement: Brands API helper class (`api/brands-api.ts`)
  - [ ] Implement: Brands tests file (`tests/api/brands.spec.ts`)
  - [ ] Implement: List Brands helper (`/brands` GET)
  - [ ] Test: List available brands
  - [ ] Implement: Brand CRUD helpers (`/brands` POST, `/brands/{brandId}` GET, PUT/PATCH/DELETE)
  - [ ] Test: Create a new brand (Admin?)
  - [ ] Test: Get specific brand (`/brands/{brandId}`)
  - [ ] Test: Update a brand (Admin?)
  - [ ] Test: Partially update (patch) a brand (Admin?)
  - [ ] Test: Delete a brand (Admin?)
  - [ ] Implement: Search Brands helper (`/brands/search` GET)
  - [ ] Test: Search brands by name
  - [ ] Implement: Images API helper class (`api/images-api.ts`)
  - [ ] Implement: Images tests file (`tests/api/images.spec.ts`)
  - [ ] Implement: List Images helper (`/images` GET)
  - [ ] Test: List available images

## Phase 3: Shopping Cart & Favorites Management

- [ ] Implement: Cart API helper class (`api/cart-api.ts`) (Update/Expand)
- [ ] Implement: Cart tests file (`tests/api/cart.spec.ts`) (Update/Expand)
- **NEW Tasks:**
  - [ ] Implement: Create Cart helper (`/carts` POST)
  - [ ] Test: Create a new cart and get cart ID
- [ ] Implement: Add to Cart helper method (`/carts/{id}` POST - Update path)
- [ ] Test: Add a valid product to the cart (using created cart ID)
- [ ] Test: Add an invalid product ID to the cart
- [ ] Test: Add an out-of-stock product to the cart (if applicable)
- [ ] Test: Add product with quantity > 1 to the cart
- [ ] Implement: View Cart helper method (`/carts/{cartId}` GET - Update path)
- [ ] Test: View cart contents (verify items, quantities, subtotals)
- [ ] Implement: Update Quantity helper method (`/carts/{cartId}/product/quantity` PUT - Update path)
- [ ] Test: Increase item quantity in the cart
- [ ] Test: Decrease item quantity in the cart
- [ ] Test: Set item quantity to 0 (verify behavior - remove or error?)
- [ ] Implement: Remove Item helper method (`/carts/{cartId}/product/{productId}` DELETE - Update path)
- [ ] Test: Remove an item from the cart
- **NEW Tasks:**
  - [ ] Implement: Delete Cart helper (`/carts/{cartId}` DELETE - Update path)
  - [ ] Test: Delete a cart with items
  - [ ] Test: Delete an empty cart
  - [ ] Test: Delete a non-existent cart
- [ ] Test: (Advanced) Verify cart persistence after logout/login (if applicable with cart IDs)
- **NEW Tasks:**
  - [ ] Implement: Favorites API helper class (`api/favorites-api.ts`)
  - [ ] Implement: Favorites tests file (`tests/api/favorites.spec.ts`)
  - [ ] Implement: List Favorites helper (`/favorites` GET)
  - [ ] Test: List favorites for logged-in user (empty and with items)
  - [ ] Implement: Add Favorite helper (`/favorites` POST)
  - [ ] Test: Add a valid product to favorites
  - [ ] Test: Add an invalid product ID to favorites
  - [ ] Test: Add a product already in favorites
  - [ ] Implement: Get Favorite helper (`/favorites/{favoriteId}` GET)
  - [ ] Test: Get details of a specific favorite
  - [ ] Test: Get details of non-existent favorite
  - [ ] Implement: Remove Favorite helper (`/favorites/{favoriteId}` DELETE)
  - [ ] Test: Remove an existing favorite
  - [ ] Test: Remove a non-existent favorite
  - [ ] Test: Attempt favorite actions without login

## Phase 4: Checkout, Payment & Invoice Workflow

- **NEW Tasks:**
  - [ ] Implement: Payment API helper class (`api/payment-api.ts`)
  - [ ] Implement: Payment tests file (`tests/api/payment.spec.ts`)
  - [ ] Implement: Payment Check helper (`/payment/check` POST)
  - [ ] Test: Check payment with valid details (various methods)
  - [ ] Test: Check payment with invalid details
  - [ ] Implement: Invoices API helper class (`api/invoices-api.ts`)
  - [ ] Implement: Invoices tests file (`tests/api/invoices.spec.ts`)
  - [ ] Implement: Create Invoice helper (`/invoices` POST)
  - [ ] Test: Create invoice successfully from cart (requires cart ID, address, payment)
  - [ ] Test: Create invoice with invalid cart ID
  - [ ] Test: Create invoice with invalid payment details
  - [ ] Implement: List Invoices helper (`/invoices` GET)
  - [ ] Test: List invoices for logged-in user
  - [ ] Test: List invoices for admin user
  - [ ] Test: List invoices with pagination
  - [ ] Implement: Get Invoice Details helper (`/invoices/{invoiceId}` GET)
  - [ ] Test: Get details for a valid invoice ID (own invoice)
  - [ ] Test: Get details for another user's invoice (should fail for user, pass for admin?)
  - [ ] Implement: Update Invoice helper (`/invoices/{invoiceId}` PUT/PATCH)
  - [ ] Test: Update invoice details (Admin?)
  - [ ] Test: Partially update (patch) invoice details (Admin?)
  - [ ] Implement: Update Invoice Status helper (`/invoices/{invoiceId}/status` PUT)
  - [ ] Test: Update invoice status (Admin?) - Cycle through statuses
  - [ ] Test: Update invoice status with invalid status value
  - [ ] Implement: Search Invoices helper (`/invoices/search` GET)
  - [ ] Test: Search invoices by number/status/billing street (User/Admin)
  - [ ] Implement: Download Invoice PDF helper (`/invoices/{invoice_number}/download-pdf` GET)
  - [ ] Test: Download PDF for a valid invoice number
  - [ ] Implement: Check PDF Status helper (`/invoices/{invoice_number}/download-pdf-status` GET)
  - [ ] Test: Check PDF status for an invoice

## Phase 5: Contact Messages Management (NEW)

- **NEW Tasks:**
  - [ ] Implement: Messages API helper class (`api/messages-api.ts`)
  - [ ] Implement: Messages tests file (`tests/api/messages.spec.ts`)
  - [ ] Implement: Send Message helper (`/messages` POST)
  - [ ] Test: Send message as logged-in user
  - [ ] Test: Send message as guest (no auth)
  - [ ] Test: Send message with missing required fields
  - [ ] Implement: List Messages helper (`/messages` GET)
  - [ ] Test: List messages for logged-in user (own messages)
  - [ ] Test: List messages for admin (all messages?)
  - [ ] Test: List messages with pagination
  - [ ] Implement: Get Message helper (`/messages/{messageId}` GET)
  - [ ] Test: Get specific message details (own message for user, any for admin?)
  - [ ] Implement: Reply to Message helper (`/messages/{messageId}/reply` POST)
  - [ ] Test: Reply to a message (Admin?)
  - [ ] Implement: Update Message Status helper (`/messages/{messageId}/status` PUT)
  - [ ] Test: Update message status (Admin?) - Cycle through statuses
  - [ ] Implement: Attach File helper (`/messages/{messageId}/attach-file` POST)
  - [ ] Test: Attach a valid file to a message
  - [ ] Test: Attach an invalid file type/size

## Phase 6: Reporting (NEW - Admin Focus)

- **NEW Tasks:**
  - [ ] Implement: Reports API helper class (`api/reports-api.ts`)
  - [ ] Implement: Reports tests file (`tests/api/reports.spec.ts`)
  - [ ] Implement/Test: Get Total Sales Per Country (`/reports/total-sales-per-country` GET)
  - [ ] Implement/Test: Get Top 10 Purchased Products (`/reports/top10-purchased-products` GET)
  - [ ] Implement/Test: Get Top 10 Best Selling Categories (`/reports/top10-best-selling-categories` GET)
  - [ ] Implement/Test: Get Total Sales of Years (`/reports/total-sales-of-years` GET, test `years` param)
  - [ ] Implement/Test: Get Average Sales Per Month (`/reports/average-sales-per-month` GET, test `year` param)
  - [ ] Implement/Test: Get Average Sales Per Week (`/reports/average-sales-per-week` GET, test `year` param)
  - [ ] Implement/Test: Get Customers By Country (`/reports/customers-by-country` GET)
  - [ ] Test: Attempt to access reports as regular user (should fail)

## Phase 7: Security, Edge Cases & Negative Paths

- [ ] Test: Attempt to access authenticated endpoint without login (cover all new endpoints)
- [ ] Test: Attempt to access other user's data (cover all new resources: invoices, messages, favorites)
- [ ] Test: Attempt admin actions as a regular user (cover all new resources: user mgmt, product/cat/brand CRUD, invoice status, message status/reply, reports)
- [ ] Test: Send invalid data types in request bodies (check schemas for all new POST/PUT/PATCH)
- [ ] Test: Send requests with missing required fields (check required fields for all new POST/PUT/PATCH)
- [ ] Test: Send requests with invalid IDs (formats, non-existent)
- [ ] Test: Explore boundary values (check ranges, enums for status fields etc.)
- [ ] Test: Verify specific error responses from spec (`ItemNotFoundResponse`, `UnprocessableEntityResponse`, `ConflictResponse`, etc.) for relevant endpoints.

## Ongoing Tasks

- [ ] Add TypeDoc comments for all new classes and public methods (`documentation.mdc`)
- [ ] Update `PROJECT_STRUCTURE.md` as new files/directories are added (suggest as comment initially - `file-management.mdc`)
- [ ] Define and manage test data setup/teardown (crucial for reports, admin actions)
- [ ] Refactor/Organize `api/` helpers and `tests/api/` specs based on new structure.
