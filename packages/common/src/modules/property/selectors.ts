import { IState } from '@homzhub/common/src/modules/interfaces';
import { IPropertyDetailsData, IRentServiceList } from '@homzhub/common/src/domain/models/Property';
import { IServiceDetail } from '@homzhub/common/src/domain/models/Service';

const getPropertyDetails = (state: IState): IPropertyDetailsData[] | null => {
  const {
    property: {
      propertyDetails: { propertyGroup },
    },
  } = state;
  return propertyGroup;
};

const getCurrentPropertyId = (state: IState): number => {
  const {
    property: { currentPropertyId },
  } = state;
  return currentPropertyId;
};

const getCurrentLeaseTermId = (state: IState): number => {
  const {
    property: { currentLeaseTermId },
  } = state;
  return currentLeaseTermId;
};

const getRentServicesList = (state: IState): IRentServiceList[] | null => {
  const {
    property: {
      propertyDetails: { rentServices },
    },
  } = state;
  return rentServices;
};

const getServiceDetails = (state: IState): IServiceDetail[] => {
  const {
    property: { servicesInfo },
  } = state;
  return servicesInfo;
};

const getServiceSteps = (state: IState): any => {
  const {
    property: { servicesSteps },
  } = state;
  return servicesSteps;
};

const getCurrentServiceCategoryId = (state: IState): number => {
  const {
    property: { currentServiceCategoryId },
  } = state;
  return currentServiceCategoryId;
};

export const PropertySelector = {
  getPropertyDetails,
  getRentServicesList,
  getCurrentPropertyId,
  getServiceDetails,
  getServiceSteps,
  getCurrentLeaseTermId,
  getCurrentServiceCategoryId,
};
