import { IServiceDetail, IServiceListStepsDetail } from '@homzhub/common/src/domain/models/Service';

export interface IServiceState {
  servicesData: IServiceDetail[];
  servicesSteps: IServiceListStepsDetail[];
  error: {
    service: string;
  };
  loaders: {
    service: boolean;
  };
}
