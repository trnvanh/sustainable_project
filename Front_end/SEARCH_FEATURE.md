# Search Feature Documentation

The search feature in the sustainable app allows users to find products using different search methods.

## Basic Search

The basic search allows users to search for products by entering keywords. Search results will update as you type, with a brief delay to avoid making too many API requests.

## Advanced Search

The advanced search provides more filtering options:

1. **Price Range**: Filter products by minimum and maximum price
2. **Categories**: Filter products by category
3. **Sorting Options**: Sort results by price, distance, or rating in ascending or descending order

## Search API Endpoints

The app uses the following API endpoints for search:

- `/products/search?q=SEARCH_TERM` - Basic search with keyword
- `/products/search?name=SEARCH_TERM` - Search by product name
- `/products/search?description=SEARCH_TERM` - Search by product description
- `/products/search?store=SEARCH_TERM` - Search by store name
- `/products/search/advanced?q=SEARCH_TERM&categoryId=ID&minPrice=MIN&maxPrice=MAX&sortBy=FIELD&sortOrder=ORDER` - Advanced search with multiple parameters

## How to Use

1. Navigate to the search screen by tapping the search bar on the Explore page
2. Enter your search query in the search bar
3. For more filtering options, tap "Advanced Search"
4. Apply filters as needed and tap "Apply Filters"
5. Tap on any search result to view product details

## Features

- Debounced search to reduce API calls
- Recent search suggestions
- Popular search suggestions
- Advanced filtering and sorting
- Clear visual feedback during search operations
