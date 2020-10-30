import { icons } from '../assets/icon';

export enum sideMenuItems {
  DASHBOARD = 'dashboard',
  FINANCIALS = 'financials',
  PORTFOLIO = 'portfolio',
  NOTIFICATIONS = 'notifications',
  TICKETS = 'tickets',
  KYC_DOCUMENTS = 'kyc documents',
  SAVED_PROPERTIES = 'saved properties',
  PROPERTY_VISITS = 'property visits',
  OFFERS = 'offers',
  NEW_LAUNCHES = 'new launches',
  MARKET_TRENDS = 'market trends',
  VALUE_ADDED_SERVICES = 'value added services',
  SETTINGS = 'settings',
  MANAGE_SUBSCRIPTION = 'manage subscription',
  PAYMENT_METHODS = 'payment methods',
  LOGOUT = 'logout',
}
export interface IMenuItemList {
  id: number;
  name: string;
  icon: string;
}
export const MenuItemList: IMenuItemList[] = [
  {
    id: 1,
    name: sideMenuItems.DASHBOARD,
    icon: icons.dashboard,
  },
  {
    id: 2,
    name: sideMenuItems.FINANCIALS,
    icon: icons.barChartFilled,
  },
  {
    id: 3,
    name: sideMenuItems.PORTFOLIO,
    icon: icons.portfolio,
  },
  {
    id: 4,
    name: sideMenuItems.NOTIFICATIONS,
    icon: icons.alert,
  },
  {
    id: 5,
    name: sideMenuItems.TICKETS,
    icon: icons.ticket,
  },
  {
    id: 6,
    name: sideMenuItems.KYC_DOCUMENTS,
    icon: icons.documents,
  },
  {
    id: 7,
    name: sideMenuItems.SAVED_PROPERTIES,
    icon: icons.heartOutline,
  },
  {
    id: 8,
    name: sideMenuItems.PROPERTY_VISITS,
    icon: icons.visit,
  },
  {
    id: 9,
    name: sideMenuItems.OFFERS,
    icon: icons.offers,
  },
  {
    id: 10,
    name: sideMenuItems.NEW_LAUNCHES,
    icon: icons.newLaunch,
  },
  {
    id: 11,
    name: sideMenuItems.MARKET_TRENDS,
    icon: icons.increase,
  },
  {
    id: 12,
    name: sideMenuItems.VALUE_ADDED_SERVICES,
    icon: icons.settingOutline,
  },
  {
    id: 13,
    name: sideMenuItems.SETTINGS,
    icon: icons.setting,
  },
  {
    id: 14,
    name: sideMenuItems.MANAGE_SUBSCRIPTION,
    icon: icons.manageSubscription,
  },
  {
    id: 15,
    name: sideMenuItems.PAYMENT_METHODS,
    icon: icons.payment,
  },
  {
    id: 16,
    name: sideMenuItems.LOGOUT,
    icon: icons.logOut,
  },
];
