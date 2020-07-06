import { IState } from '@homzhub/common/src/modules/interfaces';
import { IPropertyDetailsData, IRentServiceList } from '@homzhub/common/src/domain/models/Property';
import {
  IServiceCategory,
  IServiceDetail,
  IServiceListStepsDetail,
  ServiceStepTypes,
} from '@homzhub/common/src/domain/models/Service';

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

const getTermId = (state: IState): number => {
  const {
    property: { termId },
  } = state;
  return termId;
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

const getServiceSteps = (state: IState): IServiceListStepsDetail => {
  const {
    property: { servicesSteps },
  } = state;
  return servicesSteps;
};

const getServiceStepsDetails = (state: IState): ServiceStepTypes[] => {
  const serviceSteps = getServiceSteps(state);
  return serviceSteps.steps.map((serviceStep) => serviceStep.name);
};

const getServiceCategory = (state: IState): IServiceCategory => {
  const {
    property: { serviceCategory },
  } = state;
  return serviceCategory;
};

export const PropertySelector = {
  getPropertyDetails,
  getRentServicesList,
  getCurrentPropertyId,
  getServiceDetails,
  getServiceSteps,
  getTermId,
  getServiceStepsDetails,
  getServiceCategory,
};
