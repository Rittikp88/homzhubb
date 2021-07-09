/* eslint-disable @typescript-eslint/no-explicit-any */
import { all } from 'redux-saga/effects';
import { watchAsset } from '@homzhub/common/src/modules/asset/saga';
import { watchCommonActions } from '@homzhub/common/src/modules/common/saga';
import { watchFinancials } from '@homzhub/common/src/modules/financials/saga';
import { watchOffer } from '@homzhub/common/src/modules/offers/saga';
import { watchPortfolio } from '@homzhub/common/src/modules/portfolio/saga';
import { watchRecordAsset } from '@homzhub/common/src/modules/recordAsset/saga';
import { watchSearch } from '@homzhub/common/src/modules/search/saga';
import { watchTicket } from '@homzhub/common/src/modules/tickets/saga';
import { watchUser } from '@homzhub/common/src/modules/user/saga';

export default function* rootSaga(): any {
  yield all([
    watchUser(),
    watchSearch(),
    watchAsset(),
    watchPortfolio(),
    watchRecordAsset(),
    watchTicket(),
    watchOffer(),
    watchCommonActions(),
    watchFinancials(),
  ]);
}
