import { IState } from '@homzhub/common/src/modules/interfaces';
import { PropertySelector } from '@homzhub/common/src/modules/property/selectors';
import { initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { initialPropertyState } from '@homzhub/common/src/modules/property/reducer';
import { initialOnBoardingState } from '@homzhub/common/src/modules/onboarding/reducer';
import { PropertyAssetGroupData } from '@homzhub/common/src/mocks/PropertyDetails';

const state: IState = {
  onBoarding: {
    ...initialOnBoardingState,
  },
  user: {
    ...initialUserState,
  },
  property: {
    ...initialPropertyState,
    // @ts-ignore
    propertyDetails: {
      ...initialPropertyState.propertyDetails,
      propertyGroup: PropertyAssetGroupData,
    },
  },
};

describe('Onboarding Selector', () => {
  it('should return the onboarding data', () => {
    expect(PropertySelector.getPropertyDetails(state)).toBe(PropertyAssetGroupData);
  });
});
