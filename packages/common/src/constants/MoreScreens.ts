import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';

export interface IMoreScreenItem {
  id: number;
  title: string;
  icon: string;
  textColor: string;
  iconColor: string;
}

export interface IMoreScreens {
  [key: string]: IMoreScreenItem[];
}

const ICON_COLOR = theme.colors.lowPriority;
const TEXT_COLOR = theme.colors.shadow;

export const MORE_SCREENS: IMoreScreens = {
  sectionA: [
    {
      id: 1,
      title: 'notifications',
      icon: icons.alert,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
    },
    {
      id: 2,
      title: 'tickets',
      icon: icons.ticket,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
    },
    {
      id: 3,
      title: 'kycDocuments',
      icon: icons.documents,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
    },
  ],
  sectionB: [
    {
      id: 4,
      title: 'savedProperties',
      icon: icons.heartOutline,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
    },
    {
      id: 5,
      title: 'newLaunches',
      icon: icons.newLaunch,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
    },
    {
      id: 6,
      title: 'marketTrends',
      icon: icons.increase,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
    },
    {
      id: 7,
      title: 'valueAddedServices',
      icon: icons.settingOutline,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
    },
  ],
  sectionC: [
    {
      id: 8,
      title: 'settings',
      icon: icons.setting,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
    },
    {
      id: 9,
      title: 'paymentMethods',
      icon: icons.payment,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
    },
  ],
  sectionD: [
    {
      id: 10,
      title: 'referFriend',
      icon: icons.refer,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
    },
    {
      id: 11,
      title: 'support',
      icon: icons.headset,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
    },
  ],
};

export const LOGOUT = {
  id: 12,
  title: 'logout',
  icon: icons.logOut,
  iconColor: theme.colors.error,
  textColor: theme.colors.error,
};
