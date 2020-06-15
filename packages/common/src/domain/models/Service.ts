export interface IServiceDetail {
  id: number;
  serviceName: string;
  description: string;
  serviceCost: string;
  badge?: string;
  facilities: IFacilities[];
}

export interface IFacilities {
  name: string;
  included: boolean;
}
