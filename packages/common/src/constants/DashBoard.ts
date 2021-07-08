import { icons } from '@homzhub/common/src/assets/icon';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';

export interface IPropertyNotificationDetails {
  label: string;
  count: number;
  icon: string;
  colorCode?: string;
  iconColor?: string;
  imageBackgroundColor?: string;
}

export interface IPropertyNotification {
  icon: string;
  iconColor: string;
  title: string;
  count: number;
  details: IPropertyNotificationDetails[];
  url: string;
}

export enum sideMenuItems {
  dashboard = 'assetDashboard:dashboard',
  financials = 'assetFinancial:financial',
  portfolio = 'common:properties',
  notifications = 'notifications',
  tickets = 'tickets',
  kycDocuments = 'kycDocuments',
  savedProperties = 'savedProperties',
  propertyVisits = 'propertyVisits',
  offers = 'common:offers',
  newLaunches = 'newLaunches',
  marketTrends = 'marketTrends',
  valueAddedServices = 'marketPlace',
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
    name: sideMenuItems.portfolio,
    icon: icons.portfolio,
    url: RouteNames.protectedRoutes.PORTFOLIO,
  },
  {
    id: 3,
    name: sideMenuItems.savedProperties,
    icon: icons.heartOutline,
    url: RouteNames.protectedRoutes.SAVED_PROPERTIES,
  },
  {
    id: 4,
    name: sideMenuItems.offers,
    icon: icons.offers,
    url: RouteNames.protectedRoutes.OFFERS,
  },
  {
    id: 5,
    name: sideMenuItems.notifications,
    icon: icons.bell,
    url: RouteNames.protectedRoutes.NOTIFICATIONS,
  },
  {
    id: 6,
    name: sideMenuItems.propertyVisits,
    icon: icons.visit,
    url: RouteNames.protectedRoutes.PROPERTY_VISITS,
  },
  {
    id: 7,
    name: sideMenuItems.valueAddedServices,
    icon: icons.settingOutline,
    url: RouteNames.protectedRoutes.SELECT_PROPERTY,
  },
  {
    id: 8,
    name: sideMenuItems.logout,
    icon: icons.logOut,
    url: RouteNames.protectedRoutes.LOGOUT,
  },
];
