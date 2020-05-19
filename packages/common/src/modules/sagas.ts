/* eslint-disable @typescript-eslint/no-explicit-any */
import { all } from 'redux-saga/effects';
import { watchOwner } from '@homzhub/common/src/modules/owner/saga';
import { watchOnboarding } from '@homzhub/common/src/modules/onboarding/saga';
import { watchUser } from '@homzhub/common/src/modules/user/saga';

export default function* rootSaga(): any {
  yield all([watchOwner(), watchOnboarding(), watchUser()]);
}
