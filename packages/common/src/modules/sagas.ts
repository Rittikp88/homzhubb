/* eslint-disable @typescript-eslint/no-explicit-any */
import { all } from 'redux-saga/effects';
import { watchUser } from '@homzhub/common/src/modules/user/saga';
import { watchProperty } from '@homzhub/common/src/modules/property/saga';
import { watchSearch } from '@homzhub/common/src/modules/search/saga';

export default function* rootSaga(): any {
  yield all([watchUser(), watchProperty(), watchSearch()]);
}
