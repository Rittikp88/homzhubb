/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { takeEvery, call, put } from 'redux-saga/effects';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { CommonActionTypes, CommonActions } from '@homzhub/common/src/modules/common/actions';

function* getCountries() {
  try {
    const response = yield call(CommonRepository.getCountryCodes);
    yield put(CommonActions.getCountriesSuccess(response));
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error });
  }
}

export function* watchCommonActions() {
  yield takeEvery(CommonActionTypes.GET.COUNTRIES, getCountries);
}
