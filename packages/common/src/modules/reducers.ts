import { combineReducers } from 'redux';
import { onboardingReducer } from '@homzhub/common/src/modules/onboarding/reducer';
import { userReducer } from '@homzhub/common/src/modules/user/reducer';

export default combineReducers({
  onboarding: onboardingReducer,
  user: userReducer,
});
