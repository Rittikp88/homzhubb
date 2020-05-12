import { combineReducers } from 'redux';
import { ownerReducer } from './owner/reducer';

// TODO: For reference (remove)

export default combineReducers({
  owner: ownerReducer,
});
