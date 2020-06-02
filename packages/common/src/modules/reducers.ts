import { combineReducers } from 'redux';
import { onBoardingReducer } from '@homzhub/common/src/modules/onboarding/reducer';
import { userReducer } from '@homzhub/common/src/modules/user/reducer';
import { propertyReducer } from '@homzhub/common/src/modules/property/reducer';

export default combineReducers({
  onBoarding: onBoardingReducer,
  user: userReducer,
  property: propertyReducer,
});
