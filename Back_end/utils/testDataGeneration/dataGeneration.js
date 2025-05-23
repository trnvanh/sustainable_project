const fs = require('fs');
const path = require('path');
const { faker } = require('@faker-js/faker');
const axios = require('axios');

// Create axios client
const client = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Read the template
const productsTemplate = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'templates', 'Products.json'), 'utf8')
);

function generateRandomProduct() {
    const restaurantTypes = ['Restaurant', 'Café', 'Bistro', 'Diner', 'Eatery'];
    const cuisineTypes = ['Italian', 'Japanese', 'Thai', 'Mexican', 'Indian', 'American', 'Chinese'];

    return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        image: faker.image.url({ width: 640, height: 480, category: 'food' }),
        price: faker.commerce.price({ min: 5, max: 30, dec: 2 }), // BigDecimal in Java
        pickupTime: `${faker.number.int({ min: 17, max: 20 })}:00-${faker.number.int({ min: 21, max: 23 })}:00`,
        distance: parseFloat(faker.number.float({ min: 0.1, max: 5.0, precision: 0.1 })),
        portionsLeft: faker.number.int({ min: 1, max: 10 }),
        rating: parseFloat(faker.number.float({ min: 3.0, max: 5.0, precision: 0.1 })),
        expiringDate: new Date(faker.date.soon({ days: 2 })).toISOString(), // Date in Java
        status: true,
        favourite: faker.number.int({ min: 0, max: 100 }),
        location: {
            restaurant: `${faker.company.name()} ${restaurantTypes[faker.number.int({ min: 0, max: 4 })]}`,
            address: faker.location.streetAddress() + ', ' + faker.location.city()
        }
    };
}

// Generate random products
function generateProducts(count) {
    const products = [];

    // Add template products first but convert the date format
    products.push(...productsTemplate.products.map(product => ({
        ...product,
        expiringDate: new Date(product.expiringDate).toISOString() // Convert string date to ISO format
    })));

    // Generate additional random products
    for (let i = 0; i < count - productsTemplate.products.length; i++) {
        products.push(generateRandomProduct());
    }

    return products;
}

// Main execution
async function main() {
    try {
        const totalProductsToGenerate = 20; // Adjust this number as needed
        console.log(`Generating ${totalProductsToGenerate} products...`);

        const products = generateProducts(totalProductsToGenerate);
        console.log('Products generated, uploading to server...');

        const response = await client.post('/api/v1/products/batch', products);
        console.log(`Successfully created ${response.data.length} products`);
        console.log('Data generation completed successfully!');
    } catch (error) {
        console.error('Error in data generation:', error);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main();
}