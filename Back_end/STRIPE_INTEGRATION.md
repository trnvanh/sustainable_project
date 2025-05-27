# Stripe Integration Guide

This guide explains how to use Stripe integration in the Sustanable project.

## Setup

The application is configured to use Stripe's Checkout SDK to process payments. The configuration is in `src/main/resources/application.yml`.

### Required Environment Variables

For security, the Stripe credentials should be provided as environment variables:

- `STRIPE_API_KEY`: Your Stripe Secret Key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe Webhook Secret

### Configuration Options

In `application.yml`:

```yaml
stripe:
  api:
    key: ${STRIPE_API_KEY:sk_test_...}
  webhook:
    secret: ${STRIPE_WEBHOOK_SECRET:whsec_...}
  success-url: heroeatspay://payment/stripe/success
  cancel-url: heroeatspay://payment/stripe/cancel
```

## Payment Flow

1. **Create Order**: When a user places an order, it's initially created with `PENDING` status.

2. **Initiate Payment**: After order creation, the client should make a request to `/api/v1/orders/{orderId}/pay?provider=stripe` to start the Stripe payment process.

3. **Checkout Session**: The API creates a Stripe Checkout Session and returns a checkout URL that the client should redirect the user to.

4. **Payment Completion**: After user completes payment, Stripe redirects back to our application's success URL (`/api/v1/stripe/success`) with the session ID.

5. **Order Update**: Upon successful payment, the order status is updated to `CONFIRMED` and payment status to `COMPLETED`.

## API Endpoints

### Create a Payment

```
POST /api/v1/orders/{orderId}/pay?provider=stripe
```

Initiates the payment process for an order using Stripe.

**Response**:
```json
{
  "success": true,
  "message": "Stripe checkout session created successfully",
  "redirectUrl": "https://checkout.stripe.com/pay/cs_...",
  "paymentId": "cs_..."
}
```

### Payment Success

```
GET /api/v1/stripe/success?session_id={sessionId}
```

Handles the successful payment redirect from Stripe.

### Payment Cancellation

```
GET /api/v1/stripe/cancel?session_id={sessionId}
```

Handles the cancellation of a payment.

### Webhook Endpoint

```
POST /api/v1/stripe/webhook
```

Handles Stripe webhook events for real-time payment status updates.

## Error Handling

- If an order is not found or doesn't belong to the authenticated user, a 400 Bad Request response is returned.
- If there's a technical error during payment creation or execution, a detailed error message is included in the response.

## Testing

See the STRIPE_TESTING_GUIDE.md for information on how to test Stripe integration using test cards and webhook testing.

## Webhook Events

The integration handles the following Stripe webhook events:

- `checkout.session.completed`: When a checkout session is successfully completed
- `payment_intent.succeeded`: When a payment intent succeeds
- `payment_intent.payment_failed`: When a payment intent fails

## Security Considerations

- All Stripe API calls are made server-side
- Webhook signatures are verified to ensure authenticity
- Order ownership is verified before processing payments
- Sensitive payment data never touches our servers (handled by Stripe)