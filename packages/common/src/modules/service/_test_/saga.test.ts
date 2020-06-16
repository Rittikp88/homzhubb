import { takeEvery } from '@redux-saga/core/effects';
import { ServiceActionTypes } from '@homzhub/common/src/modules/service/actions';
import { getServiceDetails, getServiceStepsDetails, watchService } from '@homzhub/common/src/modules/service/saga';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('SAGAS', () => {
  it('should dispatch action "SERVICE_DETAILS" ', () => {
    const generator = watchService();
    expect(generator.next().value).toEqual(takeEvery(ServiceActionTypes.GET.SERVICE_DETAILS, getServiceDetails));
    expect(generator.next().value).toEqual(takeEvery(ServiceActionTypes.GET.SERVICE_STEPS, getServiceStepsDetails));
    expect(generator.next().done).toBeTruthy();
  });
});
