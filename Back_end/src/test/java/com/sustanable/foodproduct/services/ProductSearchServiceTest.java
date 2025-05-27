package com.sustanable.foodproduct.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.sustanable.foodproduct.entities.CategoryEntity;
import com.sustanable.foodproduct.entities.ProductEntity;
import com.sustanable.foodproduct.entities.StoreEntity;
import com.sustanable.foodproduct.repositories.ProductRepository;
import com.sustanable.foodproduct.services.impl.ProductServiceImpl;

@ExtendWith(MockitoExtension.class)
class ProductSearchServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    private ProductEntity product1;
    private ProductEntity product2;
    private ProductEntity product3;
    private StoreEntity store1;
    private StoreEntity store2;
    private CategoryEntity category1;

    @BeforeEach
    void setUp() {
        // Setup test stores
        store1 = new StoreEntity();
        store1.setId(1L);
        store1.setName("Organic Store");

        store2 = new StoreEntity();
        store2.setId(2L);
        store2.setName("Fresh Market");

        // Setup test category
        category1 = new CategoryEntity();
        category1.setId(1L);
        category1.setName("Fruits");

        // Setup test products
        product1 = new ProductEntity();
        product1.setId(1L);
        product1.setName("Organic Apples");
        product1.setDescription("Fresh organic apples from local farms");
        product1.setPrice(new BigDecimal("5.99"));
        product1.setStore(store1);
        product1.setCategories(Set.of(category1));
        product1.setStatus(true);

        product2 = new ProductEntity();
        product2.setId(2L);
        product2.setName("Green Bananas");
        product2.setDescription("Premium green bananas");
        product2.setPrice(new BigDecimal("3.49"));
        product2.setStore(store2);
        product2.setCategories(Set.of(category1));
        product2.setStatus(true);

        product3 = new ProductEntity();
        product3.setId(3L);
        product3.setName("Tomatoes");
        product3.setDescription("Organic red tomatoes");
        product3.setPrice(new BigDecimal("7.99"));
        product3.setStore(store1);
        product3.setCategories(Set.of(category1));
        product3.setStatus(true);
    }

    @Test
    void testSearchProductsByName_ReturnsMatchingProducts() {
        // Given
        String searchName = "apple";
        when(productRepository.findByNameContainingIgnoreCase(searchName))
                .thenReturn(Arrays.asList(product1));

        // When
        List<ProductEntity> result = productService.searchProductsByName(searchName);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Organic Apples", result.get(0).getName());
    }

    @Test
    void testSearchProductsByName_EmptyString_ReturnsAllProducts() {
        // Given
        when(productRepository.findAll()).thenReturn(Arrays.asList(product1, product2, product3));

        // When
        List<ProductEntity> result = productService.searchProductsByName("");

        // Then
        assertNotNull(result);
        assertEquals(3, result.size());
    }

    @Test
    void testSearchProductsByDescription_ReturnsMatchingProducts() {
        // Given
        String searchDescription = "organic";
        when(productRepository.findByDescriptionContainingIgnoreCase(searchDescription))
                .thenReturn(Arrays.asList(product1, product3));

        // When
        List<ProductEntity> result = productService.searchProductsByDescription(searchDescription);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.contains(product1));
        assertTrue(result.contains(product3));
    }

    @Test
    void testSearchProducts_GeneralSearch_ReturnsMatchingProducts() {
        // Given
        String searchTerm = "organic";
        when(productRepository.findByNameOrDescriptionContainingIgnoreCase(searchTerm))
                .thenReturn(Arrays.asList(product1, product3));

        // When
        List<ProductEntity> result = productService.searchProducts(searchTerm);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.contains(product1));
        assertTrue(result.contains(product3));
    }

    @Test
    void testSearchProductsByStore_ReturnsMatchingProducts() {
        // Given
        String storeName = "Organic Store";
        when(productRepository.findByStoreNameContainingIgnoreCase(storeName))
                .thenReturn(Arrays.asList(product1, product3));

        // When
        List<ProductEntity> result = productService.searchProductsByStore(storeName);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.contains(product1));
        assertTrue(result.contains(product3));
    }

    @Test
    void testAdvancedSearchProducts_WithAllFilters_ReturnsMatchingProducts() {
        // Given
        String searchTerm = "organic";
        Long categoryId = 1L;
        BigDecimal minPrice = new BigDecimal("5.00");
        BigDecimal maxPrice = new BigDecimal("10.00");

        when(productRepository.searchProducts(searchTerm, categoryId, minPrice, maxPrice))
                .thenReturn(Arrays.asList(product1, product3));

        // When
        List<ProductEntity> result = productService.advancedSearchProducts(searchTerm, categoryId, minPrice, maxPrice);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.contains(product1));
        assertTrue(result.contains(product3));
    }

    @Test
    void testAdvancedSearchProducts_InvalidPriceRange_ThrowsException() {
        // Given
        String searchTerm = "organic";
        Long categoryId = 1L;
        BigDecimal minPrice = new BigDecimal("10.00");
        BigDecimal maxPrice = new BigDecimal("5.00");

        // When & Then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> productService.advancedSearchProducts(searchTerm, categoryId, minPrice, maxPrice));

        assertEquals("Minimum price cannot be greater than maximum price", exception.getMessage());
    }

    @Test
    void testAdvancedSearchProducts_OnlySearchTerm_ReturnsMatchingProducts() {
        // Given
        String searchTerm = "banana";
        when(productRepository.searchProducts(searchTerm, null, null, null))
                .thenReturn(Arrays.asList(product2));

        // When
        List<ProductEntity> result = productService.advancedSearchProducts(searchTerm, null, null, null);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Green Bananas", result.get(0).getName());
    }

    @Test
    void testSearchProductsByName_NullInput_ReturnsAllProducts() {
        // Given
        when(productRepository.findAll()).thenReturn(Arrays.asList(product1, product2, product3));

        // When
        List<ProductEntity> result = productService.searchProductsByName(null);

        // Then
        assertNotNull(result);
        assertEquals(3, result.size());
    }

    @Test
    void testSearchProducts_NullInput_ReturnsAllProducts() {
        // Given
        when(productRepository.findAll()).thenReturn(Arrays.asList(product1, product2, product3));

        // When
        List<ProductEntity> result = productService.searchProducts(null);

        // Then
        assertNotNull(result);
        assertEquals(3, result.size());
    }
}
