import { combineReducers } from 'redux';
import { assetReducer } from '@homzhub/common/src/modules/asset/reducer';
import { userReducer } from '@homzhub/common/src/modules/user/reducer';
import { propertyReducer } from '@homzhub/common/src/modules/property/reducer';
import { searchReducer } from '@homzhub/common/src/modules/search/reducer';

export default combineReducers({
  asset: assetReducer,
  property: propertyReducer,
  search: searchReducer,
  user: userReducer,
});
