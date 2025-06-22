# Demo Data Guide

This guide provides sample data for testing the Auto Shop Management System.

## Sample Users

```json
[
  {
    "name": "John Smith",
    "email": "john.smith@example.com",
    "password": "password123",
    "carId": 1
  },
  {
    "name": "Sarah Johnson",
    "email": "sarah.johnson@example.com", 
    "password": "password123",
    "carId": 2
  },
  {
    "name": "Mike Davis",
    "email": "mike.davis@example.com",
    "password": "password123",
    "carId": 3
  },
  {
    "name": "Emily Wilson",
    "email": "emily.wilson@example.com",
    "password": "password123",
    "carId": null
  }
]
```

## Sample Cars

```json
[
  {
    "company": "Toyota",
    "model": "Camry"
  },
  {
    "company": "Honda", 
    "model": "Civic"
  },
  {
    "company": "Ford",
    "model": "Mustang"
  },
  {
    "company": "BMW",
    "model": "X5"
  },
  {
    "company": "Mercedes-Benz",
    "model": "C-Class"
  },
  {
    "company": "Tesla",
    "model": "Model 3"
  },
  {
    "company": "Audi",
    "model": "A4"
  },
  {
    "company": "Volkswagen",
    "model": "Golf"
  }
]
```

## Testing Scenarios

### 1. Search Functionality
- Try searching for "John" to find John Smith
- Search for "Toyota" to find Toyota Camry
- Test debounced search by typing quickly

### 2. Pagination
- Create more than 10 users/cars to test pagination
- Try different page sizes (5, 10, 25, 50)
- Test navigation between pages

### 3. CRUD Operations
- Create a new user with car assignment
- Edit an existing user's information
- Delete a user and verify removal
- Create a new car
- Edit car details
- Delete a car

### 4. Form Validation
- Try submitting forms with invalid data
- Test email validation
- Test required field validation

### 5. Responsive Design
- Test on mobile devices
- Test on tablet devices
- Test on desktop with different screen sizes

### 6. Error Handling
- Test with network issues
- Test with invalid API responses
- Verify error messages are user-friendly

## Performance Testing

### Search Performance
- Type quickly in search fields to test debouncing
- Verify API calls are reduced by 70-80%
- Check search highlighting works correctly

### Pagination Performance
- Test with large datasets
- Verify sticky pagination controls
- Test page size changes

### Loading States
- Verify loading indicators appear
- Test optimistic updates
- Check error states

## Browser Testing

Test the application in:
- Chrome (latest)
- Firefox (latest) 
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility Testing

- Test keyboard navigation
- Verify screen reader compatibility
- Check color contrast ratios
- Test focus management 