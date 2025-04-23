# API Test Implementation Tasks

This checklist breaks down the `API_TEST_PLAN.md` into smaller implementation tasks.

## Phase 1: Core Authentication & User Management

- [x] Test: Login with valid admin credentials
- [x] Test: Login with valid regular user credentials
- [x] Test: Login attempt with invalid password
- [x] Test: Login attempt with non-existent user
- [x] Test: Login attempt with invalid email format
- [x] Test: Login attempt with missing email/password fields
- [x] Implement: Registration API helper method (if endpoint exists)
- [x] Test: Successful user registration
- [ ] Test: Registration attempt with duplicate email
- [x] Test: Registration attempt with invalid data (e.g., weak password)
- [x] Implement: User Profile API helper methods (get profile, update profile)
- [x] Implement: Users API tests file (`tests/api/users.spec.ts`)
- [x] Test: Fetch logged-in user's profile
- [ ] Test: Update logged-in user's profile information
- [ ] Implement: Address Management API helper methods (add, get, update, delete addresses)
- [ ] Test: Add a new address for logged-in user
- [ ] Test: View addresses for logged-in user
- [ ] Test: Update an existing address
- [ ] Test: Delete an address

## Phase 2: Product Discovery & Information

- [ ] Implement: Products API helper class (`api/products-api.ts`)
- [ ] Implement: Products tests file (`tests/api/products.spec.ts`)
- [ ] Implement: List Products helper method (inc. pagination/sorting/filtering)
- [ ] Test: Retrieve product list (default)
- [ ] Test: Retrieve product list with pagination
- [ ] Test: Retrieve product list with sorting (if applicable)
- [ ] Test: Retrieve product list with filtering (if applicable)
- [ ] Implement: Search Products helper method
- [ ] Test: Search products with matching term
- [ ] Test: Search products with non-matching term
- [ ] Test: Search products with partial term
- [ ] Implement: Get Product Details helper method
- [ ] Test: Fetch details for a valid product ID
- [ ] Test: Fetch details for an invalid product ID
- [ ] Implement: List Categories/Brands helper methods
- [ ] Test: List available categories
- [ ] Test: List available brands

## Phase 3: Shopping Cart Management

- [ ] Implement: Cart API helper class (`api/cart-api.ts`)
- [ ] Implement: Cart tests file (`tests/api/cart.spec.ts`)
- [ ] Implement: Add to Cart helper method
- [ ] Test: Add a valid product to the cart
- [ ] Test: Add an invalid product ID to the cart
- [ ] Test: Add an out-of-stock product to the cart (if applicable)
- [ ] Test: Add product with quantity > 1 to the cart
- [ ] Implement: View Cart helper method
- [ ] Test: View cart contents (verify items, quantities, subtotals)
- [ ] Implement: Update Quantity helper method
- [ ] Test: Increase item quantity in the cart
- [ ] Test: Decrease item quantity in the cart
- [ ] Test: Set item quantity to 0 (should it remove?)
- [ ] Implement: Remove Item helper method
- [ ] Test: Remove an item from the cart
- [ ] Implement: Clear Cart helper method
- [ ] Test: Clear all items from the cart
- [ ] Test: (Advanced) Verify cart persistence after logout/login

## Phase 4: Checkout Workflow

- [ ] Implement: Checkout API helper class (`api/checkout-api.ts`)
- [ ] Implement: Payment Methods API helper class (`api/payment-methods-api.ts`) (if needed)
- [ ] Implement: Checkout tests file (`tests/api/checkout.spec.ts`)
- [ ] Test: Select shipping address during checkout
- [ ] Test: Select billing address during checkout
- [ ] Test: Add/Select payment method during checkout
- [ ] Test: (Optional) Apply a valid coupon
- [ ] Test: (Optional) Apply an invalid coupon
- [ ] Test: (Optional) Apply an expired coupon
- [ ] Test: Get checkout summary (verify totals, taxes, shipping, discounts)
- [ ] Test: Place order successfully with items in cart
- [ ] Test: Attempt to place order with empty cart

## Phase 5: Post-Order Verification

- [ ] Implement: Orders API helper class (`api/orders-api.ts`)
- [ ] Implement: Orders tests file (`tests/api/orders.spec.ts`)
- [ ] Test: Fetch order history for logged-in user
- [ ] Test: Fetch details for a specific, valid order ID
- [ ] Test: Fetch details for an invalid order ID
- [ ] Test: Verify order details match placed order (items, totals, addresses)
- [ ] Test: (Advanced) Check product inventory decreases after order placement

## Phase 6: Security, Edge Cases & Negative Paths

- [ ] Test: Attempt to access authenticated endpoint (view cart) without login
- [ ] Test: Attempt to access authenticated endpoint (place order) without login
- [ ] Test: Attempt to view another user's order/cart/profile
- [ ] Test: Attempt admin actions as a regular user
- [ ] Test: Send invalid data types in request bodies (e.g., string where number expected)
- [ ] Test: Send requests with missing required fields
- [ ] Test: Send requests with invalid IDs (e.g., non-numeric, negative)
- [ ] Test: Explore boundary values (e.g., quantity 0, max quantity)
- [ ] Test: (Advanced) Concurrency test for purchasing last item (if feasible)

## Ongoing Tasks

- [ ] Add TypeDoc comments for all new classes and public methods
- [ ] Update `PROJECT_STRUCTURE.md` as new files/directories are added (suggest as comment initially)
- [ ] Define and manage test data setup/teardown
