/* eslint-disable @typescript-eslint/no-explicit-any */
import { all } from 'redux-saga/effects';
import { watchAsset } from '@homzhub/common/src/modules/asset/saga';
import { watchProperty } from '@homzhub/common/src/modules/property/saga';
import { watchSearch } from '@homzhub/common/src/modules/search/saga';
import { watchUser } from '@homzhub/common/src/modules/user/saga';
import { watchPortfolio } from '@homzhub/common/src/modules/portfolio/saga';
import { watchRecordAsset } from '@homzhub/common/src/modules/recordAsset/saga';

export default function* rootSaga(): any {
  yield all([watchUser(), watchProperty(), watchSearch(), watchAsset(), watchPortfolio(), watchRecordAsset()]);
}
