/**
 * Utility functions for debugging cart-related issues
 */
import { useCartStore } from "@/store/useCartStore";
import { showMessage } from "react-native-flash-message";

/**
 * Test cart removal functionality with detailed logging
 * @param itemId The ID of the item to remove
 * @returns Object containing success flag and debug information
 */
export const testCartRemoval = (itemId: string) => {
    console.log('------------ CART REMOVAL TEST ------------');
    console.log('Testing removal of item with ID:', itemId);

    try {
        // Capture initial state
        const initialItems = useCartStore.getState().items;
        const initialCount = initialItems.length;
        const itemExists = initialItems.some(item => item.id === itemId);

        console.log(`Initial cart state: ${initialCount} items`);
        console.log(`Item ${itemId} exists in cart: ${itemExists}`);

        if (!itemExists) {
            console.log('❌ TEST FAILED: Item does not exist in cart');
            return {
                success: false,
                reason: 'Item not found',
                debugInfo: { itemId, initialCount, itemExists }
            };
        }

        // Perform removal
        console.log('Calling removeFromCart...');
        useCartStore.getState().removeFromCart(itemId);

        // Verify removal
        const finalItems = useCartStore.getState().items;
        const finalCount = finalItems.length;
        const stillExists = finalItems.some(item => item.id === itemId);

        console.log(`Final cart state: ${finalCount} items`);
        console.log(`Item ${itemId} still exists: ${stillExists}`);
        console.log(`Items were removed: ${initialCount !== finalCount}`);

        const success = !stillExists && initialCount > finalCount;

        if (success) {
            console.log('✅ TEST PASSED: Item successfully removed');
            showMessage({
                message: 'Cart removal test passed',
                description: `Successfully removed item ${itemId}`,
                type: 'success',
                icon: 'success',
            });
        } else {
            console.log('❌ TEST FAILED: Item still exists or count unchanged');
            showMessage({
                message: 'Cart removal test failed',
                description: `Failed to remove item ${itemId}`,
                type: 'danger',
                icon: 'danger',
            });
        }

        console.log('----------------------------------------');

        return {
            success,
            reason: success ? 'Item removed successfully' : 'Item still exists after removal',
            debugInfo: {
                itemId,
                initialCount,
                finalCount,
                stillExists,
                countChanged: initialCount !== finalCount
            }
        };
    } catch (error) {
        console.error('Error in testCartRemoval:', error);
        showMessage({
            message: 'Cart removal test error',
            description: `${error}`,
            type: 'danger',
            icon: 'danger',
        });

        return {
            success: false,
            reason: 'Error during removal test',
            error
        };
    }
};

/**
 * Add test products to the cart for debugging purposes
 */
export const addTestProducts = (count = 1) => {
    try {
        const { addToCart } = useCartStore.getState();

        for (let i = 0; i < count; i++) {
            const testId = `test-${Date.now()}-${i}`;
            addToCart({
                id: testId,
                name: `Test Product ${i + 1}`,
                price: 9.99,
                image: 'https://via.placeholder.com/80x60.png?text=Test',
                portionsLeft: 5,
                pickupTime: '12:00 PM',
                location: {
                    restaurant: 'Test Restaurant',
                    address: 'Test Address'
                }
            });
        }

        showMessage({
            message: `Added ${count} test products to cart`,
            type: 'success',
            icon: 'success',
        });

        return true;
    } catch (error) {
        console.error('Error adding test products:', error);
        showMessage({
            message: 'Failed to add test products',
            description: `${error}`,
            type: 'danger',
            icon: 'danger',
        });

        return false;
    }
};
