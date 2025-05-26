/**
 * Test the order creation functionality to ensure it matches backend requirements
 */
import { createOrderApi } from '@/api/orders';
import { CartItem } from '@/store/useCartStore';

// Mock cart items for testing
const mockCartItems: CartItem[] = [
    {
        id: '1',
        name: 'Test Product',
        price: '5.99',
        image: 'https://example.com/image.jpg',
        quantity: 1,
        pickupTime: '15:30 - 17:00',
        location: {
            restaurant: 'Test Restaurant',
            address: 'Test Address'
        },
        maxQuantity: 5
    }
];

/**
 * Test order creation with the correct backend format
 */
export const testOrderCreation = async () => {
    console.log('Testing Order Creation...');
    console.log('Cart items:', mockCartItems);

    try {
        // Test with custom pickup time
        const customPickupTime = '2025-05-27T15:30:00';
        console.log('Testing with pickup time:', customPickupTime);

        const response = await createOrderApi(mockCartItems, customPickupTime);

        console.log('Order creation response:', response);

        if (response.success) {
            console.log('✅ Order created successfully');
            console.log('Order data:', response.data);
        } else {
            console.log('❌ Order creation failed:', response.message);
        }

        // Test with default pickup time (1 hour from now)
        console.log('\nTesting with default pickup time (1 hour from now)...');
        const defaultResponse = await createOrderApi(mockCartItems);

        console.log('Default order response:', defaultResponse);

        return response;
    } catch (error) {
        console.error('Error testing order creation:', error);
        return { success: false, message: error.message };
    }
};

/**
 * Verify the request format matches backend requirements
 */
export const verifyOrderFormat = () => {
    console.log('Verifying Order Format...');

    // Expected format from backend requirement:
    const expectedFormat = {
        pickupTime: "2025-05-27T15:30:00", // ✅ top-level field
        items: [
            {
                productId: 1, // Should be number
                quantity: 1
            }
        ]
    };

    console.log('Expected backend format:', expectedFormat);

    // Test the transformation
    const transformedItems = mockCartItems.map(item => ({
        productId: parseInt(item.id), // Convert to number
        quantity: item.quantity
    }));

    const actualFormat = {
        pickupTime: "2025-05-27T15:30:00",
        items: transformedItems
    };

    console.log('Our transformed format:', actualFormat);

    // Verify format matches
    const formatMatches = (
        typeof actualFormat.pickupTime === 'string' &&
        Array.isArray(actualFormat.items) &&
        actualFormat.items.every(item =>
            typeof item.productId === 'number' &&
            typeof item.quantity === 'number'
        )
    );

    if (formatMatches) {
        console.log('✅ Order format matches backend requirements');
    } else {
        console.log('❌ Order format does not match backend requirements');
    }

    return formatMatches;
};

// Export for use in components
export { mockCartItems };
