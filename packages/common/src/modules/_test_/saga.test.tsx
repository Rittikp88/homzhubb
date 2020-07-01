import { all } from 'redux-saga/effects';
import rootSaga from '@homzhub/common/src/modules/sagas';
import { watchProperty } from '@homzhub/common/src/modules/property/saga';
import { watchUser } from '@homzhub/common/src/modules/user/saga';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

it('The root saga should react to actions', () => {
  const generator = rootSaga();
  expect(generator.next().value).toEqual(all([watchUser(), watchProperty()]));
  expect(generator.next().done).toBeTruthy();
});
