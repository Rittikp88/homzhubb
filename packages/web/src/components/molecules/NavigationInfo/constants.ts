type tpageTitles = {
  [key: string]: string;
};
export const pageTitles: tpageTitles = {
  selectProperty: 'Value Added Services',
  selectServices: 'Value Added Services',
  propertyView: 'Property View',
  searchProperty: 'Search Property',
  propertyVisits: 'Property Visits',
  savedProperties: 'Saved Properties',
  addProperty: 'Add Property',
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
    path: '/dashboard/portfolio/propertySelected',
    breadcrumb: 'Property Selected',
  },
  {
    path: '/dashboard/searchProperty',
    breadcrumb: 'Search Property',
  },
  {
    path: '/dashboard/propertyDetail',
    breadcrumb: 'Property Detail',
  },
  {
    path: '/dashboard/propertyVisits',
    breadcrumb: 'Property Visits',
  },
  {
    path: '/dashboard/savedProperties',
    breadcrumb: 'Saved Properties',
  },
  {
    path: '/dashboard/addProperty',
    breadcrumb: 'Add Property',
  },
  {
    path: '/dashboard/nextActions',
    breadcrumb: 'Next Actions',
  },
];
