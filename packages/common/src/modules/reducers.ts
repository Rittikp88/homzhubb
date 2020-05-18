import { combineReducers } from 'redux';
import { ownerReducer } from '@homzhub/common/src/modules/owner/reducer';
import { onboardingReducer } from '@homzhub/common/src/modules/onboarding/reducer';

export default combineReducers({
  owner: ownerReducer,
  onboarding: onboardingReducer,
});
