// @ts-nocheck
/* eslint-disable import/no-unresolved */
import { GeolocationService } from '@homzhub/common/src/services/Geolocation/GeolocationService';
import { Geolocation } from '@homzhub/common/src/services/Geolocation/index';

jest.mock('@homzhub/common/src/services/Geolocation/index', () => {
  return {
    Geolocation: {
      getCurrentPosition: jest.fn(),
    },
  };
});

describe('Geolocation Service', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  const success = jest.fn();
  const error = jest.fn();

  it('Should fetch geolocation data and invoke the success callback', () => {
    Geolocation.getCurrentPosition.mockImplementation((successCallback, errorCallback) => {
      successCallback();
    });
    GeolocationService.getCurrentPosition(success, error);
    expect(success).toHaveBeenCalled();
  });

  it('Should fetch geolocation data and invoke the error callback in case of errors', () => {
    Geolocation.getCurrentPosition.mockImplementation((successCallback, errorCallback) => {
      errorCallback();
    });
    GeolocationService.getCurrentPosition(success, error);
    expect(error).toHaveBeenCalled();
  });
});
