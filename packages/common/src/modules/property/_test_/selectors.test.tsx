// @ts-nocheck
import { IState } from '@homzhub/common/src/modules/interfaces';
import { PropertySelector } from '@homzhub/common/src/modules/property/selectors';
import { initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { initialPropertyState } from '@homzhub/common/src/modules/property/reducer';
import { PropertyAssetGroupData } from '@homzhub/common/src/mocks/PropertyDetails';
import { ServicesData } from '@homzhub/common/src/mocks/ServiceData';
import { ServiceSteps } from '@homzhub/common/src/mocks/ServiceSteps';
import { RentServicesData } from '@homzhub/common/src/mocks/RentServices';

const state: IState = {
  user: {
    ...initialUserState,
  },
  property: {
    ...initialPropertyState,
    propertyDetails: {
      ...initialPropertyState.propertyDetails,
      propertyGroup: PropertyAssetGroupData,
      rentServices: RentServicesData,
    },
    servicesInfo: ServicesData,
    servicesSteps: ServiceSteps,
    currentPropertyId: 1,
    currentLeaseTermId: 1,
    currentServiceCategoryId: 1,
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
    expect(PropertySelector.getCurrentLeaseTermId(state)).toBe(1);
  });

  it('should return current service id', () => {
    expect(PropertySelector.getCurrentServiceCategoryId(state)).toBe(1);
  });

  it('should return the service list', () => {
    expect(PropertySelector.getRentServicesList(state)).toBe(RentServicesData);
  });

  it('should return the service steps', () => {
    expect(PropertySelector.getServiceSteps(state)).toBe(ServiceSteps);
  });
});
