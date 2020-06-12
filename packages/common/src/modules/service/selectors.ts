import { IState } from '@homzhub/common/src/modules/interfaces';
import { IServiceDetail } from '@homzhub/common/src/domain/models/Service';

const getServiceDetails = (state: IState): IServiceDetail[] => {
  const {
    service: { servicesData },
  } = state;
  return servicesData;
};

export const ServiceSelector = {
  getServiceDetails,
};
