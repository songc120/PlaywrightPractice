# Test Plan - Practice Software Testing

This document outlines the test scenarios and test cases for the Practice Software Testing website automation project.

## 1. Authentication Tests

### Login Functionality

- **Valid Login Scenarios**

  - Login with valid admin credentials
  - Login with valid user credentials (User1, User2)
  - Verify successful login redirects

- **Invalid Login Scenarios**
  - Login with non-existent user credentials
  - Login with invalid email format
  - Login with invalid password
  - Login with empty credentials
  - Verify appropriate error messages

## 2. Home Page Functionality

### Navigation

- Verify successful navigation to home page
- Verify all main components are present:
  - Navigation bar
  - Banner
  - Filters
  - Product container

### Product Search and Sorting

- **Search Functionality**

  - Search for existing products
  - Search with partial product names
  - Search with non-existent products

- **Sorting Options**
  - Sort by name (ascending)
  - Sort by name (descending)
  - Sort by price (ascending)
  - Sort by price (descending)

### Price Filtering

- Filter products by:
  - Minimum price
  - Maximum price
  - Price range
- Verify filtered results are within specified range

### Category Navigation

- Navigate to and verify content for each category:
  - Hand Tools
  - Power Tools
  - Special Tools
  - Rentals
  - Other

### Language Support

- Verify language switching functionality:
  - German (de)
  - English (en)
  - Spanish (es)
  - French (fr)
  - Dutch (nl)
  - Turkish (tr)
- Verify content translation for each language

## 3. Component-Specific Tests

### Navigation Bar

- Verify all navigation links
- Test categories dropdown
- Test language selector
- Verify sign-in/sign-out functionality

### Banner

- Verify banner content and visibility
- Test any banner interactions/links

### Filters

- Test search input functionality
- Verify sort dropdown options
- Test price range filter inputs
- Verify filter reset functionality

### Product Container

- Verify product display
- Test product grid/list views (if applicable)
- Verify product information display
- Test product interaction (clicking, hovering)

## 4. Checkout Process Tests

### Cart Management Tests

- **Cart Item Display**

  - Verify correct product name, price, quantity display
  - Verify line total calculation
  - Verify cart total calculation
  - Verify multiple items display correctly

- **Quantity Updates**

  - Update quantity through direct input
  - Verify quantity validation (min 1, max 99)
  - Verify line total updates after quantity change
  - Verify cart total updates after quantity change

- **Item Removal**
  - Remove single item from cart
  - Verify cart total updates after removal
  - Verify item count updates in cart
  - Handle removing last item in cart

### Checkout Flow Tests

- **Step Navigation**

  - Verify correct step sequence (Cart -> Login -> Billing -> Payment)
  - Verify step indicators update correctly
  - Verify navigation between steps
  - Verify step completion status

- **Login Integration**
  - Verify redirect to login for guest users
  - Handle already logged-in users
  - Verify successful login proceeds to billing
  - Handle login errors appropriately

### Billing Address Tests

- **Form Validation**

  - Verify all required fields (street, city, state, country, postal code)
  - Test field-level validation messages
  - Test form-level validation
  - Verify proceed button enables only with valid data

- **Address Processing**
  - Handle different address formats
  - Verify address saves correctly
  - Test address validation rules
  - Handle special characters in address fields

### Payment Processing Tests

- **Payment Method Selection**

  - Verify all payment methods available:
    - Credit Card
    - Bank Transfer
    - Cash on Delivery
    - Buy Now Pay Later
    - Gift Card
  - Verify appropriate form displays for selected method

- **Credit Card Validation**

  - Verify card number format (XXXX-XXXX-XXXX-XXXX)
  - Verify expiry date format (MM/YYYY)
  - Verify CVV format (3-4 digits)
  - Verify cardholder name requirements
  - Test all validation error messages
  - Verify form enables submit only with valid data

- **Payment Confirmation**
  - Verify successful payment message
  - Handle failed payment scenarios
  - Verify order confirmation display
  - Test payment receipt/confirmation

### Error Handling Tests

- **Form Validation Errors**

  - Test all field-level validations
  - Verify error message display
  - Test error message clarity
  - Verify error state recovery

- **API Error Handling**
  - Test network error scenarios
  - Test server error responses
  - Verify user-friendly error messages
  - Test recovery from errors

### Cross-browser Testing

- Verify checkout flow in:
  - Chrome
  - Firefox
  - Safari
  - Edge

## Test Execution Environment

### Local Testing

```bash
npx playwright test
```

### CI/CD Testing

- Automated tests run on GitHub Actions
- Triggers:
  - Push to main/master
  - Pull requests to main/master
- Test reports retained for 30 days

## Test Data Management

### User Credentials

- Admin user
- Regular users (User1, User2)
- Non-existent user
- Invalid credentials

### Environment Variables

All sensitive test data is managed through environment variables and GitHub secrets

## Reporting

- Automated test reports generated after each test run
- Reports accessible through GitHub Actions artifacts
- Failed test screenshots and traces (if configured)

## 5. Product Details Tests

### Product Information Display

- **Basic Information**

  - Verify product name display
  - Verify price display and format
  - Verify description content
  - Verify product image loading

- **Additional Information**
  - Verify category badges display
  - Verify brand information
  - Verify related products section
  - Test related product links

### Quantity Controls

- **Input Validation**

  - Test direct quantity input
  - Verify minimum quantity limit (1)
  - Verify maximum quantity limit (99)
  - Test invalid input handling

- **Button Controls**
  - Test increment button
  - Test decrement button
  - Verify button state at limits
  - Test rapid button clicks

### Cart Integration

- **Add to Cart**
  - Add single item to cart
  - Add multiple quantities
  - Verify success messages
  - Verify cart updates

### Favorites Functionality

- **Guest User**

  - Verify unauthorized message
  - Test redirect to login

- **Logged-in User**
  - Add item to favorites
  - Handle duplicate favorites
  - Verify success messages
  - Test favorites list update

### Toast Notifications

- **Success Messages**

  - Verify cart addition messages
  - Verify favorites messages
  - Test message timing

- **Error Messages**
  - Verify unauthorized messages
  - Test validation error messages
  - Verify error message clarity
