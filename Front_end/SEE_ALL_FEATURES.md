# See All Screen Features

This document outlines the features implemented in the "See All" screen of the sustainable project.

## Features

### 1. Grid View Layout
- Displays products in a responsive grid layout
- Uses custom `GridOfferCard` component for consistent item display
- Shows relevant product information (name, price, rating, distance, pickup time)

### 2. Search Functionality
- Real-time search within the displayed items
- Searches by name, description, restaurant name, and address
- Clear button to reset search query

### 3. Sorting Options
- Sort by price (ascending/descending)
- Sort by rating (ascending/descending)
- Sort by distance (ascending/descending)
- Visual indicators for active sort and direction

### 4. Category Filtering
- Filter products by category
- Toggle between categories with visual selection indicators
- "All" option to view all products

### 5. Pagination
- Automatically loads more items when scrolling to the bottom
- Loading indicator during pagination
- Smart page reset when filters change

### 6. Favorite Actions
- Toggle favorite status directly from the grid view
- Heart icon shows current favorite status
- Visual feedback with animation when toggling
- Server synchronization on toggle

### 7. Pull-to-Refresh
- Pull down to refresh the data
- Visual indicator during refresh operation
- Maintains current filters and sorting after refresh

## Usage

The See All screen can be accessed from:
1. The Explore screen by tapping "See All" on any section
2. The Favorites screen by tapping "See All"

## Navigation
The screen accepts parameters:
- `title`: Display title for the screen
- `type`: Data source type ('historyOrders', 'nearbyOffers', 'currentDeals', 'categoryProducts', 'favorites')
- `categoryId`: Optional ID for category-specific views

## Future Enhancements
- Advanced filtering options (price range, distance range)
- Map view toggle for location-based items
- Customizable grid/list view switching
- Server-side pagination for extremely large datasets
