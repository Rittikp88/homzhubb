import { combineReducers } from 'redux';
import { ownerReducer } from '@homzhub/common/src/modules/owner/reducer';

// TODO: For reference (remove)

export default combineReducers({
  owner: ownerReducer,
});
