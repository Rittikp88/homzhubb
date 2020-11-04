import { icons } from '@homzhub/common/src/assets/icon';

export enum sideMenuItems {
  dashboard = 'dashboard',
  financials = 'financials',
  portfolio = 'portfolio',
  notifications = 'notifications',
  tickets = 'tickets',
  kycDocuments = 'kycDocuments',
  savedProperties = 'savedProperties',
  propertyVisits = 'propertyVisits',
  offers = 'offers',
  newLaunches = 'newLaunches',
  marketTrends = 'marketTrends',
  valueAddedServices = 'valueAddedServices',
  settings = 'settings',
  manageSubscription = 'manageSubscription',
  paymentMethods = 'paymentMethods',
  logout = 'logout',
}

export interface IMenuItemList {
  id: number;
  name: string;
  icon: string;
}

export const MenuItemList: IMenuItemList[] = [
  {
    id: 1,
    name: sideMenuItems.dashboard,
    icon: icons.dashboard,
  },
  {
    id: 2,
    name: sideMenuItems.financials,
    icon: icons.barChartOutline,
  },
  {
    id: 3,
    name: sideMenuItems.portfolio,
    icon: icons.portfolio,
  },
  {
    id: 4,
    name: sideMenuItems.notifications,
    icon: icons.alert,
  },
  {
    id: 5,
    name: sideMenuItems.tickets,
    icon: icons.ticket,
  },
  {
    id: 6,
    name: sideMenuItems.kycDocuments,
    icon: icons.documents,
  },
  {
    id: 7,
    name: sideMenuItems.savedProperties,
    icon: icons.heartOutline,
  },
  {
    id: 8,
    name: sideMenuItems.propertyVisits,
    icon: icons.visit,
  },
  {
    id: 9,
    name: sideMenuItems.offers,
    icon: icons.offers,
  },
  {
    id: 10,
    name: sideMenuItems.newLaunches,
    icon: icons.newLaunch,
  },
  {
    id: 11,
    name: sideMenuItems.marketTrends,
    icon: icons.increase,
  },
  {
    id: 12,
    name: sideMenuItems.valueAddedServices,
    icon: icons.settingOutline,
  },
  {
    id: 13,
    name: sideMenuItems.settings,
    icon: icons.setting,
  },
  {
    id: 14,
    name: sideMenuItems.manageSubscription,
    icon: icons.manageSubscription,
  },
  {
    id: 15,
    name: sideMenuItems.paymentMethods,
    icon: icons.payment,
  },
  {
    id: 16,
    name: sideMenuItems.logout,
    icon: icons.logOut,
  },
];
