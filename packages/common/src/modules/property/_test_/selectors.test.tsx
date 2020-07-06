import { IState } from '@homzhub/common/src/modules/interfaces';
import { PropertySelector } from '@homzhub/common/src/modules/property/selectors';
import { initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { initialPropertyState } from '@homzhub/common/src/modules/property/reducer';
import { PropertyAssetGroupData } from '@homzhub/common/src/mocks/PropertyDetails';
import { ServicesData } from '@homzhub/common/src/mocks/ServiceData';
import { ServiceSteps } from '@homzhub/common/src/mocks/ServiceSteps';
import { RentServicesData } from '@homzhub/common/src/mocks/RentServices';
import { ServiceStepTypes } from '@homzhub/common/src/domain/models/Service';
import { TypeOfSale } from '@homzhub/common/src/domain/models/Property';

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
    termId: 1,
    serviceCategory: { id: 1, typeOfSale: TypeOfSale.FIND_TENANT },
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

  it('should return current service category', () => {
    expect(PropertySelector.getServiceCategory(state)).toStrictEqual({ id: 1, typeOfSale: TypeOfSale.FIND_TENANT });
  });

  it('should return the service list', () => {
    expect(PropertySelector.getRentServicesList(state)).toBe(RentServicesData);
  });

  it('should return the service steps', () => {
    expect(PropertySelector.getServiceSteps(state)).toBe(ServiceSteps);
  });

  it('should return the service steps details', () => {
    const types = [
      ServiceStepTypes.LEASE_DETAILS,
      ServiceStepTypes.PROPERTY_IMAGES,
      ServiceStepTypes.PROPERTY_VERIFICATIONS,
      ServiceStepTypes.PAYMENT_TOKEN_AMOUNT,
    ];
    expect(PropertySelector.getServiceStepsDetails(state)).toStrictEqual(types);
  });
});
