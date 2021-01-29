import { icons } from '@homzhub/common/src/assets/icon';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';

export interface IPropertyNotificationDetails {
  label: string;
  count: number;
  icon: string;
}

export interface IPropertyNotification {
  icon: string;
  iconColor: string;
  title: string;
  count: number;
  details: IPropertyNotificationDetails[];
}

export enum sideMenuItems {
  dashboard = 'assetDashboard:dashboard',
  financials = 'assetFinancial:financial',
  portfolio = 'assetPortfolio:portfolio',
  notifications = 'notifications',
  tickets = 'tickets',
  kycDocuments = 'kycDocuments',
  savedProperties = 'savedProperties',
  propertyVisits = 'propertyVisits',
  offers = 'common:offers',
  newLaunches = 'newLaunches',
  marketTrends = 'marketTrends',
  valueAddedServices = 'valueAddedServices',
  settings = 'settings',
  manageSubscription = 'common:manageSubscription',
  paymentMethods = 'paymentMethods',
  logout = 'logout',
}

export interface IMenuItemList {
  id: number;
  name: string;
  icon: string;
  url: string;
}

export const MenuItemList: IMenuItemList[] = [
  {
    id: 1,
    name: sideMenuItems.dashboard,
    icon: icons.dashboard,
    url: RouteNames.protectedRoutes.DASHBOARD,
  },
  {
    id: 2,
    name: sideMenuItems.financials,
    icon: icons.barChartOutline,
    url: RouteNames.protectedRoutes.FINANCIALS,
  },
  {
    id: 3,
    name: sideMenuItems.portfolio,
    icon: icons.portfolio,
    url: RouteNames.protectedRoutes.PORTFOLIO,
  },
  {
    id: 4,
    name: sideMenuItems.notifications,
    icon: icons.alert,
    url: RouteNames.protectedRoutes.NOTIFICATIONS,
  },
  {
    id: 5,
    name: sideMenuItems.tickets,
    icon: icons.ticket,
    url: RouteNames.protectedRoutes.TICKETS,
  },
  {
    id: 6,
    name: sideMenuItems.kycDocuments,
    icon: icons.documents,
    url: RouteNames.protectedRoutes.KYC_DOCUMENTS,
  },
  {
    id: 7,
    name: sideMenuItems.savedProperties,
    icon: icons.heartOutline,
    url: RouteNames.protectedRoutes.SAVED_PROPERTIES,
  },
  {
    id: 8,
    name: sideMenuItems.propertyVisits,
    icon: icons.visit,
    url: RouteNames.protectedRoutes.PROPERTY_VISITS,
  },
  {
    id: 9,
    name: sideMenuItems.offers,
    icon: icons.offers,
    url: RouteNames.protectedRoutes.OFFERS,
  },
  {
    id: 10,
    name: sideMenuItems.newLaunches,
    icon: icons.newLaunch,
    url: RouteNames.protectedRoutes.NEW_LAUNCHES,
  },
  {
    id: 11,
    name: sideMenuItems.marketTrends,
    icon: icons.increase,
    url: RouteNames.protectedRoutes.MARKET_TRENDS,
  },
  {
    id: 12,
    name: sideMenuItems.valueAddedServices,
    icon: icons.settingOutline,
    url: RouteNames.protectedRoutes.VALUE_ADDED_SERVICES,
  },
  {
    id: 13,
    name: sideMenuItems.settings,
    icon: icons.setting,
    url: RouteNames.protectedRoutes.SETTINGS,
  },
  {
    id: 14,
    name: sideMenuItems.manageSubscription,
    icon: icons.manageSubscription,
    url: RouteNames.protectedRoutes.MANAGE_SUBSCRIPTION,
  },
  {
    id: 15,
    name: sideMenuItems.paymentMethods,
    icon: icons.payment,
    url: RouteNames.protectedRoutes.PAYMENT_METHODS,
  },
  {
    id: 16,
    name: sideMenuItems.logout,
    icon: icons.logOut,
    url: RouteNames.protectedRoutes.LOGOUT,
  },
];
