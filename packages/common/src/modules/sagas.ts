/* eslint-disable @typescript-eslint/no-explicit-any */
import { all } from 'redux-saga/effects';
import { watchOnBoarding } from '@homzhub/common/src/modules/onboarding/saga';
import { watchUser } from '@homzhub/common/src/modules/user/saga';
import { watchProperty } from '@homzhub/common/src/modules/property/saga';

export default function* rootSaga(): any {
  yield all([watchOnBoarding(), watchUser(), watchProperty()]);
}
