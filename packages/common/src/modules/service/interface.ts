import { IServiceDetail } from '@homzhub/common/src/domain/models/Service';

export interface IServiceState {
  servicesData: IServiceDetail[];
  error: {
    service: string;
  };
  loaders: {
    service: boolean;
  };
}
