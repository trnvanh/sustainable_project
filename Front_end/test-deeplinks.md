# Payment Deep Link Testing

## Test Commands

### For iOS Simulator:
```bash
# Test PayPal success
xcrun simctl openurl booted "heroeatspay://payment/success?status=success&paymentId=TEST123&message=Payment%20completed%20successfully"

# Test PayPal cancel
xcrun simctl openurl booted "heroeatspay://payment/cancel?status=cancelled&paymentId=TEST123&message=Payment%20was%20cancelled"

# Test Stripe success
xcrun simctl openurl booted "heroeatspay://payment/stripe/success?status=success&sessionId=cs_test_123&message=Payment%20completed%20successfully"

# Test Stripe cancel
xcrun simctl openurl booted "heroeatspay://payment/stripe/cancel?status=cancelled&sessionId=cs_test_123&message=Payment%20was%20cancelled"
```

### For Android Emulator:
```bash
# Test PayPal success
adb shell am start -W -a android.intent.action.VIEW -d "heroeatspay://payment/success?status=success&paymentId=TEST123&message=Payment%20completed%20successfully" com.sustainableapp

# Test PayPal cancel
adb shell am start -W -a android.intent.action.VIEW -d "heroeatspay://payment/cancel?status=cancelled&paymentId=TEST123&message=Payment%20was%20cancelled" com.sustainableapp

# Test Stripe success
adb shell am start -W -a android.intent.action.VIEW -d "heroeatspay://payment/stripe/success?status=success&sessionId=cs_test_123&message=Payment%20completed%20successfully" com.sustainableapp

# Test Stripe cancel
adb shell am start -W -a android.intent.action.VIEW -d "heroeatspay://payment/stripe/cancel?status=cancelled&sessionId=cs_test_123&message=Payment%20was%20cancelled" com.sustainableapp
```

## Debugging Steps

1. **Check Console Logs**: Look for deep link messages in the React Native console
2. **Verify App State**: Ensure app is running when testing deep links
3. **Test Manual Navigation**: Navigate directly to `/payment/success` in the app to test the screen
4. **Check Network**: Ensure backend can reach the app scheme URLs

## Expected Behavior

✅ **Success Flow:**
1. Payment completed on PayPal/Stripe
2. Backend redirects to `heroeatspay://payment/success?status=success&...`
3. App opens payment success screen
4. User sees success message with payment ID
5. Automatic redirect to orders page after 2 seconds

❌ **Error Flow:**
1. Payment fails on PayPal/Stripe
2. Backend redirects to `heroeatspay://payment/success?status=error&...`
3. App opens payment success screen with error state
4. User sees error message
5. Manual navigation to orders page

## Troubleshooting

If success screen doesn't show:

1. **Check Deep Link Registration**: Verify `heroeatspay` scheme in `app.json`
2. **Check Route Structure**: Ensure payment screens are in correct folder structure
3. **Test Direct Navigation**: Try `router.push('/payment/success')` in app
4. **Check Backend URLs**: Verify return URLs in `application.yml`
5. **Check Browser Redirect**: Test if HTML redirect page works in browser
