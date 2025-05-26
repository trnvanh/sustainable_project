# PayPal Payment Integration Testing Guide

## Overview
This guide outlines how to test the PayPal payment integration that automatically initiates payment after successful order creation.

## Integration Flow
1. **Order Creation**: User completes cart checkout
2. **Automatic Payment Initiation**: System calls PayPal payment endpoint
3. **PayPal Redirect**: User is redirected to PayPal checkout page
4. **Payment Completion**: User completes payment on PayPal
5. **Return to App**: User returns to app, order status updates

## Test Scenarios

### Scenario 1: Successful Order Creation with PayPal Payment
**Steps:**
1. Add items to cart
2. Navigate to cart page
3. Click "Checkout" button
4. Verify order creation success message
5. Verify automatic PayPal redirect occurs
6. Complete payment on PayPal
7. Return to app and check order status

**Expected Results:**
- Order created successfully
- PayPal payment page opens in browser
- User can complete payment
- Order status updates after returning to app

### Scenario 2: Manual Payment for Pending Orders
**Steps:**
1. Create an order (if PayPal redirect fails)
2. Navigate to Orders page
3. Find order with "Payment Pending" status
4. Click the green payment button (💳)
5. Complete PayPal payment

**Expected Results:**
- Payment button is visible for pending payments
- PayPal redirect works from orders page
- Payment status updates correctly

### Scenario 3: Payment Failure Handling
**Steps:**
1. Create an order
2. Cancel payment on PayPal page
3. Return to app
4. Check order status

**Expected Results:**
- Order remains in "pending" status
- Payment status stays "pending"
- User can retry payment from orders page

### Scenario 4: App State Recovery
**Steps:**
1. Create order and navigate to PayPal
2. Leave PayPal page open
3. Switch between apps
4. Return to the React Native app
5. Check if order status refreshes

**Expected Results:**
- Orders refresh when app becomes active
- Payment status updates if payment was completed

## Key Components Modified

### 1. Order Store (`store/useOrderStore.ts`)
- **`createOrder`**: Automatically calls PayPal payment endpoint after order creation
- **`payOrder`**: Enhanced to handle PayPal redirect URLs
- **`refreshOrderPaymentStatus`**: New method to refresh payment status

### 2. Enhanced Order Card (`components/EnhancedOrderCard.tsx`)
- Displays payment status badges
- Shows "Pay Now" button for pending payments
- Provides user feedback during payment process

### 3. Orders Page (`app/orders/index.tsx`)
- Integrates app state handler for automatic refresh
- Separates active and completed orders
- Shows payment status in order cards

### 4. App State Handler (`hooks/useAppStateHandler.ts`)
- Monitors app state changes
- Refreshes orders when returning from background
- Helps update payment status after PayPal return

### 5. Cart Checkout (`app/cart/index.tsx`)
- Enhanced user feedback messages
- Delayed navigation to allow PayPal redirect
- Clear success/error messaging

## API Endpoints Used

### Order Creation
```
POST /api/v1/orders
```

### Payment Initiation
```
POST /api/v1/orders/{orderId}/pay
Response: { redirectUrl, paymentId, success }
```

### Order Fetching
```
GET /api/v1/orders
```

## Configuration Requirements

### Backend Requirements
- PayPal sandbox/production configuration
- CORS settings for frontend domain
- Webhook handlers for payment completion
- Proper authentication middleware

### Frontend Requirements
- React Native Linking capability
- Proper error handling for network issues
- App state monitoring for payment returns

## Troubleshooting

### PayPal Redirect Issues
- Check if `expo-linking` is properly installed
- Verify URL scheme configuration
- Test with PayPal sandbox environment

### Payment Status Not Updating
- Check app state handler integration
- Verify backend webhook configuration
- Ensure order refresh on app focus

### Network Issues
- Check API base URL configuration
- Verify authentication tokens
- Test with backend server running

## Environment Setup

### Development Testing
1. Ensure backend server is running on `localhost:8080`
2. Configure PayPal sandbox credentials
3. Start React Native development server: `expo start`
4. Test on physical device for best PayPal redirect experience

### Production Considerations
- Update PayPal to production environment
- Configure proper webhook URLs
- Test payment flow end-to-end
- Monitor payment completion rates

## Success Indicators
- ✅ Orders create successfully
- ✅ PayPal redirect works automatically
- ✅ Manual payment option available
- ✅ Payment status updates correctly
- ✅ Error handling works properly
- ✅ App state recovery functions
- ✅ User feedback is clear and helpful

## Next Steps
1. Test with PayPal sandbox environment
2. Implement webhook handling for payment completion
3. Add payment retry mechanism for failed payments
4. Consider adding payment receipt/confirmation screen
5. Monitor and log payment success rates
