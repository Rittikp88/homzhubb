/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery } from '@redux-saga/core/effects';
import { OnBoardingRepository } from '@homzhub/common/src/domain/repositories/OnBoardingRepository';
import { OnBoardingActions, OnboardingActionTypes } from '@homzhub/common/src/modules/onboarding/actions';

function* getOnBoardingDetails() {
  try {
    const data = yield call(OnBoardingRepository.getDetails);
    yield put(OnBoardingActions.getOnBoardingSuccess(data.data));
  } catch (e) {
    yield put(OnBoardingActions.getOnBoardingFailure(e.message));
  }
}

export function* watchOnBoarding() {
  yield takeEvery(OnboardingActionTypes.GET.ONBOARDING, getOnBoardingDetails);
}
