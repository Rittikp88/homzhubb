/* eslint-disable @typescript-eslint/no-explicit-any */
import { all } from 'redux-saga/effects';
import { watchOnBoarding } from '@homzhub/common/src/modules/onboarding/saga';
import { watchUser } from '@homzhub/common/src/modules/user/saga';

export default function* rootSaga(): any {
  yield all([watchOnBoarding(), watchUser()]);
}
