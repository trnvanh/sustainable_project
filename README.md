# HeroEats

A mobile app for rescuing food and reducing waste

HeroEats is a mobile application that connects users with local restaurants, cafés, and stores offering surplus or near-expiry food at discounted prices. The app encourages sustainable consumption, reduces food waste, and promotes eco-friendly eating habits.

## Features

🔍 Explore & Search: Browse food items by category, apply filters (price, distance, rating).

🛒 Orders & Cart: Add items to your cart, checkout with PayPal or Stripe, track order history.

❤️ Favorites: Save favorite items and restaurants for quick access.

👤 Profile: Manage profile, credits, settings, and order history.

🌙 Dark / Light Mode: Choose your preferred theme.

Advanced: Image handling, localization, authentication, etc.

## App Screens

Welcome Screen: Simple animation & logo, auto-login redirect.

Login/Register: Minimal form with eco-friendly UI.

Explore: Product grid with filters and search.

My Orders: Active and completed orders in tab views.

Favorites: List of saved items & restaurants.

Cart: Review, modify, and checkout items.

Profile: Avatar, credits, settings, logout.

## Tech Stack

Frontend: React Native (Expo), TypeScript, Tailwind, Axios

Backend: Java (Spring Boot)

Database: MySQL + AsyncStorage

Payments: PayPal & Stripe

## Architecture

Frontend: Modular React Native + Expo app with reusable UI components.

Backend: Spring Boot service with modular, testable structure and payment integration.

Data: MySQL for persistent storage, AsyncStorage for local caching.

## Installation

Clone the repo:

git clone https://github.com/trnvanh/sustainable_project.git


Move to the frontend:

cd sustainable_project/Front_end


Install dependencies:

npm install


Run the app:

npx expo start


Test on emulator or at localhost:8081/.

## Testing steps

Verify login/register flow

Navigate between tabs (Explore, Orders, Favorites, Cart, Profile)

Search items and apply filters

Add to cart and proceed to checkout

Save/remove favorites

## Team HeroEaters

Anh Tran – UI/UX, Figma design, frontend views (Welcome, Login, Explore, Favorite, Profile)

Tuan Nguyen – Backend & database, frontend views (Orders, Cart, payment, history)

Sang Nguyen – Frontend APIs, data integration, loading indicators, video

## License

This project is part of the COMP.SE.221 – Sustainable Software Engineering course, Spring 2025 implementation.
