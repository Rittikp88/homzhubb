type tpageTitles = {
  [key: string]: string;
};
export const pageTitles: tpageTitles = {
  selectProperty: 'Market Place',
  selectServices: 'Market Place',
  propertyView: 'Property View',
  searchProperty: 'Search Property',
  propertyVisits: 'Property Visits',
  savedProperties: 'Saved Properties',
  addProperty: 'Add Property',
  nextActions: 'Next Actions',
};

export const routesConfig = [
  {
    path: '/dashboard/marketPlace/selectServices',
    breadcrumb: 'Select Services',
  },
  {
    path: '/dashboard/marketPlace',
    breadcrumb: 'Market Place',
  },
  {
    path: '/dashboard/marketPlace/selectProperty',
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
