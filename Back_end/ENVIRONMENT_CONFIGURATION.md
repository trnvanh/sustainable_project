# Environment Variables for Payment Configuration

This document explains the environment variables that can be used to configure payment redirects for different environments.

## Required Environment Variables

### PayPal Configuration
```bash
# PayPal API Credentials
export PAYPAL_CLIENT_ID="your_paypal_client_id"
export PAYPAL_CLIENT_SECRET="your_paypal_client_secret"

# PayPal Redirect URLs (where PayPal redirects after payment)
export PAYPAL_RETURN_URL="http://localhost:8080/api/v1/payments/success"
export PAYPAL_CANCEL_URL="http://localhost:8080/api/v1/payments/cancel"
```

### Stripe Configuration
```bash
# Stripe API Credentials
export STRIPE_API_KEY="sk_test_..."
export STRIPE_WEBHOOK_SECRET="whsec_..."

# Stripe Redirect URLs (where Stripe redirects after payment)
export STRIPE_SUCCESS_URL="http://localhost:8080/api/v1/stripe/success"
export STRIPE_CANCEL_URL="http://localhost:8080/api/v1/stripe/cancel"
```

## Environment-Specific Configurations

### Development Environment
```bash
# For local development
export PAYPAL_RETURN_URL="http://localhost:8080/api/v1/payments/success"
export PAYPAL_CANCEL_URL="http://localhost:8080/api/v1/payments/cancel"
export STRIPE_SUCCESS_URL="http://localhost:8080/api/v1/stripe/success"
export STRIPE_CANCEL_URL="http://localhost:8080/api/v1/stripe/cancel"
```

### Production Environment
```bash
# For production deployment
export PAYPAL_RETURN_URL="https://sustainable-be.code4fun.xyz/api/v1/payments/success"
export PAYPAL_CANCEL_URL="https://sustainable-be.code4fun.xyz/api/v1/payments/cancel"
export STRIPE_SUCCESS_URL="https://sustainable-be.code4fun.xyz/api/v1/stripe/success"
export STRIPE_CANCEL_URL="https://sustainable-be.code4fun.xyz/api/v1/stripe/cancel"
```

## How Payment Redirects Work

1. **Payment Provider Setup**: In your PayPal/Stripe dashboard, configure these return URLs
2. **User Pays**: User completes payment on PayPal/Stripe website
3. **Provider Redirects**: PayPal/Stripe redirects to your backend URL
4. **Backend Processes**: Your controller processes the payment result
5. **HTML Page Generated**: Controller returns HTML page with app redirect
6. **App Opens**: HTML page redirects to `heroeatspay://` scheme, opening your app

## Testing Different Environments

### Local Testing
```bash
# Start with development profile
java -jar -Dspring.profiles.active=development your-app.jar

# Or set environment variables
export SPRING_PROFILES_ACTIVE=development
java -jar your-app.jar
```

### Production Testing
```bash
# Start with production profile
java -jar -Dspring.profiles.active=production your-app.jar

# Or set environment variables
export SPRING_PROFILES_ACTIVE=production
java -jar your-app.jar
```

## Important Notes

1. **HTTPS in Production**: Always use HTTPS URLs in production
2. **PayPal Mode**: Set `paypal.mode=live` for production
3. **Stripe Keys**: Use live keys for production, test keys for development
4. **URL Validation**: Payment providers validate redirect URLs
5. **Mobile App**: Ensure your app is configured to handle `heroeatspay://` scheme

## Troubleshooting

- **Invalid redirect URL**: Check that URLs in payment provider dashboard match your configuration
- **App not opening**: Verify `heroeatspay` scheme is registered in your mobile app
- **CORS issues**: Ensure your backend allows requests from payment provider domains
- **SSL errors**: Use valid SSL certificates in production
