import { combineReducers } from 'redux';
import { ownerReducer } from '@homzhub/common/src/modules/owner/reducer';
import { onboardingReducer } from '@homzhub/common/src/modules/onboarding/reducer';
import { userReducer } from '@homzhub/common/src/modules/user/reducer';

export default combineReducers({
  owner: ownerReducer,
  onboarding: onboardingReducer,
  user: userReducer,
});
