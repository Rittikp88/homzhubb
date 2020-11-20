import { Linking } from 'react-native';
import firebase from '@react-native-firebase/app';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { NavigationService } from '@homzhub/mobile/src/services/NavigationService';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';

// Todo: Import from firebase library
type DynamicLinkType = {
  url: string;
  minimumAppVersion: number | string | null;
};

export interface IRedirectionDetails {
  redirectionLink: string;
  shouldRedirect: boolean;
}

export enum DynamicLinkTypes {
  ASSET_DESCRIPTION = 'AssetDescription',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

const firebaseConfig = {
  apiKey: 'AIzaSyATBMf9KD6pWgOpKmOxw5sF-dFdxxF19tQ',
  projectId: 'homzhub-7a1d5',
  appId: '1:638609269566:android:b51cd4354cfea79b08826f',
  databaseURL: 'https://homzhub-7a1d5.firebaseio.com/',
  messagingSenderId: '638609269566',
  authDomain: 'homzhub-7a1d5.firebaseapp.com',
  storageBucket: 'homzhub-7a1d5.appspot.com',
};

class LinkingService {
  public firebaseInit = async (): Promise<void> => {
    firebase.initializeApp(firebaseConfig);
    await this.listenToDynamicLinks();
  };

  private handleDynamicLink = (url: string): void => {
    const store = StoreProviderService.getStore();
    const redirectionDetails = { redirectionLink: url, shouldRedirect: true };

    store.dispatch(CommonActions.setRedirectionDetails(redirectionDetails));
    NavigationService.handleDynamicLinkNavigation(redirectionDetails).then();
  };

  private listenToDynamicLinks = async (): Promise<any> => {
    /* This part of the code handles links opened when app is in foreground state */
    dynamicLinks().onLink((link: DynamicLinkType) => {
      this.handleDynamicLink(link.url);
    });

    /* This part of the code handles links opened when app is in background state */
    await dynamicLinks()
      .getInitialLink()
      .then((link: DynamicLinkType | null) => {
        if (link) {
          this.handleDynamicLink(link.url);
        } else {
          // eslint-disable-next-line no-lonely-if
          if (PlatformUtils.isAndroid()) {
            Linking.getInitialURL()
              .then((url) => {
                this.handleDynamicLink(url || '');
                // do something with the URL
              })
              .catch((err) => err);
          } else {
            // handle case for iOS
          }
        }
      });
  };

  public buildShortLink = async (type: DynamicLinkTypes, extraParams?: string): Promise<string> => {
    return await firebase.dynamicLinks().buildShortLink(
      {
        link: `https://homzhub.com?type=${type}&${extraParams}`,
        android: {
          packageName: 'com.homzhub',
        },
        ios: {
          bundleId: 'com.homzhub.rn',
          appStoreId: '1516772395',
        },
        domainUriPrefix: 'https://homzhubapp.page.link',
      },
      firebase.dynamicLinks.ShortLinkType.UNGUESSABLE
    );
  };

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
}

const linkingService = new LinkingService();
export { linkingService as LinkingService };
