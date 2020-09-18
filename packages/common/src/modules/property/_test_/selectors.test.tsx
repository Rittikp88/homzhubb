import { IState } from '@homzhub/common/src/modules/interfaces';
import { PropertySelector } from '@homzhub/common/src/modules/property/selectors';
import { initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { initialPropertyState } from '@homzhub/common/src/modules/property/reducer';
import { initialAssetState } from '@homzhub/common/src/modules/asset/reducer';
import { initialSearchState } from '@homzhub/common/src/modules/search/reducer';
import { initialPortfolioState } from '@homzhub/common/src/modules/portfolio/reducer';
import { initialRecordAssetState } from '@homzhub/common/src/modules/recordAsset/reducer';
import { PropertyAssetGroupData } from '@homzhub/common/src/mocks/PropertyDetails';

const state: IState = {
  user: {
    ...initialUserState,
  },
  property: {
    ...initialPropertyState,
    propertyDetails: {
      ...initialPropertyState.propertyDetails,
      propertyGroup: PropertyAssetGroupData,
    },
    currentPropertyId: 1,
    termId: 1,
    loaders: {
      ...initialPropertyState.loaders,
      property: true,
    },
  },
  asset: {
    ...initialAssetState,
  },
  search: {
    ...initialSearchState,
  },
  portfolio: {
    ...initialPortfolioState,
  },
  recordAsset: {
    ...initialRecordAssetState,
  },
};

describe('Property Selector', () => {
  it('should return the property data', () => {
    expect(PropertySelector.getPropertyDetails(state)).toBe(PropertyAssetGroupData);
  });

  it('should return current property id', () => {
    expect(PropertySelector.getCurrentPropertyId(state)).toBe(1);
  });

  it('should return current lease term id', () => {
    expect(PropertySelector.getTermId(state)).toBe(1);
  });

  it('should return property loading state', () => {
    expect(PropertySelector.getPropertyLoadingState(state)).toStrictEqual(true);
  });
});
