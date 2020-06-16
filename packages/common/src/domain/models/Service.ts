export interface IServiceDetail {
  id: number;
  name: string;
  title: string;
  description: string;
  service_cost: string;
  service_info: string;
  label: string;
  service_items: IServiceItems[];
}

export interface IServiceItems {
  id: number;
  name: string;
  description: string;
  label: string;
  is_covered: boolean;
}

export interface IServiceListStepsDetail {
  id: number;
  name: string;
  title: string;
}
