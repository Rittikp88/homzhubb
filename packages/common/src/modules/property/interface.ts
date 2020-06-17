import { IPropertyDetailsData, IRentServiceList } from '@homzhub/common/src/domain/models/Property';
import { IServiceDetail, IServiceListStepsDetail } from '@homzhub/common/src/domain/models/Service';

export interface IPropertyState {
  currentPropertyId: number;
  propertyDetails: {
    propertyGroup: IPropertyDetailsData[] | null;
    rentServices: IRentServiceList[] | null;
  };
  servicesInfo: IServiceDetail[];
  servicesSteps: IServiceListStepsDetail[];
  error: {
    property: string;
    service: string;
  };
  loaders: {
    property: boolean;
    service: boolean;
  };
}
