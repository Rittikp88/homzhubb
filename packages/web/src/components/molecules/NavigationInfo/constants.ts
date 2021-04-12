type tpageTitles = {
  [key: string]: string;
};
export const pageTitles: tpageTitles = {
  selectProperty: 'Value Added Services',
  selectServices: 'Value Added Services',
};

export const routesConfig = [
  {
    path: '/dashboard/valueAddedService/selectServices',
    breadcrumb: 'Select Services',
  },
  {
    path: '/dashboard/valueAddedService',
    breadcrumb: 'Value Added Services',
  },
  {
    path: '/dashboard/valueAddedService/selectProperty',
    breadcrumb: 'Select Property',
  },
];
