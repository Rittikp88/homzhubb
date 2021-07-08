type tpageTitles = {
  [key: string]: string;
};
export const pageTitles: tpageTitles = {
  selectProperty: 'Value Added Services',
  selectServices: 'Value Added Services',
  propertyView: 'Property View',
  nextActions: 'Next Actions',
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
  {
    path: '/dashboard/propertyView',
    breadcrumb: 'Property View',
  },
  {
    path: '/dashboard/nextActions',
    breadcrumb: 'Next Actions',
  },
];
