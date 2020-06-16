import { IState } from '@homzhub/common/src/modules/interfaces';
import { IServiceDetail } from '@homzhub/common/src/domain/models/Service';

const getServiceDetails = (state: IState): IServiceDetail[] => {
  const {
    service: { servicesData },
  } = state;
  return servicesData;
};

const getServiceSteps = (state: IState): any => {
  const {
    service: { servicesSteps },
  } = state;
  return servicesSteps;
};

export const ServiceSelector = {
  getServiceDetails,
  getServiceSteps,
};
