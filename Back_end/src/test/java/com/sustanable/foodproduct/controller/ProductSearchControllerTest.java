package com.sustanable.foodproduct.controller;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.sustanable.foodproduct.entities.CategoryEntity;
import com.sustanable.foodproduct.entities.ProductEntity;
import com.sustanable.foodproduct.entities.StoreEntity;

@WebMvcTest(ProductController.class)
@Import(TestSecurityConfig.class)
class ProductSearchControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private ProductEntity product1;
    private ProductEntity product2;
    private StoreEntity store;
    private CategoryEntity category;

    @BeforeEach
    void setUp() {
        // Setup test data
        store = new StoreEntity();
        store.setId(1L);
        store.setName("Test Store");

        category = new CategoryEntity();
        category.setId(1L);
        category.setName("Test Category");

        product1 = new ProductEntity();
        product1.setId(1L);
        product1.setName("Organic Apples");
        product1.setDescription("Fresh organic apples");
        product1.setPrice(new BigDecimal("5.99"));
        product1.setStore(store);
        product1.setCategories(Set.of(category));
        product1.setStatus(true);
        product1.setFavourite(5L);

        product2 = new ProductEntity();
        product2.setId(2L);
        product2.setName("Green Bananas");
        product2.setDescription("Premium bananas");
        product2.setPrice(new BigDecimal("3.49"));
        product2.setStore(store);
        product2.setCategories(Set.of(category));
        product2.setStatus(true);
        product2.setFavourite(3L);
    }

    @Test
    @WithMockUser
    void testSearchProducts_WithQueryParam_ReturnsProducts() throws Exception {
        // Given
        when(productService.searchProducts("apple")).thenReturn(Arrays.asList(product1));
        when(productService.isFavorited(1L, 1)).thenReturn(false);

        // When & Then
        mockMvc.perform(get("/api/v1/products/search")
                .param("q", "apple")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Organic Apples"))
                .andExpect(jsonPath("$[0].description").value("Fresh organic apples"))
                .andExpect(jsonPath("$[0].price").value(5.99))
                .andExpect(jsonPath("$[0].favoriteCount").value(5))
                .andExpect(jsonPath("$[0].favorited").value(false));
    }

    @Test
    @WithMockUser
    void testSearchProducts_WithNameParam_ReturnsProducts() throws Exception {
        // Given
        when(productService.searchProductsByName("apple")).thenReturn(Arrays.asList(product1));
        when(productService.isFavorited(1L, 1)).thenReturn(true);

        // When & Then
        mockMvc.perform(get("/api/v1/products/search")
                .param("name", "apple")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Organic Apples"))
                .andExpect(jsonPath("$[0].favorited").value(true));
    }

    @Test
    @WithMockUser
    void testSearchProducts_WithDescriptionParam_ReturnsProducts() throws Exception {
        // Given
        when(productService.searchProductsByDescription("organic")).thenReturn(Arrays.asList(product1));
        when(productService.isFavorited(1L, 1)).thenReturn(false);

        // When & Then
        mockMvc.perform(get("/api/v1/products/search")
                .param("description", "organic")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Organic Apples"));
    }

    @Test
    @WithMockUser
    void testSearchProducts_WithStoreParam_ReturnsProducts() throws Exception {
        // Given
        when(productService.searchProductsByStore("Test Store")).thenReturn(Arrays.asList(product1, product2));
        when(productService.isFavorited(anyLong(), anyInt())).thenReturn(false);

        // When & Then
        mockMvc.perform(get("/api/v1/products/search")
                .param("store", "Test Store")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpected(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @WithMockUser
    void testSearchProducts_NoParams_ReturnsAllProducts() throws Exception {
        // Given
        when(productService.getAllProducts()).thenReturn(Arrays.asList(product1, product2));
        when(productService.isFavorited(anyLong(), anyInt())).thenReturn(false);

        // When & Then
        mockMvc.perform(get("/api/v1/products/search")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @WithMockUser
    void testAdvancedSearchProducts_WithAllParams_ReturnsProducts() throws Exception {
        // Given
        when(productService.advancedSearchProducts(
                eq("organic"),
                eq(1L),
                eq(new BigDecimal("5.00")),
                eq(new BigDecimal("10.00")))).thenReturn(Arrays.asList(product1));
        when(productService.isFavorited(1L, 1)).thenReturn(false);

        // When & Then
        mockMvc.perform(get("/api/v1/products/search/advanced")
                .param("q", "organic")
                .param("categoryId", "1")
                .param("minPrice", "5.00")
                .param("maxPrice", "10.00")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpected(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Organic Apples"));
    }

    @Test
    @WithMockUser
    void testAdvancedSearchProducts_OnlySearchTerm_ReturnsProducts() throws Exception {
        // Given
        when(productService.advancedSearchProducts(
                eq("banana"),
                isNull(),
                isNull(),
                isNull())).thenReturn(Arrays.asList(product2));
        when(productService.isFavorited(2L, 1)).thenReturn(true);

        // When & Then
        mockMvc.perform(get("/api/v1/products/search/advanced")
                .param("q", "banana")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Green Bananas"))
                .andExpect(jsonPath("$[0].favorited").value(true));
    }

    @Test
    @WithMockUser
    void testAdvancedSearchProducts_NoParams_ReturnsAllProducts() throws Exception {
        // Given
        when(productService.advancedSearchProducts(
                isNull(),
                isNull(),
                isNull(),
                isNull())).thenReturn(Arrays.asList(product1, product2));
        when(productService.isFavorited(anyLong(), anyInt())).thenReturn(false);

        // When & Then
        mockMvc.perform(get("/api/v1/products/search/advanced")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2));
    }
}
