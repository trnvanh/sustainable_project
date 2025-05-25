# PayPal Integration Setup

This document provides steps to set up PayPal sandbox credentials for development.

## Step 1: Create a PayPal Developer Account

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com)
2. Sign up for a new account or log in if you already have one

## Step 2: Create a Sandbox App

1. In the PayPal Developer Dashboard, navigate to "My Apps & Credentials"
2. Select the "Sandbox" tab
3. Click "Create App"
4. Give your app a name (e.g., "Sustanable Food App")
5. Select "Merchant" as the app type
6. Click "Create App"

## Step 3: Get Your API Credentials

After creating your app, you'll be taken to the app details page where you can find:

- Client ID
- Secret

Copy these values as they'll be needed for configuration.

## Step 4: Configure Your Application

1. Set the environment variables in your development environment:

```bash
export PAYPAL_CLIENT_ID="your_sandbox_client_id"
export PAYPAL_CLIENT_SECRET="your_sandbox_client_secret"
```

2. Alternatively, update the values directly in your `application.yml` file:

```yaml
paypal:
  client:
    id: your_sandbox_client_id
    secret: your_sandbox_client_secret
  mode: sandbox
  return-url: http://localhost:8080/api/v1/payments/success
  cancel-url: http://localhost:8080/api/v1/payments/cancel
```

Note: Don't commit actual credentials to version control! Use environment variables in production.

## Step 5: Test Your Integration

1. Follow the instructions in [PAYPAL_TESTING_GUIDE.md](PAYPAL_TESTING_GUIDE.md) to test your integration
2. Use the sandbox accounts provided by PayPal for testing payments without real money

## Additional Information

- The PayPal sandbox environment is completely separate from the live environment
- You can create multiple buyer and seller test accounts in the sandbox
- For production deployment, you'll need to create a live PayPal app and update the credentials accordingly
