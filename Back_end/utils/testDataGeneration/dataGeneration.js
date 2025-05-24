import { faker } from '@faker-js/faker';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {authenticate, client} from './axiosClient.js';

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


// Main runner
async function main() {
    try {
        // 🔐 Authenticate as a user (must match a real user in DB)
        await authenticate('admin@sustanable.com', 'Admin123!');
        const categories = await createCategories();
        const stores = await createStores();

        const outputDir = join(__dirname, 'generated');
        if (!existsSync(outputDir)) {
            mkdirSync(outputDir);
        }

        writeFileSync(join(outputDir, 'categories.json'), JSON.stringify(categories, null, 2));
        writeFileSync(join(outputDir, 'stores.json'), JSON.stringify(stores, null, 2));

        console.log(`🎉 Done! Created ${categories.length} categories and ${stores.length} stores.`);
    } catch (error) {
        console.error('❌ Error during generation:', error.message);
        process.exit(1);
    }
}

// Run the script
main();
