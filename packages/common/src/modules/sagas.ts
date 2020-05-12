/* eslint-disable @typescript-eslint/no-explicit-any */

import { all } from 'redux-saga/effects';
import { OwnerSaga } from './owner/saga';

// TODO: For reference (remove)

export default function* rootSaga(): any {
  yield all([OwnerSaga.watchCart()]);
}
