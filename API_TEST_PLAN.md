# API Test Plan

This document outlines the phased plan for implementing API tests for the e-commerce application (`https://api.practicesoftwaretesting.com`).

## Phase 1: Core Authentication & User Management (Foundation)

- **Goal:** Ensure users can register, log in, and manage their basic profile information and addresses. This is crucial as most other actions require an authenticated user.
- **Flows/Tests:**
  - Login: Complete tests for various scenarios (valid admin, valid regular user, invalid credentials, non-existent user, invalid email format).
  - Registration: Test creating new users (successful, duplicate email, invalid data).
  - User Profile: Test fetching the logged-in user's profile, updating profile information.
  - Address Management: Test adding, viewing, updating, and deleting user addresses (needed for checkout).
- **Files Involved:**
  - `api/auth-api.ts`
  - `api/users-api.ts` (New)
  - `tests/api/auth.spec.ts` (Expand)
  - `tests/api/users.spec.ts` (New)
- **Dependencies:** None initially, but subsequent phases depend on successful login.

## Phase 2: Product Discovery & Information

- **Goal:** Verify users can browse, search, and view details about products, categories, and brands.
- **Flows/Tests:**
  - List Products: Test retrieving the product list, including pagination, sorting, and filtering (if API supports it).
  - Search Products: Test searching with various terms (matching, non-matching, partial).
  - Product Details: Test fetching details for specific valid and invalid product IDs.
  - Categories/Brands: Test listing available categories and brands.
- **Files Involved:**
  - `api/products-api.ts` (New)
  - `tests/api/products.spec.ts` (New)
- **Dependencies:** Generally none, but some specific product tests might require setup.

## Phase 3: Shopping Cart Management

- **Goal:** Ensure users can add, view, modify, and remove items from their shopping cart accurately.
- **Flows/Tests:**
  - Add to Cart: Test adding various products (valid, invalid ID, out of stock?), different quantities.
  - View Cart: Verify cart contents, item details, quantities, and subtotals.
  - Update Quantity: Test increasing/decreasing item quantities in the cart.
  - Remove Item: Test removing specific items from the cart.
  - Clear Cart: Test emptying the cart.
  - Cart Persistence: (Optional advanced) Check if cart contents persist after logout/login.
- **Files Involved:**
  - `api/cart-api.ts` (New)
  - `tests/api/cart.spec.ts` (New)
- **Dependencies:** Requires successful user login (Phase 1). Requires product IDs (Phase 2).

## Phase 4: Checkout Workflow

- **Goal:** Validate the entire process from initiating checkout to placing an order, including address/payment selection and calculations. This is a critical multi-step flow.
- **Flows/Tests:**
  - Select Address: Test selecting shipping/billing addresses (using addresses created in Phase 1).
  - Select Payment: Test adding/selecting payment methods. (Might require mocking or test card details from `constants.ts`).
  - (Optional) Apply Coupon: Test applying valid, invalid, and expired coupons.
  - Get Checkout Summary: Verify order totals, taxes, shipping costs, and applied discounts _before_ placing the order.
  - Place Order: Test the final order submission with various cart contents and configurations. Check response for success confirmation and order ID.
- **Files Involved:**
  - `api/checkout-api.ts` (New)
  - `api/payment-methods-api.ts` (New: If payment methods are managed separately)
  - `tests/api/checkout.spec.ts` (New: Will orchestrate multi-step tests)
- **Dependencies:** Requires login (Phase 1), products (Phase 2), items in cart (Phase 3), addresses (Phase 1), payment methods.

## Phase 5: Post-Order Verification

- **Goal:** Confirm that orders are recorded correctly and related data (like inventory) is updated.
- **Flows/Tests:**
  - Order History: Test fetching the list of orders for a logged-in user.
  - Order Details: Test retrieving details of a specific order placed in Phase 4. Verify items, totals, addresses match.
  - (Advanced) Inventory Check: Test fetching product details (from Phase 2) _before_ and _after_ placing an order to verify stock levels decrease appropriately.
- **Files Involved:**
  - `api/orders-api.ts` (New)
  - `tests/api/orders.spec.ts` (New)
  - Might reuse `api/products-api.ts` for inventory checks.
- **Dependencies:** Requires placed orders (Phase 4).

## Phase 6: Security, Edge Cases & Negative Paths

- **Goal:** Ensure the API is robust against invalid inputs and unauthorized access. These tests should be integrated throughout the phases but also explicitly covered.
- **Flows/Tests:**
  - Authorization: Attempt accessing resources without logging in (e.g., view cart, place order). Attempt accessing other users' data (e.g., view another user's order). Attempt admin actions as a regular user.
  - Input Validation: Send requests with invalid data types, missing fields, invalid IDs, boundary values (e.g., negative quantity).
  - Concurrency: (More advanced) Simulate scenarios like multiple attempts to buy the last item.
- **Files Involved:** Integrated into existing test files (`*.spec.ts`) or potentially dedicated files like `tests/api/security.spec.ts`.
- **Dependencies:** Varies based on the specific test.

## Implementation Notes

- **Documentation:** Add TypeDoc comments to new classes and public methods as they are implemented, following `documentation.mdc`.
- **File Management:** Updates to `PROJECT_STRUCTURE.md` reflecting new files should be tracked.
- **Test Data:** Utilize reliable test data creation strategies (API setup hooks, data factories in `utils/`) and constants from `utils/constants.ts`. Ensure necessary preconditions (e.g., user logged in, product exists) are met for tests.
