# Deep Link Testing Guide

## Overview
This guide helps you test the PayPal payment redirect functionality in your React Native app.

## Setup Complete ✅

The following components have been configured:

### 1. App Configuration
- **App Scheme**: `heroeatspay` (configured in `app.json`)
- **Deep Link Handler**: Added to `app/_layout.tsx` with proper URL parsing and navigation

### 2. Backend Configuration  
- **Return URLs**: 
  - Success: `heroeatspay://payment/success`
  - Cancel: `heroeatspay://payment/cancel`
- **PaymentController**: Returns HTML pages that automatically redirect to app using custom scheme

### 3. Frontend Screens
- **Success Screen**: `app/payment/success.tsx` - Handles successful payments
- **Cancel Screen**: `app/payment/cancel.tsx` - Handles cancelled payments

## Testing Instructions

### 1. Manual Deep Link Testing

You can test the deep links manually using these commands:

**For iOS Simulator:**
```bash
xcrun simctl openurl booted "heroeatspay://payment/success?status=success&paymentId=TEST123&message=Payment successful"
```

**For Android Emulator:**
```bash
adb shell am start -W -a android.intent.action.VIEW -d "heroeatspay://payment/success?status=success&paymentId=TEST123&message=Payment successful" com.sustainableapp
```

### 2. PayPal Payment Flow Testing

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

3. **Test the complete flow**:
   - Add items to cart
   - Proceed to checkout
   - Initiate PayPal payment
   - Complete payment in PayPal
   - Verify redirect back to app

### 3. Expected Behavior

#### Success Flow:
1. User completes PayPal payment
2. PayPal redirects to backend `/api/v1/payments/success`
3. Backend returns HTML page that redirects to `heroeatspay://payment/success`
4. App opens the payment success screen
5. User sees success message and can navigate back to orders

#### Cancel Flow:
1. User cancels PayPal payment
2. PayPal redirects to backend `/api/v1/payments/cancel`
3. Backend returns HTML page that redirects to `heroeatspay://payment/cancel`
4. App opens the payment cancel screen
5. User sees cancellation message

## Troubleshooting

### Common Issues:

1. **App doesn't open from deep link**:
   - Ensure the app is installed on the device/simulator
   - Check that the URL scheme matches exactly (`heroeatspay`)
   - Verify the app is not already running in the background

2. **Wrong screen opens**:
   - Check the URL parsing logic in `_layout.tsx`
   - Verify the route paths match the actual file structure

3. **Backend redirect fails**:
   - Ensure return URLs in `application.yml` are correct
   - Check that PaymentController is returning proper HTML

### Debug Console Logs:

The app will log the following when receiving deep links:
- `Deep link received: [URL]`
- `Parsed URL: [Parsed Object]`  
- `Redirecting to payment success/cancel screen`

## File Structure

```
Front_end/
├── app/
│   ├── _layout.tsx          # Deep link handler
│   └── payment/
│       ├── success.tsx      # Payment success screen
│       └── cancel.tsx       # Payment cancel screen
└── app.json                 # App scheme configuration

Back_end/
├── src/main/resources/
│   └── application.yml      # PayPal return URLs
└── src/main/java/.../controller/
    └── PaymentController.java # Payment endpoints with redirects
```

## Next Steps

1. Test the complete payment flow end-to-end
2. Test on both iOS and Android devices
3. Verify error handling scenarios
4. Test with different payment amounts and methods
5. Ensure proper state management after payment completion
