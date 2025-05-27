# Payment Web-to-App Redirect Implementation

## Overview

This document explains the complete implementation of web-to-app payment redirects for both PayPal and Stripe payment providers in the HeroEats application.

## How It Works

The payment redirect system follows this flow:

1. **Payment Initiation**: User initiates payment from React Native app
2. **Web Payment**: App opens web browser/WebView for payment processing
3. **Payment Completion**: User completes or cancels payment on web
4. **Server Redirect**: Backend returns HTML page with app redirect
5. **App Redirect**: HTML page automatically redirects back to React Native app
6. **Result Handling**: App handles the payment result and shows appropriate screen

## Components

### 1. URL Scheme Configuration

**File**: `Front_end/app.json`
```json
{
  "expo": {
    "scheme": "heroeatspay"
  }
}
```

This registers the custom URL scheme `heroeatspay://` that allows web pages to redirect back to the app.

### 2. Backend Controllers

#### PayPal Controller
**File**: `Back_end/src/main/java/com/sustanable/foodproduct/controller/PaymentController.java`

**Endpoints**:
- `GET /api/v1/payments/success` - Handles PayPal payment success
- `GET /api/v1/payments/cancel` - Handles PayPal payment cancellation

**Redirect URLs**:
- Success: `heroeatspay://payment/success?status=success&paymentId={id}&message=Payment%20completed%20successfully`
- Cancel: `heroeatspay://payment/cancel?status=cancelled&paymentId={id}&message=Payment%20was%20cancelled`

#### Stripe Controller
**File**: `Back_end/src/main/java/com/sustanable/foodproduct/controller/StripeController.java`

**Endpoints**:
- `GET /api/v1/stripe/success` - Handles Stripe payment success
- `GET /api/v1/stripe/cancel` - Handles Stripe payment cancellation

**Redirect URLs**:
- Success: `heroeatspay://payment/stripe/success?status=success&sessionId={id}&message=Payment%20completed%20successfully`
- Cancel: `heroeatspay://payment/stripe/cancel?status=cancelled&sessionId={id}&message=Payment%20was%20cancelled`

### 3. HTML Redirect Pages

Each backend endpoint returns an HTML page that:
- Shows a user-friendly loading screen
- Uses multiple redirect methods for maximum compatibility:
  - `window.location.href`
  - `window.location.replace()`
  - `window.open()`
  - Meta refresh tag
- Provides a manual fallback link
- Includes modern CSS styling with animations

### 4. React Native Deep Link Handler

**File**: `Front_end/app/_layout.tsx`

The deep link handler:
- Listens for incoming URLs using `expo-linking`
- Parses URL paths and query parameters
- Routes to appropriate screens based on payment provider
- Handles both app launch and runtime deep links
- Uses `router.replace()` to prevent back navigation to web payment

**Supported Paths**:
- `payment/success` (PayPal)
- `payment/cancel` (PayPal)
- `payment/stripe/success` (Stripe)
- `payment/stripe/cancel` (Stripe)

### 5. Payment Result Screens

#### Success Screen
**File**: `Front_end/app/payment/success.tsx`

Features:
- Detects payment provider (PayPal vs Stripe)
- Shows success message with provider name
- Refreshes order list
- Displays payment ID/session ID
- Automatic navigation to orders

#### Cancel Screen
**File**: `Front_end/app/payment/cancel.tsx`

Features:
- Detects payment provider
- Shows cancellation message
- Provides options to return to cart or view orders
- Displays payment ID/session ID

## URL Structure

### PayPal URLs
```
Success: heroeatspay://payment/success?status=success&paymentId=PAYID-123&message=Payment%20completed%20successfully
Cancel:  heroeatspay://payment/cancel?status=cancelled&paymentId=PAYID-123&message=Payment%20was%20cancelled
```

### Stripe URLs
```
Success: heroeatspay://payment/stripe/success?status=success&sessionId=cs_test_123&message=Payment%20completed%20successfully
Cancel:  heroeatspay://payment/stripe/cancel?status=cancelled&sessionId=cs_test_123&message=Payment%20was%20cancelled
```

## Testing

### Manual Testing

1. **Start the backend server**:
   ```bash
   cd Back_end
   ./mvnw spring-boot:run
   ```

2. **Start the React Native app**:
   ```bash
   cd Front_end
   npx expo start
   ```

3. **Test PayPal redirect**:
   - Navigate to: `http://localhost:8080/api/v1/payments/success?paymentId=TEST123&PayerID=PAYER123`
   - Should redirect to app success screen

4. **Test Stripe redirect**:
   - Navigate to: `http://localhost:8080/api/v1/stripe/success?session_id=cs_test_123`
   - Should redirect to app success screen

### iOS Simulator Testing

Use iOS Simulator to test deep links:
```bash
xcrun simctl openurl booted "heroeatspay://payment/success?status=success&paymentId=TEST_123"
```

### Android Emulator Testing

Use ADB to test deep links:
```bash
adb shell am start -W -a android.intent.action.VIEW -d "heroeatspay://payment/success?status=success&paymentId=TEST_123" com.sustainableapp
```

## Error Handling

The system includes comprehensive error handling:

1. **Parsing Errors**: If URL parsing fails, redirect to orders page
2. **Missing Parameters**: Gracefully handle missing payment IDs
3. **Network Errors**: Show appropriate error messages
4. **Redirect Failures**: Provide manual fallback links

## Security Considerations

1. **Parameter Validation**: All URL parameters are validated on both backend and frontend
2. **User Authentication**: Payment endpoints verify user ownership of orders
3. **HTTPS**: All payment communication should use HTTPS in production
4. **URL Encoding**: All parameters are properly URL encoded

## Browser Compatibility

The HTML redirect pages are compatible with:
- Safari (iOS)
- Chrome (Android)
- In-app browsers (Facebook, Instagram, etc.)
- WebView components

## Troubleshooting

### Common Issues

1. **App doesn't open from web**:
   - Check URL scheme registration in `app.json`
   - Verify the custom scheme is properly configured for your platform

2. **Deep link not handled**:
   - Check console logs in React Native app
   - Verify the URL path matches expected patterns
   - Ensure `expo-linking` is properly configured

3. **Payment parameters missing**:
   - Check backend controller parameter mapping
   - Verify frontend parameter extraction logic

4. **Redirect loops**:
   - Use `router.replace()` instead of `router.push()`
   - Ensure proper URL encoding

### Debug Tips

1. Enable console logging in both backend and frontend
2. Use browser developer tools to inspect HTML redirect pages
3. Test with different browsers and devices
4. Verify URL scheme registration with platform-specific tools

## Production Considerations

1. **HTTPS**: Ensure all payment URLs use HTTPS
2. **Domain Configuration**: Update redirect URLs for production domain
3. **App Store Review**: Custom URL schemes may require App Store review explanation
4. **Deep Link Testing**: Test on actual devices before production release

## Future Enhancements

1. **Universal Links** (iOS): Consider implementing universal links for better user experience
2. **App Links** (Android): Implement Android App Links for verified domain association
3. **Payment Status Polling**: Add fallback mechanism to poll payment status if redirect fails
4. **Analytics**: Track redirect success/failure rates for monitoring
