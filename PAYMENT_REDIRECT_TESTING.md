# Payment Redirect Testing Guide

## Quick Testing Steps

### 1. Start Your Applications

**Backend**:
```bash
cd Back_end
./mvnw spring-boot:run
```

**Frontend**:
```bash
cd Front_end
npx expo start
# Then press 'i' for iOS simulator or 'a' for Android emulator
```

### 2. Test PayPal Redirects

**Success Test**:
1. Open browser and navigate to:
   ```
   http://localhost:8080/api/v1/payments/success?paymentId=TEST_PAYPAL_123&PayerID=PAYER_123
   ```
2. Should see HTML page with "Payment Successful!" message
3. Page should automatically redirect to your app
4. App should open on the payment success screen

**Cancel Test**:
1. Open browser and navigate to:
   ```
   http://localhost:8080/api/v1/payments/cancel?paymentId=TEST_PAYPAL_123
   ```
2. Should see HTML page with "Payment Cancelled" message
3. Page should automatically redirect to your app
4. App should open on the payment cancel screen

### 3. Test Stripe Redirects

**Success Test**:
1. Open browser and navigate to:
   ```
   http://localhost:8080/api/v1/stripe/success?session_id=cs_test_123456789
   ```
2. Should see HTML page with "Payment Successful!" message
3. Page should automatically redirect to your app
4. App should open on the payment success screen

**Cancel Test**:
1. Open browser and navigate to:
   ```
   http://localhost:8080/api/v1/stripe/cancel?session_id=cs_test_123456789
   ```
2. Should see HTML page with "Payment Cancelled" message
3. Page should automatically redirect to your app
4. App should open on the payment cancel screen

### 4. Test Direct Deep Links

**iOS Simulator**:
```bash
# PayPal Success
xcrun simctl openurl booted "heroeatspay://payment/success?status=success&paymentId=TEST_123&message=PayPal%20payment%20successful"

# PayPal Cancel
xcrun simctl openurl booted "heroeatspay://payment/cancel?status=cancelled&paymentId=TEST_123&message=PayPal%20payment%20cancelled"

# Stripe Success
xcrun simctl openurl booted "heroeatspay://payment/stripe/success?status=success&sessionId=cs_test_123&message=Stripe%20payment%20successful"

# Stripe Cancel
xcrun simctl openurl booted "heroeatspay://payment/stripe/cancel?status=cancelled&sessionId=cs_test_123&message=Stripe%20payment%20cancelled"
```

**Android Emulator**:
```bash
# PayPal Success
adb shell am start -W -a android.intent.action.VIEW -d "heroeatspay://payment/success?status=success&paymentId=TEST_123&message=PayPal%20payment%20successful" com.sustainableapp

# PayPal Cancel
adb shell am start -W -a android.intent.action.VIEW -d "heroeatspay://payment/cancel?status=cancelled&paymentId=TEST_123&message=PayPal%20payment%20cancelled" com.sustainableapp

# Stripe Success
adb shell am start -W -a android.intent.action.VIEW -d "heroeatspay://payment/stripe/success?status=success&sessionId=cs_test_123&message=Stripe%20payment%20successful" com.sustainableapp

# Stripe Cancel
adb shell am start -W -a android.intent.action.VIEW -d "heroeatspay://payment/stripe/cancel?status=cancelled&sessionId=cs_test_123&message=Stripe%20payment%20cancelled" com.sustainableapp
```

### 5. What to Look For

**✅ Success Indicators**:
- HTML pages load with proper styling and animations
- Automatic redirect happens within 1-2 seconds
- App opens and navigates to correct screen
- Flash messages appear with correct provider names
- Payment IDs/Session IDs are displayed correctly
- Console logs show proper URL parsing

**❌ Potential Issues**:
- HTML page loads but doesn't redirect (check browser console)
- App doesn't open (check URL scheme registration)
- App opens but goes to wrong screen (check deep link handler)
- Missing payment parameters (check URL encoding)
- Flash messages don't appear (check message formatting)

### 6. Debug Console Logs

**Backend Logs**:
Look for payment processing logs and HTML page generation

**Frontend Logs**:
Look for these console messages:
```
🔗 Deep link received: heroeatspay://...
📋 Parsed URL: {...}
✅ Redirecting to PayPal/Stripe payment success screen
🎯 Navigating to route: /payment/success?...
```

### 7. Real Payment Testing

To test with actual payments:

1. **PayPal Sandbox**: Use PayPal sandbox credentials
2. **Stripe Test Mode**: Use Stripe test keys
3. **Test Cards**: Use test credit card numbers
4. **Webhook Testing**: Verify webhooks are properly configured

### 8. Mobile Device Testing

For real device testing:

1. **Build Development App**:
   ```bash
   npx expo run:ios
   # or
   npx expo run:android
   ```

2. **Use QR Code**: Scan QR code from Expo Dev Tools

3. **Test in Mobile Browser**: Open test URLs in Safari/Chrome on device

### 9. Production Readiness Checklist

- [ ] HTTPS enabled for all payment endpoints
- [ ] Production payment provider credentials configured
- [ ] Custom URL scheme registered with app stores
- [ ] Deep link handling tested on actual devices
- [ ] Error handling tested with invalid parameters
- [ ] Webhook endpoints secured and tested
- [ ] Analytics/logging implemented for monitoring

## Troubleshooting Common Issues

**Issue**: App doesn't open from browser
**Solution**: Check URL scheme in app.json and ensure app is installed

**Issue**: Deep link handler not triggered
**Solution**: Verify URL format and check Linking event listeners

**Issue**: Wrong screen displayed
**Solution**: Check URL path patterns in deep link handler

**Issue**: Payment parameters missing
**Solution**: Verify backend parameter mapping and URL encoding

**Issue**: Redirect loops
**Solution**: Use router.replace() instead of router.push()
