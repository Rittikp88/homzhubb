import { put, takeEvery } from 'redux-saga/effects';
import PropertyDetails from '@homzhub/mobile/src/screens/Asset/Record/PropertyDetails';
import { PropertyActionTypes } from '@homzhub/common/src/modules/property/actions';
import { getPropertyDetails, watchProperty } from '@homzhub/common/src/modules/property/saga';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe.skip('fetchAuthorsFromApi', () => {
  it('should dispatch action "PROPERTY_DETAILS_SUCCESS" and "PROPERTY_DETAILS_FAILURE" with result from API', () => {
    const mockResponse = PropertyDetails;
    const mockError = 'Error';
    const generator = getPropertyDetails();
    generator.next();
    expect(generator.next(mockResponse).value).toEqual(
      put({ type: PropertyActionTypes.GET.PROPERTY_DETAILS_SUCCESS, payload: PropertyDetails })
    );
    expect(generator.throw(new Error(mockError)).value).toEqual(
      put({ type: PropertyActionTypes.GET.PROPERTY_DETAILS_FAILURE, error: 'Error' })
    );
  });

  it('should be done on next iteration', () => {
    const generator = watchProperty();
    expect(generator.next().value).toEqual(takeEvery(PropertyActionTypes.GET.PROPERTY_DETAILS, getPropertyDetails));
    expect(generator.next().done).toBeTruthy();
  });
});
