import { IState } from '@homzhub/common/src/modules/interfaces';
import { PropertySelector } from '@homzhub/common/src/modules/property/selectors';
import { initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { initialPropertyState } from '@homzhub/common/src/modules/property/reducer';
import { PropertyAssetGroupData } from '@homzhub/common/src/mocks/PropertyDetails';
import { initialServiceState } from '@homzhub/common/src/modules/service/reducer';

const state: IState = {
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
  service: {
    ...initialServiceState,
  },
};

describe('Property Selector', () => {
  it('should return the property data', () => {
    expect(PropertySelector.getPropertyDetails(state)).toBe(PropertyAssetGroupData);
  });
});
