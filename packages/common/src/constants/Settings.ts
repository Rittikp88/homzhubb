import { icons } from '@homzhub/common/src/assets/icon';

export enum OptionTypes {
  Switch = 'SWITCH',
  Webview = 'WEBVIEW',
  Dropdown = 'DROPDOWN',
}

export interface ISettingsOptions {
  label: string;
  type: OptionTypes;
}

export interface ISettingsData {
  name: string;
  icon?: string;
  visible: boolean;
  options: ISettingsOptions[];
}

export const SettingsScreenData: ISettingsData[] = [
  {
    name: 'loginSecurity',
    icon: icons.document,
    visible: true,
    options: [
      {
        label: 'faceId',
        type: OptionTypes.Switch,
      },
      {
        label: 'fingerprint',
        type: OptionTypes.Switch,
      },
      {
        label: 'twoFactorAuthentication',
        type: OptionTypes.Switch,
      },
    ],
  },
  {
    name: 'preferencesText',
    icon: icons.document,
    visible: true,
    options: [
      {
        label: 'darkTheme',
        type: OptionTypes.Switch,
      },
      {
        label: 'currency',
        type: OptionTypes.Dropdown,
      },
      {
        label: 'language',
        type: OptionTypes.Dropdown,
      },
      {
        label: 'financialYear',
        type: OptionTypes.Dropdown,
      },
    ],
  },
  {
    name: 'dataAndPrivacy',
    icon: icons.document,
    visible: true,
    options: [
      {
        label: 'showLastName',
        type: OptionTypes.Switch,
      },
      {
        label: 'showMobileNumber',
        type: OptionTypes.Switch,
      },
      {
        label: 'showEmail',
        type: OptionTypes.Switch,
      },
      {
        label: 'analyseAppIssuesAndEvents',
        type: OptionTypes.Switch,
      },
    ],
  },
  {
    name: 'communications',
    icon: icons.document,
    visible: true,
    options: [
      {
        label: 'pushNotifications',
        type: OptionTypes.Switch,
      },
      {
        label: 'emailsText',
        type: OptionTypes.Switch,
      },
      {
        label: 'messagesText',
        type: OptionTypes.Switch,
      },
    ],
  },
  {
    name: 'appInfo',
    icon: icons.document,
    visible: true,
    options: [
      {
        label: 'releaseNotes',
        type: OptionTypes.Webview,
      },
      {
        label: 'termsConditionsText',
        type: OptionTypes.Webview,
      },
      {
        label: 'privacyPolicyText',
        type: OptionTypes.Webview,
      },
    ],
  },
];
