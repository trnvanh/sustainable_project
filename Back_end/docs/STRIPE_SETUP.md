# Stripe Integration Setup

This document provides steps to set up Stripe credentials for development and production.

## Step 1: Create a Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign up for a new account or log in if you already have one
3. Complete your account setup and verification process

## Step 2: Get Your API Keys

1. In the Stripe Dashboard, navigate to "Developers" > "API keys"
2. You'll see two sets of keys:
   - **Test keys**: For development and testing
   - **Live keys**: For production (only visible after account activation)

### Test Environment Keys

For development, copy the following test keys:
- **Publishable key**: `pk_test_...` (used in frontend)
- **Secret key**: `sk_test_...` (used in backend)

### Live Environment Keys

For production, copy the following live keys:
- **Publishable key**: `pk_live_...` (used in frontend)
- **Secret key**: `sk_live_...` (used in backend)

## Step 3: Configure Webhook Endpoints

1. In the Stripe Dashboard, go to "Developers" > "Webhooks"
2. Click "Add endpoint"
3. For development, add: `https://yourdomain.com/api/v1/stripe/webhook`
4. Select the following events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

5. Click "Add endpoint"
6. Copy the **Webhook signing secret** (`whsec_...`)

## Step 4: Configure Your Application

### Development Environment

Set the environment variables in your development environment:

```bash
export STRIPE_API_KEY="sk_test_your_secret_key_here"
export STRIPE_WEBHOOK_SECRET="whsec_test_your_webhook_secret"
```

### Production Environment

For production, update your deployment configuration with the live credentials:

```yaml
stripe:
  api:
    key: ${STRIPE_API_KEY:sk_live_your_live_secret_key}
  webhook:
    secret: ${STRIPE_WEBHOOK_SECRET:whsec_live_your_webhook_secret}
  success-url: https://yourapp.com/payment/stripe/success
  cancel-url: https://yourapp.com/payment/stripe/cancel
```

**Important**: Never commit actual credentials to version control! Use environment variables or secure secrets management.

## Step 5: Configure Payment Methods

1. In Stripe Dashboard, go to "Settings" > "Payment methods"
2. Enable the payment methods you want to accept:
   - Cards (Visa, Mastercard, American Express, etc.)
   - Digital wallets (Apple Pay, Google Pay)
   - Bank transfers (ACH, SEPA, etc.)
   - Buy now, pay later (Klarna, Afterpay, etc.)

## Step 6: Set Up Tax Configuration (Optional)

1. Go to "Products" > "Tax"
2. Configure tax rates for your business locations
3. Enable automatic tax calculation if needed

## Step 7: Configure Business Information

1. Go to "Settings" > "Business settings"
2. Fill in your business information:
   - Business name and address
   - Tax ID (if applicable)
   - Bank account for payouts
   - Business type and category

## Step 8: Test Your Integration

1. Follow the instructions in [STRIPE_TESTING_GUIDE.md](../STRIPE_TESTING_GUIDE.md)
2. Use Stripe's test card numbers to verify payment flows
3. Test webhook delivery using Stripe CLI or Dashboard

## Step 9: Enable Live Mode

1. Complete Stripe's account verification process
2. Provide required business documentation
3. Set up bank account for receiving payouts
4. Switch to live API keys in production
5. Update webhook endpoints to production URLs

## Additional Configuration

### Mobile App Deep Links

Ensure your mobile app can handle the success/cancel URLs:

```
heroeatspay://payment/stripe/success
heroeatspay://payment/stripe/cancel
```

### CORS Configuration

If using Stripe Checkout with a web frontend, configure CORS in your backend to allow requests from your domain.

### Rate Limiting

Consider implementing rate limiting for payment endpoints to prevent abuse.

## Security Best Practices

1. **Never expose secret keys**: Only use them server-side
2. **Validate webhook signatures**: Always verify webhook authenticity
3. **Use HTTPS**: Ensure all payment-related communications are encrypted
4. **Implement proper authentication**: Verify user identity before processing payments
5. **Log payment events**: Keep audit trails for compliance and debugging
6. **Monitor for suspicious activity**: Set up alerts for unusual payment patterns

## Troubleshooting

### Common Issues

1. **Invalid API Key**: Double-check that you're using the correct key for your environment
2. **Webhook signature verification failed**: Ensure webhook secret matches
3. **Payment declined**: Check card details and try different test cards
4. **CORS errors**: Verify CORS configuration for your domain

### Getting Help

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
- [Stripe Community](https://github.com/stripe)

## Additional Information

- Stripe supports 135+ currencies and 25+ countries
- Test mode processes no real money - use it extensively
- Live mode requires completed account verification
- Stripe provides comprehensive fraud protection and compliance tools