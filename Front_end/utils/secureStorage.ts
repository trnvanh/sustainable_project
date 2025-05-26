import * as SecureStore from 'expo-secure-store';

/**
 * Utility module for securely storing, retrieving, and removing key-value pairs
 * using the SecureStore API. This module provides an abstraction layer to
 * interact with secure storage in an asynchronous manner.
 *
 * Functions:
 * - `getItem`: Retrieves a value associated with a given key from secure storage.
 * - `setItem`: Stores a key-value pair in secure storage.
 * - `removeItem`: Deletes a key-value pair from secure storage.
 *
 * Usage:
 * Import this module and use the provided methods to interact with secure storage.
 *
 * Note:
 * Ensure that the SecureStore API is properly configured and available in your
 * project before using this utility.
 */
export const secureStorage = {
  getItem: async (key: string) => {
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  },
};
