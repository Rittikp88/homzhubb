/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery } from '@redux-saga/core/effects';
import { OnboardingRepository } from '@homzhub/common/src/domain/repositories/onboarding/OnboardingRepository';
import { OnboardingActions, OnboardingActionTypes } from '@homzhub/common/src/modules/onboarding/actions';

function* getOnboardingDetails() {
  try {
    const data = yield call(OnboardingRepository.getDetails);
    yield put(OnboardingActions.getOnboardingSuccess(data.data));
  } catch (e) {
    yield put(OnboardingActions.getOnboardingFailure(e.message));
  }
}

export function* watchOnboarding() {
  yield takeEvery(OnboardingActionTypes.GET.ONBOARDING, getOnboardingDetails);
}
