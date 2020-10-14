import { icons } from '@homzhub/common/src/assets/icon';

export enum Tabs {
  NOTIFICATIONS = 'Notifications',
  TICKETS = 'Tickets',
  OFFERS = 'Offers',
  REVIEWS = 'Reviews',
  SITE_VISITS = 'Property Visits',
  FINANCIALS = 'Financials',
  MESSAGES = 'Messages',
  DOCUMENTS = 'Documents',
  TENANT_HISTORY = 'Tenant History',
  DETAILS = 'Details',
}

export const tabName = [
  Tabs.NOTIFICATIONS,
  Tabs.TICKETS,
  Tabs.OFFERS,
  Tabs.REVIEWS,
  Tabs.SITE_VISITS,
  Tabs.FINANCIALS,
  Tabs.MESSAGES,
  Tabs.DOCUMENTS,
  Tabs.TENANT_HISTORY,
  Tabs.DETAILS,
];

export const Routes = [
  { key: Tabs.NOTIFICATIONS, title: Tabs.NOTIFICATIONS, icon: icons.alert },
  { key: Tabs.TICKETS, title: Tabs.TICKETS, icon: icons.headset },
  { key: Tabs.OFFERS, title: Tabs.OFFERS, icon: icons.offers },
  { key: Tabs.REVIEWS, title: Tabs.REVIEWS, icon: icons.reviews },
  { key: Tabs.SITE_VISITS, title: Tabs.SITE_VISITS, icon: icons.visit },
  { key: Tabs.FINANCIALS, title: Tabs.FINANCIALS, icon: icons.financials },
  { key: Tabs.MESSAGES, title: Tabs.MESSAGES, icon: icons.mail },
  { key: Tabs.DOCUMENTS, title: Tabs.DOCUMENTS, icon: icons.documents },
  { key: Tabs.TENANT_HISTORY, title: Tabs.TENANT_HISTORY, icon: icons.history },
  { key: Tabs.DETAILS, title: Tabs.DETAILS, icon: icons.detail },
];
