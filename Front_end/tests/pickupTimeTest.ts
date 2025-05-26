/**
 * Test script to demonstrate the new pickup time functionality
 */

// Function to test pickup time generation
export const testPickupTimeGeneration = () => {
    console.log('=== Pickup Time Generation Test ===');

    const now = new Date();
    const oneHourLater = new Date(Date.now() + 60 * 60 * 1000);

    console.log('Current time:', now.toISOString());
    console.log('Pickup time (1 hour later):', oneHourLater.toISOString());
    console.log('Time difference in minutes:', (oneHourLater.getTime() - now.getTime()) / (1000 * 60));

    // Test with different scenarios
    const scenarios = [
        { name: 'Immediate order', offset: 0 },
        { name: '30 minutes later', offset: 30 * 60 * 1000 },
        { name: '1 hour later (default)', offset: 60 * 60 * 1000 },
        { name: '2 hours later', offset: 2 * 60 * 60 * 1000 },
    ];

    console.log('\n=== Different Pickup Time Scenarios ===');
    scenarios.forEach(scenario => {
        const pickupTime = new Date(Date.now() + scenario.offset);
        console.log(`${scenario.name}: ${pickupTime.toISOString()}`);
    });

    return oneHourLater.toISOString();
};

// Function to validate pickup time format
export const validatePickupTimeFormat = (pickupTime: string): boolean => {
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
    const isValid = iso8601Regex.test(pickupTime);

    console.log(`Validating pickup time: ${pickupTime}`);
    console.log(`Format is valid: ${isValid}`);

    if (isValid) {
        const date = new Date(pickupTime);
        const now = new Date();
        const timeDiff = date.getTime() - now.getTime();

        console.log(`Pickup time is ${timeDiff > 0 ? 'in the future' : 'in the past'}`);
        console.log(`Time difference: ${Math.round(timeDiff / (1000 * 60))} minutes`);
    }

    return isValid;
};

// Example usage
if (typeof window !== 'undefined') {
    // Browser environment
    console.log('Testing pickup time generation in browser...');
    testPickupTimeGeneration();

    // Test validation
    const testTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    validatePickupTimeFormat(testTime);
}
