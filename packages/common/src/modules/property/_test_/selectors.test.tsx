import { IState } from '@homzhub/common/src/modules/interfaces';
import { PropertySelector } from '@homzhub/common/src/modules/property/selectors';
import { initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { initialPropertyState } from '@homzhub/common/src/modules/property/reducer';
import { initialAssetState } from '@homzhub/common/src/modules/asset/reducer';
import { initialSearchState } from '@homzhub/common/src/modules/search/reducer';
import { initialPortfolioState } from '@homzhub/common/src/modules/portfolio/reducer';
import { initialRecordAssetState } from '@homzhub/common/src/modules/recordAsset/reducer';
import { PropertyAssetGroupData } from '@homzhub/common/src/mocks/PropertyDetails';
import { ServicesData } from '@homzhub/common/src/mocks/ServiceData';
import { ServiceSteps } from '@homzhub/common/src/mocks/ServiceSteps';
import { ServiceStepTypes } from '@homzhub/common/src/domain/models/Service';

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
    servicesInfo: ServicesData,
    servicesSteps: ServiceSteps,
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

  it('should return the Service data', () => {
    expect(PropertySelector.getServiceDetails(state)).toBe(ServicesData);
  });

  it('should return current property id', () => {
    expect(PropertySelector.getCurrentPropertyId(state)).toBe(1);
  });

  it('should return current lease term id', () => {
    expect(PropertySelector.getTermId(state)).toBe(1);
  });

  it('should return the service steps', () => {
    expect(PropertySelector.getServiceSteps(state)).toBe(ServiceSteps);
  });

  it('should return the service steps details', () => {
    const types = [
      ServiceStepTypes.LEASE_DETAILS,
      ServiceStepTypes.PROPERTY_VERIFICATIONS,
      ServiceStepTypes.PAYMENT_TOKEN_AMOUNT,
    ];
    expect(PropertySelector.getServiceStepsDetails(state)).toStrictEqual(types);
  });

  it('should return property loading state', () => {
    expect(PropertySelector.getPropertyLoadingState(state)).toStrictEqual(true);
  });
});
