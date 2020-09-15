import { Linking } from 'react-native';
import { PathConfigMap } from '@react-navigation/core';
import { LinkingOptions } from '@react-navigation/native';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

class LinkingService {
  public openDialer = async (phoneNumber: string): Promise<void> => {
    const url = `tel:${phoneNumber}`;
    if (!(await this.canOpenURL(url))) {
      return;
    }
    await Linking.openURL(url);
  };

  public whatsappMessage = async (phoneNumber: string, message: string): Promise<void> => {
    const url = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
    if (!(await this.canOpenURL(url))) {
      AlertHelper.error({ message: I18nService.t('common:installWhatsapp') });
      return;
    }
    await Linking.openURL(url);
  };

  public canOpenURL = async (url: string): Promise<boolean> => {
    try {
      return await Linking.openURL(url);
    } catch (e) {
      return false;
    }
  };

  public getLinkingOptions = (userLoggedIn: boolean): LinkingOptions => {
    return {
      prefixes: ['https://www.homzhub.com', 'http://www.homzhub.com', 'www.homzhub.com', 'homzhub://www.homzhub.com'],
      config: {
        screens: {
          ...this.getNestedScreens(userLoggedIn),
          // Todo (Sriram 2020.09.11) This screen has to be replaced with 404 screen
          [ScreensKeys.BlankScreen]: '*',
        },
      },
    };
  };

  // Todo (Sriram: 2020.09.11) Refactor this in such a way that, you get 'PathConfigMap' just by passing 'screenName'.
  /* This is just for Demo purposes, much work has to be put into this */
  private getNestedScreens = (userLoggedIn: boolean): PathConfigMap => {
    const nestedScreens = {
      [ScreensKeys.BottomTabs]: {
        screens: {
          [ScreensKeys.Search]: {
            screens: {
              [ScreensKeys.PropertyAssetDescription]: 'propertydetails/:propertyTermId',
            },
          },
        },
      },
    };

    if (userLoggedIn) {
      return {
        ...nestedScreens,
      };
    }

    return {
      [ScreensKeys.SearchStack]: {
        screens: {
          ...nestedScreens,
        },
      },
    };
  };
}

const linkingService = new LinkingService();
export { linkingService as LinkingService };
