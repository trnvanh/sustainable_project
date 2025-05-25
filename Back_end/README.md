# Sustanable Food Product Backend

This repository contains the backend API for the Sustanable Food Product application.

## Features

- User authentication and authorization
- Product management
- Order processing
- Store management
- PayPal payment integration

## Payment Integration

The application integrates with PayPal to process payments for orders:

- Payment flow follows user-friendly redirect approach
- Supports payment processing for orders
- Full documentation available in [PAYPAL_INTEGRATION.md](PAYPAL_INTEGRATION.md)
- Testing guide available in [PAYPAL_TESTING_GUIDE.md](PAYPAL_TESTING_GUIDE.md)

## Setup and Configuration

### Prerequisites

- Java 17
- Maven
- MySQL database

### Environment Variables

The following environment variables are required:

```
# Database
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/sustanable_project
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=password

# PayPal
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
```

### Build and Run

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

## API Documentation

API documentation is available at `/swagger-ui.html` when the application is running.

## Testing

```bash
# Run unit tests
mvn test

# Run specific test class
mvn test -Dtest=PaymentIntegrationTest
```
