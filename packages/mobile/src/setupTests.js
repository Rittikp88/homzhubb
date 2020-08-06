/* eslint-disable */
// @ts-nocheck
const { PERMISSIONS, RESULTS } = require('react-native-permissions/lib/commonjs/constants');
require('../../../setupTests');

// To prevent errors from cross platform imports
jest.mock('@react-native-community/google-signin', () => {});
jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@ptomasroos/react-native-multi-slider', () => {});
jest.mock('react-native-orientation-locker', () => {});
jest.mock('@react-native-community/geolocation', () => {});
jest.mock('react-native-progress', () => {});
jest.mock('react-native-permissions', () => {
  return {
    request: jest.fn(),
    check: jest.fn(),
    RESULTS,
    PERMISSIONS,
  };
});
