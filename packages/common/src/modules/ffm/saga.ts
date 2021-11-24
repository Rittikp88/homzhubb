/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeLatest } from '@redux-saga/core/effects';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FFMRepository } from '@homzhub/common/src/domain/repositories/FFMRepository';
import { FFMActions, FFMActionTypes } from '@homzhub/common/src/modules/ffm/actions';
import { OnBoarding } from '@homzhub/common/src/domain/models/OnBoarding';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { VoidGenerator } from '@homzhub/common/src/modules/interfaces';

export function* getOnBoardingData(): VoidGenerator {
  try {
    const response = yield call(FFMRepository.getOnBoarding);
    yield put(FFMActions.getOnBoardingDataSuccess(response as OnBoarding[]));
  } catch (e) {
    console.log(JSON.stringify(e.message));
    yield put(FFMActions.getOnBoardingDataFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}
export function* getRoles(): VoidGenerator {
  try {
    const response = yield call(FFMRepository.getRoles);
    yield put(FFMActions.getRolesSuccess(response as Unit[]));
  } catch (e) {
    yield put(FFMActions.getRolesFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}
export function* watchFFM() {
  yield takeLatest(FFMActionTypes.GET.ONBOARDING, getOnBoardingData);
  yield takeLatest(FFMActionTypes.GET.ROLES, getRoles);
}
