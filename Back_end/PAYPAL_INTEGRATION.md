# PayPal Integration Guide

This guide explains how to use PayPal integration in the Sustanable project.

## Setup

The application is configured to use PayPal's Checkout SDK to process payments. The configuration is in `src/main/resources/application.yml`.

### Required Environment Variables

For security, the PayPal credentials should be provided as environment variables:

- `PAYPAL_CLIENT_ID`: Your PayPal Client ID
- `PAYPAL_CLIENT_SECRET`: Your PayPal Client Secret

### Configuration Options

In `application.yml`:

```yaml
paypal:
  client:
    id: ${PAYPAL_CLIENT_ID:your-client-id}
    secret: ${PAYPAL_CLIENT_SECRET:your-client-secret}
  mode: sandbox  # Change to 'live' for production
  return-url: http://localhost:8080/api/v1/payments/success
  cancel-url: http://localhost:8080/api/v1/payments/cancel
```

## Payment Flow

1. **Create Order**: When a user places an order, it's initially created with `PENDING` status.

2. **Initiate Payment**: After order creation, the client should make a request to `/api/v1/orders/{orderId}/pay` to start the PayPal payment process.

3. **User Approval**: The API returns a PayPal approval URL that the client should redirect the user to.

4. **Payment Completion**: After user approval, PayPal redirects back to our application's success URL (`/api/v1/payments/success`) with the payment ID and payer ID.

5. **Order Update**: Upon successful payment, the order status is updated to `CONFIRMED`.

## API Endpoints

### Create a Payment

```
POST /api/v1/orders/{orderId}/pay
```

Initiates the payment process for an order.

**Response**:
```json
{
  "success": true,
  "message": "Payment created successfully",
  "redirectUrl": "https://www.sandbox.paypal.com/checkoutnow?token=....",
  "paymentId": "PAYID-..."
}
```

### Payment Success

```
GET /api/v1/payments/success?paymentId={paymentId}&PayerID={payerId}
```

Handles the successful payment redirect from PayPal.

### Payment Cancellation

```
GET /api/v1/payments/cancel?paymentId={paymentId}
```

Handles the cancellation of a payment.

## Error Handling

- If an order is not found or doesn't belong to the authenticated user, a 400 Bad Request response is returned.
- If there's a technical error during payment creation or execution, a detailed error message is included in the response.

## Testing

See the PAYPAL_TESTING_GUIDE.md for information on how to test PayPal integration using sandbox accounts.