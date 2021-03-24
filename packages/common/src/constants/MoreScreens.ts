import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

export interface IMoreScreenItem {
  id: number;
  title: string;
  icon: string;
  type: MoreScreenTypes;
  textColor: string;
  iconColor: string;
}

export interface IMoreScreens {
  [key: string]: IMoreScreenItem[];
}

export enum MoreScreenTypes {
  NOTIFICATIONS = 'notifications',
  TICKETS = 'tickets',
  KYC_DOCUMENTS = 'kycDocuments',
  MESSAGES = 'messages',
  SAVED_PROPERTIES = 'savedProperties',
  PROPERTY_VISITS = 'propertyVisits',
  NEW_LAUNCHES = 'newLaunches',
  MARKET_TRENDS = 'marketTrends',
  VALUE_ADDED_SERVICES = 'valueAddedServices',
  SETTINGS = 'settings',
  PAYMENT_METHODS = 'paymentMethods',
  REFER_FRIEND = 'referFriend',
  SUPPORT = 'support',
  LOGOUT = 'logout',
  ProspectProfile = 'ProspectProfile',
  OFFERS = 'Offers',
}

const ICON_COLOR = theme.colors.lowPriority;
const TEXT_COLOR = theme.colors.shadow;
const translationKey = LocaleConstants.namespacesKey.assetMore;

export const MORE_SCREENS: IMoreScreens = {
  sectionA: [
    {
      id: 1,
      title: `${translationKey}:notifications`,
      icon: icons.alert,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.NOTIFICATIONS,
    },
    {
      id: 2,
      title: `${translationKey}:tickets`,
      icon: icons.ticket,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.TICKETS,
    },
    {
      id: 3,
      title: `${translationKey}:kycDocuments`,
      icon: icons.documents,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.KYC_DOCUMENTS,
    },
    {
      id: 4,
      title: `${translationKey}:messages`,
      icon: icons.mail,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.MESSAGES,
    },
  ],
  sectionB: [
    {
      id: 4,
      title: `${translationKey}:savedProperties`,
      icon: icons.heartOutline,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.SAVED_PROPERTIES,
    },
    {
      id: 5,
      title: `${translationKey}:propertyVisits`,
      icon: icons.visit,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.PROPERTY_VISITS,
    },
    {
      id: 6,
      title: `${translationKey}:offers`,
      icon: icons.offers,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.OFFERS,
    },
    {
      id: 7,
      title: `${translationKey}:newLaunches`,
      icon: icons.newLaunch,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.NEW_LAUNCHES,
    },
    {
      id: 8,
      title: `${translationKey}:marketTrends`,
      icon: icons.increase,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.MARKET_TRENDS,
    },
    {
      id: 9,
      title: `${translationKey}:valueAddedServices`,
      icon: icons.settingOutline,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.VALUE_ADDED_SERVICES,
    },
  ],
  sectionC: [
    {
      id: 8,
      title: `${translationKey}:settings`,
      icon: icons.setting,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.SETTINGS,
    },
    {
      id: 9,
      title: `${translationKey}:paymentMethods`,
      icon: icons.payment,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.PAYMENT_METHODS,
    },
  ],
  sectionD: [
    {
      id: 10,
      title: `${translationKey}:referFriend`,
      icon: icons.refer,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.REFER_FRIEND,
    },
    {
      id: 11,
      title: `${translationKey}:support`,
      icon: icons.headset,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.SUPPORT,
    },
  ],
};

export const LOGOUT = {
  id: 12,
  title: `${translationKey}:logout`,
  icon: icons.logOut,
  iconColor: theme.colors.error,
  textColor: theme.colors.error,
  type: MoreScreenTypes.LOGOUT,
};
