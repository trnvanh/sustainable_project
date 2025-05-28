import { faker } from '@faker-js/faker';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { authenticate, client } from './axiosClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load category template
const categoriesTemplate = JSON.parse(
    readFileSync(join(__dirname, 'templates', 'Categories.json'), 'utf8')
);

// Create categories
async function createCategories() {
    console.log('Creating categories...');
    const categories = [];

    for (const category of categoriesTemplate.categories) {
        try {
            const response = await client.post('/api/v1/categories', category);
            if (response.data?.id) {
                categories.push(response.data);
                console.log(`✅ Created category: ${category.name} (ID: ${response.data.id})`);
            } else {
                console.warn(`⚠️ Created category without ID:`, response.data);
            }
        } catch (error) {
            console.error(`❌ Error creating category ${category.name}:`, error.response?.data || error.message);
        }
    }

    return categories;
}

// Create stores
async function createStores() {
    console.log('Creating stores...');
    const stores = [];
    const numStores = 5;
    const ownerId = 1; // Make sure this user ID exists in your DB

    for (let i = 0; i < numStores; i++) {
        const store = {
            name: `${faker.company.name()} ${faker.helpers.arrayElement(['Restaurant', 'Café', 'Bistro', 'Diner', 'Eatery'])}`,
            description: faker.company.catchPhrase(),
            address: faker.location.streetAddress() + ', ' + faker.location.city(),
            phoneNumber: faker.phone.number(),
            email: faker.internet.email(),
            website: faker.internet.url(),
            image: faker.image.url({ width: 640, height: 480, category: 'restaurant' }),
            rating: parseFloat(faker.number.float({ min: 3.0, max: 5.0, precision: 0.1 })),
            openingHours: `${faker.number.int({ min: 6, max: 11 })}:00-${faker.number.int({ min: 20, max: 23 })}:00`
        };

        try {
            const response = await client.post(`/api/v1/stores?ownerId=${ownerId}`, store);
            if (response.data?.id) {
                stores.push(response.data);
                console.log(`✅ Created store: ${store.name} (ID: ${response.data.id})`);
            } else {
                console.warn(`⚠️ Created store without ID:`, response.data);
            }
        } catch (error) {
            console.error(`❌ Error creating store ${store.name}:`, error.response?.data || error.message);
        }
    }

    return stores;
}

// Load products template
const productsTemplate = JSON.parse(
    readFileSync(join(__dirname, 'templates', 'Products.json'), 'utf8')
);

// Create products
async function createProducts(stores, categories) {
    console.log('Creating products...');
    const products = [];

    // Validate input arrays
    if (!Array.isArray(stores) || stores.length === 0) {
        throw new Error('No valid stores provided to createProducts');
    }
    if (!Array.isArray(categories) || categories.length === 0) {
        throw new Error('No valid categories provided to createProducts');
    }

    // Filter valid stores and categories
    const validStores = stores.filter(s => s && s.id);
    const validCategories = categories.filter(c => c && c.id);

    if (validStores.length === 0) throw new Error('No valid stores found');
    if (validCategories.length === 0) throw new Error('No valid categories found');

    // Helper function to get random items from array
    const getRandomItems = (array, min = 1, max = 3) => {
        const count = faker.number.int({ min, max });
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    // Helper function to create a product with random assignments
    const createProductData = (name, description, basePrice) => {
        // Get random store
        const store = faker.helpers.arrayElement(validStores);

        // Get 1-3 random categories
        const productCategories = getRandomItems(validCategories);

        return {
            name: name,
            description: description || faker.commerce.productDescription(),
            image: faker.image.url({ width: 640, height: 480, category: 'food' }),
            price: basePrice || parseFloat(faker.number.float({ min: 5.99, max: 25.99, precision: 0.01 })),
            pickupTime: `${faker.number.int({ min: 17, max: 20 })}:00-${faker.number.int({ min: 21, max: 23 })}:00`,
            portionsLeft: faker.number.int({ min: 1, max: 10 }),
            rating: parseFloat(faker.number.float({ min: 3.5, max: 5.0, precision: 0.1 })),
            distance: parseFloat(faker.number.float({ min: 0.5, max: 15.0, precision: 0.1 })),
            expiringDate: faker.date.soon({ days: 2 }).toISOString().split('T')[0],
            status: true,
            favourite: faker.number.int({ min: 0, max: 50 }),
            storeId: store.id,  // Send only the store ID, not the full store object
            categories: productCategories.map(cat => ({ id: cat.id }))  // Send only category IDs for proper mapping
        };
    };

    // First, create products from template
    for (const product of productsTemplate.products) {
        const productData = createProductData(product.name, product.description, product.price);

        try {
            const response = await client.post('/api/v1/products', productData);
            if (response.data?.id) {
                products.push(response.data);
                console.log(`✅ Created product: ${productData.name} (ID: ${response.data.id}) for store ID: ${productData.storeId}`);
            } else {
                console.warn(`⚠️ Created product without ID:`, response.data);
            }
        } catch (error) {
            console.error(`❌ Error creating product ${productData.name}:`, error.response?.data || error.message);
        }
    }

    // Create additional products with specific types
    const productTemplates = [
        {
            type: 'Main Dishes',
            items: [
                { name: 'Homemade Pasta' },
                { name: 'Grilled Salmon' },
                { name: 'Vegetarian Buddha Bowl' },
                { name: 'Classic Burger' },
                { name: 'Asian Stir-Fry' }
            ]
        },
        {
            type: 'Appetizers',
            items: [
                { name: 'Spring Rolls' },
                { name: 'Bruschetta' },
                { name: 'Fresh Salad' },
                { name: 'Soup of the Day' }
            ]
        },
        {
            type: 'Desserts',
            items: [
                { name: 'Tiramisu' },
                { name: 'Mango Sticky Rice' },
                { name: 'Fresh Fruit Tart' },
                { name: 'Chocolate Cake' }
            ]
        }
    ];

    // Create additional products based on templates
    for (const template of productTemplates) {
        for (const item of template.items) {
            const productData = createProductData(item.name);

            try {
                const response = await client.post('/api/v1/products', productData);
                if (response.data?.id) {
                    products.push(response.data);
                    console.log(`✅ Created product: ${productData.name} (ID: ${response.data.id}) for store ID: ${productData.storeId}`);
                } else {
                    console.warn(`⚠️ Created product without ID:`, response.data);
                }
            } catch (error) {
                console.error(`❌ Error creating product ${productData.name}:`, error.response?.data || error.message);
            }
        }
    }

    return products;
}

// Main runner
async function main() {
    try {
        // 🔐 Authenticate as a user (must match a real user in DB)
        await authenticate('admin@sustanable.com', 'Admin123!');
        const categories = await createCategories();
        const stores = await createStores();
        const products = await createProducts(stores, categories);

        console.log(`🎉 Done! Created ${categories.length} categories, ${stores.length} stores, and ${products.length} products.`);
    } catch (error) {
        console.error('❌ Error during generation:', error.message);
        process.exit(1);
    }
}

// Run the script
main();
