import { icons } from '@homzhub/common/src/assets/icon';
import { ISettingsData } from '@homzhub/common/src/domain/models/SettingsData';
import { OptionTypes } from '@homzhub/common/src/domain/models/SettingOptions';
import { UserPreferencesKeys } from '@homzhub/common/src/domain/models/UserPreferences';

export const SettingsScreenData: ISettingsData[] = [
  {
    name: 'loginSecurity',
    icon: icons.lock,
    visible: false,
    options: [
      {
        name: 'faceId',
        label: 'faceId',
        type: OptionTypes.Switch,
      },
      {
        name: 'fingerprint',
        label: 'fingerprint',
        type: OptionTypes.Switch,
      },
      {
        name: 'twoFactorAuthentication',
        label: 'twoFactorAuthentication',
        type: OptionTypes.Switch,
      },
    ],
  },
  {
    name: 'preferencesText',
    icon: icons.preference,
    visible: true,
    options: [
      {
        name: UserPreferencesKeys.CurrencyKey,
        label: 'currency',
        type: OptionTypes.Dropdown,
      },
      {
        name: UserPreferencesKeys.LanguageKey,
        label: 'language',
        type: OptionTypes.Dropdown,
      },
      {
        name: UserPreferencesKeys.FinancialYear,
        label: 'financialYear',
        type: OptionTypes.Dropdown,
      },
      {
        name: UserPreferencesKeys.MetricUnit,
        label: 'metricSystem',
        type: OptionTypes.Dropdown,
      },
    ],
  },
  {
    name: 'dataAndPrivacy',
    icon: icons.hand,
    visible: false,
    options: [
      {
        name: 'showLastName',
        label: 'showLastName',
        type: OptionTypes.Switch,
      },
      {
        name: 'showMobileNumber',
        label: 'showMobileNumber',
        type: OptionTypes.Switch,
      },
      {
        name: 'showEmail',
        label: 'showEmail',
        type: OptionTypes.Switch,
      },
      {
        name: 'analyseAppIssuesAndEvents',
        label: 'analyseAppIssuesAndEvents',
        type: OptionTypes.Switch,
      },
    ],
  },
  {
    name: 'communications',
    icon: icons.communication,
    visible: false,
    options: [
      {
        name: 'pushNotifications',
        label: 'pushNotifications',
        type: OptionTypes.Switch,
      },
      {
        name: 'emailsText',
        label: 'emailsText',
        type: OptionTypes.Switch,
      },
      {
        name: 'messagesText',
        label: 'messagesText',
        type: OptionTypes.Switch,
      },
    ],
  },
  {
    name: 'appInfo',
    icon: icons.detail,
    visible: true,
    options: [
      {
        name: 'releaseNotes',
        label: 'releaseNotes',
        type: OptionTypes.Webview,
        url: 'https://www.homzhub.com/privacyPolicy',
      },
      {
        name: 'termsConditionsText',
        label: 'termsConditionsText',
        type: OptionTypes.Webview,
        url: 'https://www.homzhub.com/privacyPolicy',
      },
      {
        name: 'privacyPolicyText',
        label: 'privacyPolicyText',
        type: OptionTypes.Webview,
        url: 'https://www.homzhub.com/privacyPolicy',
      },
    ],
  },
];
