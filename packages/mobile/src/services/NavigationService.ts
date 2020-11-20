import { CommonActions } from '@react-navigation/native';
import { IUserTokens, StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { DynamicLinkTypes, IRedirectionDetails } from '@homzhub/mobile/src/services/LinkingService';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

class NavigationService {
  private navigator: any;

  get navigation(): any {
    return this.navigator;
  }

  public setTopLevelNavigator = (navigatorRef: any): void => {
    this.navigator = navigatorRef;
  };

  public handleDynamicLinkNavigation = async (redirectionDetails: IRedirectionDetails): Promise<void> => {
    const userData = await StorageService.get<IUserTokens>(StorageKeys.USER);

    if (userData && redirectionDetails.shouldRedirect) {
      this.navigateOnUrlType(redirectionDetails.redirectionLink);
      return;
    }

    if (redirectionDetails.redirectionLink && redirectionDetails.shouldRedirect) {
      if (this.navigator) {
        this.navigator.navigate(ScreensKeys.AuthStack, {
          screen: ScreensKeys.SignUp,
        });
      }
    }
  };

  public navigateOnUrlType = (url: string): void => {
    const type = this.getValueOfParamFromUrl('type', url);

    if (type === DynamicLinkTypes.ASSET_DESCRIPTION) {
      this.navigateToAssetDescription(url).then();
      return;
    }

    if (type === DynamicLinkTypes.RESET_PASSWORD) {
      this.navigateToResetPassword(url);
    }
  };

  private navigateToAssetDescription = async (url: string): Promise<void> => {
    const userData = await StorageService.get<IUserTokens>(StorageKeys.USER);

    if (this.navigator) {
      if (userData) {
        this.navigator.navigate(ScreensKeys.BottomTabs, {
          screen: ScreensKeys.Search,
          params: {
            screen: ScreensKeys.PropertyAssetDescription,
            initial: false,
            params: {
              propertyTermId: this.getValueOfParamFromUrl('propertyTermId', url),
            },
          },
        });
        return;
      }

      this.navigator.navigate(ScreensKeys.SearchStack, {
        screen: ScreensKeys.BottomTabs,
        params: {
          screen: ScreensKeys.Search,
          params: {
            screen: ScreensKeys.PropertyAssetDescription,
            initial: false,
            params: {
              propertyTermId: this.getValueOfParamFromUrl('propertyTermId', url),
            },
          },
        },
      });
    }
  };

  private navigateToResetPassword = (url: string): void => {
    if (this.navigator) {
      this.navigator.navigate(ScreensKeys.AuthStack, {
        screen: ScreensKeys.ResetPassword,
        initial: false,
        params: {
          token: this.getValueOfParamFromUrl('verification_id', url),
        },
      });
    }
  };

  private goBack = (): void => {
    if (this.navigator) {
      if (this.navigator.canGoBack()) {
        this.navigator.goBack();
        return;
      }

      this.navigator.dispatch(
        CommonActions.navigate({
          name: ScreensKeys.Dashboard,
        })
      );
    }
  };

  private getValueOfParamFromUrl = (param: string, url: string): string | null => {
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    const match = url.match(`A?${param}=[^&]+`);

    if (!match) {
      return null;
    }

    return match[0].split('=')[1];
  };
}

const navigationService = new NavigationService();
export { navigationService as NavigationService };
