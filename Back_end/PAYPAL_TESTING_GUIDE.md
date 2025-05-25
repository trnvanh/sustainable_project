# PayPal Testing Guide

This guide provides instructions on how to test the PayPal integration in the Sustanable project.

## Sandbox Testing

PayPal provides a sandbox environment for testing payments without using real money.

### Prerequisites

1. **PayPal Developer Account**: Create an account at [developer.paypal.com](https://developer.paypal.com)

2. **Sandbox Credentials**: Once you have a developer account:
   - Go to the Developer Dashboard
   - Navigate to "My Apps & Credentials"
   - Create a new app for the sandbox environment
   - Note the Client ID and Secret

3. **Sandbox Test Accounts**: PayPal provides test buyer and merchant accounts:
   - Go to "Sandbox" > "Accounts"
   - You can use the pre-created accounts or create new ones
   - Note the email and password for these accounts for testing

### Setting Up the Environment

1. Set the environment variables for your local development:

```bash
export PAYPAL_CLIENT_ID="your_sandbox_client_id"
export PAYPAL_CLIENT_SECRET="your_sandbox_client_secret"
```

2. Ensure the `paypal.mode` in `application.yml` is set to `sandbox`.

## Testing Process

### 1. Create an Order

Using the application's API, create a new order:

```bash
curl -X POST http://localhost:8080/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "pickupTime": "2023-06-01T15:30:00",
    "items": [
      {
        "productId": 1,
        "quantity": 2
      }
    ]
  }'
```

Note the `orderId` in the response.

### 2. Initiate Payment

Start the payment process for the order:

```bash
curl -X POST http://localhost:8080/api/v1/orders/{orderId}/pay \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

The response will include a `redirectUrl` to PayPal's checkout page.

### 3. Complete Payment in Browser

1. Open the `redirectUrl` in a web browser
2. Log in with your PayPal sandbox buyer account
3. Follow the payment approval process
4. You'll be redirected to the application's success URL

### 4. Verify Order Status

Check the order's status after payment:

```bash
curl -X GET http://localhost:8080/api/v1/orders/{orderId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

The order status should be updated to `CONFIRMED` and payment status to `COMPLETED`.

## Common Test Cases

### Test Case 1: Successful Payment

Follow the steps above for the standard successful payment flow.

### Test Case 2: Cancelled Payment

1. Follow steps 1 and 2 above
2. When on the PayPal checkout page, click "Cancel" or close the window
3. Verify the order remains in a PENDING state

### Test Case 3: Insufficient Funds

1. In your PayPal Developer account, modify a sandbox buyer account to have insufficient funds
2. Follow the payment process and observe the error handling

## Debugging Tips

1. Check application logs for detailed error messages from PayPal
2. In the PayPal Developer Dashboard, you can view the sandbox transactions
3. Use the transaction ID to match logs between your application and PayPal's dashboard

## Moving to Production

When ready to move to production:

1. Create a Live PayPal application in the Developer Dashboard
2. Update the environment variables with the live credentials
3. Set `paypal.mode` to `live` in the production environment
4. Update the return URLs as necessary for the production domain