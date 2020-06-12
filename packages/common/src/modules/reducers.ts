import { combineReducers } from 'redux';
import { userReducer } from '@homzhub/common/src/modules/user/reducer';
import { propertyReducer } from '@homzhub/common/src/modules/property/reducer';
import { serviceReducer } from '@homzhub/common/src/modules/service/reducer';

export default combineReducers({
  user: userReducer,
  property: propertyReducer,
  service: serviceReducer,
});
