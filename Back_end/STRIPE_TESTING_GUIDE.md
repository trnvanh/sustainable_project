# Stripe Testing Guide

This guide provides instructions on how to test the Stripe integration in the Sustanable project.

## Test Environment Setup

### 1. Stripe Test Credentials

Use Stripe test keys from your Stripe Dashboard:

```bash
export STRIPE_API_KEY="sk_test_..."
export STRIPE_WEBHOOK_SECRET="whsec_test_..."
```

### 2. Test Cards

Stripe provides test card numbers for different scenarios:

- **Successful Payment**: `4242424242424242`
- **Payment Declined**: `4000000000000002`
- **Card Requires Authentication**: `4000002500003155`
- **Insufficient Funds**: `4000000000009995`

Use any future expiry date, any 3-digit CVC, and any postal code.

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

### 2. Initiate Stripe Payment

Start the payment process for the order:

```bash
curl -X POST http://localhost:8080/api/v1/orders/{orderId}/pay?provider=stripe \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

The response will include a `redirectUrl` to Stripe's checkout page.

### 3. Complete Payment in Browser

1. Open the `redirectUrl` in a browser
2. Fill in the checkout form with test card details
3. Complete the payment process
4. You'll be redirected back to the app

### 4. Verify Order Status

Check that the order status has been updated:

```bash
curl -X GET http://localhost:8080/api/v1/orders/{orderId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

The order should now have `paymentStatus: "COMPLETED"` and `status: "CONFIRMED"`.

## Common Test Cases

### Test Case 1: Successful Payment

1. Create an order
2. Initiate Stripe payment
3. Use test card `4242424242424242`
4. Complete payment
5. Verify order status is updated

**Expected Result**: Payment succeeds, order status becomes "CONFIRMED"

### Test Case 2: Declined Payment

1. Create an order
2. Initiate Stripe payment  
3. Use test card `4000000000000002`
4. Attempt payment
5. Verify order status remains "PENDING"

**Expected Result**: Payment fails, order status remains "PENDING"

### Test Case 3: Payment Cancellation

1. Create an order
2. Initiate Stripe payment
3. Cancel payment on Stripe checkout page
4. Verify redirect to cancel URL

**Expected Result**: User redirected to cancel page, order status remains "PENDING"

### Test Case 4: 3D Secure Authentication

1. Create an order
2. Initiate Stripe payment
3. Use test card `4000002500003155`
4. Complete 3D Secure authentication
5. Verify payment completion

**Expected Result**: Additional authentication step, then payment succeeds

## Webhook Testing

### Using Stripe CLI

1. Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
2. Login: `stripe login`
3. Forward events to local server:
   ```bash
   stripe listen --forward-to localhost:8080/api/v1/stripe/webhook
   ```
4. The CLI will provide a webhook signing secret for testing

### Manual Webhook Testing

You can also test webhooks by creating events in the Stripe Dashboard under "Developers" > "Webhooks" > "Test".

## Debugging Tips

### Check Logs

- Application logs will show Stripe API responses
- Stripe Dashboard shows all payment attempts and webhook deliveries

### Common Issues

1. **Invalid API Key**: Ensure you're using the correct test API key
2. **Webhook Signature Verification Failed**: Check that webhook secret matches
3. **Order Not Found**: Verify order ID and user authentication
4. **CORS Issues**: Ensure proper CORS configuration for your frontend domain

### Stripe Dashboard

Use the Stripe Dashboard to:
- View all test payments
- Check webhook event deliveries
- See detailed payment information
- Debug failed payments

## Environment Variables

For local testing, create a `.env` file:

```
STRIPE_API_KEY=sk_test_your_test_key_here
STRIPE_WEBHOOK_SECRET=whsec_test_your_webhook_secret
```

## Integration Testing

### Mobile App Testing

1. Run the backend server locally
2. Update mobile app to point to local backend
3. Test payment flow from mobile device
4. Verify redirects work properly with app deep links

### Frontend Testing

1. Ensure success/cancel URLs match your app's deep link scheme
2. Test payment flow from cart checkout
3. Verify proper error handling and user feedback
4. Test app state recovery after payment completion

## Moving to Production

When ready to move to production:

1. Replace test API keys with live keys in production environment
2. Update webhook endpoints to production URLs
3. Configure production webhook endpoints in Stripe Dashboard
4. Test with small amounts first
5. Monitor payment success rates and error logs