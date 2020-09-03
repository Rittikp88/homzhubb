import { put, takeEvery } from 'redux-saga/effects';
import PropertyDetails from '@homzhub/mobile/src/screens/Asset/Record/PropertyDetails';
import { ServicesData } from '@homzhub/common/src/mocks/ServiceData';
import { PropertyActionTypes } from '@homzhub/common/src/modules/property/actions';
import { RentServicesData } from '@homzhub/common/src/mocks/RentServices';
import { ServiceSteps } from '@homzhub/common/src/mocks/ServiceSteps';
import {
  getServiceDetails,
  getPropertyDetails,
  getRentServicesList,
  getServiceStepsDetails,
  watchProperty,
} from '@homzhub/common/src/modules/property/saga';

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

  it('should dispatch action "SERVICE_DETAILS_SUCCESS" and "SERVICE_DETAILS_FAILURE" with result from API', () => {
    const mockResponse = ServicesData;
    const mockError = 'Error';
    const generator = getServiceDetails({ type: PropertyActionTypes.GET.SERVICE_DETAILS_SUCCESS });
    generator.next();
    expect(generator.next(mockResponse).value).toEqual(
      put({ type: PropertyActionTypes.GET.SERVICE_DETAILS_SUCCESS, payload: ServicesData })
    );
    expect(generator.throw(new Error(mockError)).value).toEqual(
      put({ type: PropertyActionTypes.GET.SERVICE_DETAILS_FAILURE, error: 'Error' })
    );
  });

  it('should dispatch action "RENT_SERVICE_SUCCESS" and "RENT_SERVICE_FAILURE" with result from API', () => {
    const mockResponse = RentServicesData;
    const mockError = 'Error';
    const generator = getRentServicesList();
    generator.next();
    expect(generator.next(mockResponse).value).toEqual(
      put({ type: PropertyActionTypes.GET.RENT_SERVICE_LIST_SUCCESS, payload: RentServicesData })
    );
    expect(generator.throw(new Error(mockError)).value).toEqual(
      put({ type: PropertyActionTypes.GET.RENT_SERVICE_LIST_FAILURE, error: 'Error' })
    );
  });

  it('should dispatch action "SERVICE_STEPS_SUCCESS" and "SERVICE_STEPS_FAILURE" with result from API', () => {
    const mockResponse = ServiceSteps;
    const mockError = 'Error';
    const generator = getServiceStepsDetails({
      type: PropertyActionTypes.GET.SERVICE_STEPS_SUCCESS,
      payload: {
        serviceCategoryId: 1,
        serviceId: 1,
      },
    });
    generator.next();
    expect(generator.next(mockResponse).value).toEqual(
      put({ type: PropertyActionTypes.GET.SERVICE_STEPS_SUCCESS, payload: ServiceSteps })
    );
    expect(generator.throw(new Error(mockError)).value).toEqual(
      put({ type: PropertyActionTypes.GET.SERVICE_STEPS_FAILURE, error: 'Error' })
    );
  });

  it('should be done on next iteration', () => {
    const generator = watchProperty();
    expect(generator.next().value).toEqual(takeEvery(PropertyActionTypes.GET.PROPERTY_DETAILS, getPropertyDetails));
    expect(generator.next().value).toEqual(takeEvery(PropertyActionTypes.GET.RENT_SERVICE_LIST, getRentServicesList));
    expect(generator.next().value).toEqual(takeEvery(PropertyActionTypes.GET.SERVICE_DETAILS, getServiceDetails));
    expect(generator.next().value).toEqual(takeEvery(PropertyActionTypes.GET.SERVICE_STEPS, getServiceStepsDetails));
    expect(generator.next().done).toBeTruthy();
  });
});
