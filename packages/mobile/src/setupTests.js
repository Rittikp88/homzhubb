/* eslint-disable */
// @ts-nocheck
require('../../../setupTests');

// To prevent errors from cross platform imports
jest.mock('@react-native-community/google-signin', () => {});
jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
