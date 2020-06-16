import { takeEvery, put } from '@redux-saga/core/effects';
import { ServiceActionTypes } from '@homzhub/common/src/modules/service/actions';
import { getServiceDetails, getServiceStepsDetails, watchService } from '@homzhub/common/src/modules/service/saga';
import { ServicesData } from '@homzhub/common/src/mocks/ServiceData';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('SAGAS', () => {
  it('should dispatch action "SERVICE_DETAILS" ', () => {
    const generator = watchService();
    expect(generator.next().value).toEqual(takeEvery(ServiceActionTypes.GET.SERVICE_DETAILS, getServiceDetails));
    expect(generator.next().value).toEqual(takeEvery(ServiceActionTypes.GET.SERVICE_STEPS, getServiceStepsDetails));
    expect(generator.next().done).toBeTruthy();
  });

  it('should dispatch action "SERVICE_DETAILS_SUCCESS" with result from API', () => {
    const mockResponse = ServicesData;
    const generator = getServiceDetails();
    generator.next();
    expect(generator.next(mockResponse).value).toEqual(
      put({ type: ServiceActionTypes.GET.SERVICE_DETAILS_SUCCESS, payload: ServicesData })
    );
  });
});
