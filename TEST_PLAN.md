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
