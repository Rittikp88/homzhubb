import { combineReducers } from 'redux';
import { assetReducer } from '@homzhub/common/src/modules/asset/reducer';
import { commonReducer } from '@homzhub/common/src/modules/common/reducer';
import { offerReducer } from '@homzhub/common/src/modules/offers/reducer';
import { portfolioReducer } from '@homzhub/common/src/modules/portfolio/reducer';
import { recordAssetReducer } from '@homzhub/common/src/modules/recordAsset/reducer';
import { searchReducer } from '@homzhub/common/src/modules/search/reducer';
import { ticketReducer } from '@homzhub/common/src/modules/tickets/reducer';
import { userReducer } from '@homzhub/common/src/modules/user/reducer';

export default combineReducers({
  asset: assetReducer,
  common: commonReducer,
  search: searchReducer,
  ticket: ticketReducer,
  user: userReducer,
  portfolio: portfolioReducer,
  recordAsset: recordAssetReducer,
  offer: offerReducer,
});
