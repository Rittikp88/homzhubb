import { CommonActions } from '@react-navigation/native';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { IRedirectionDetails } from '@homzhub/mobile/src/services/LinkingService';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { IUserTokens, StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { CommonActions as StoreCommonActions } from '@homzhub/common/src/modules/common/actions';
import { DynamicLinkParamKeys, DynamicLinkTypes, RouteTypes } from '@homzhub/mobile/src/services/constants';

class NavigationService {
  private navigator: any;

  get navigation(): any {
    return this.navigator;
  }

  public setTopLevelNavigator = (navigatorRef: any): void => {
    this.navigator = navigatorRef;
  };

  // This method is an entry point to handle dynamic links
  public handleDynamicLinkNavigation = async (redirectionDetails: IRedirectionDetails): Promise<void> => {
    const userData = await StorageService.get<IUserTokens>(StorageKeys.USER);
    const { redirectionLink, shouldRedirect } = redirectionDetails;
    const routeType = this.getValueOfParamFromUrl(DynamicLinkParamKeys.RouteType, redirectionLink);

    if (!this.navigator) {
      return;
    }

    // Handle public routes inside the below if statement
    if (!userData && routeType === RouteTypes.Public && redirectionLink && shouldRedirect) {
      this.handlePublicRoutes(redirectionLink);
      return;
    }

    // Handle private routes inside the below if statement
    if (userData && redirectionLink && shouldRedirect) {
      this.handlePrivateRoutes(redirectionLink);
      return;
    }

    // Otherwise redirect user to the signup screen
    if (redirectionLink && shouldRedirect) {
      this.navigator.navigate(ScreensKeys.AuthStack, {
        screen: ScreensKeys.SignUp,
      });
    }
  };

  public handlePrivateRoutes = (url: string): void => {
    const type = this.getValueOfParamFromUrl(DynamicLinkParamKeys.Type, url);

    switch (type) {
      case DynamicLinkTypes.AssetDescription:
        this.navigateTo(ScreensKeys.BottomTabs, {
          screen: ScreensKeys.Search,
          params: {
            screen: ScreensKeys.PropertyAssetDescription,
            initial: false,
            params: {
              propertyTermId: this.getValueOfParamFromUrl(DynamicLinkParamKeys.PropertyTermId, url) || 0,
            },
          },
        });
        break;
      case DynamicLinkTypes.ResetPassword:
        this.navigateTo(ScreensKeys.BottomTabs, {
          screen: ScreensKeys.More,
          params: {
            screen: ScreensKeys.ResetPassword,
            initial: false,
            params: {
              verification_id: this.getValueOfParamFromUrl(DynamicLinkParamKeys.VerificationId, url),
            },
          },
        });
        break;
      case DynamicLinkTypes.PrimaryEmailVerification:
      case DynamicLinkTypes.WorkEmailVerification:
        this.navigateTo(ScreensKeys.BottomTabs, {
          screen: ScreensKeys.More,
          params: {
            screen: ScreensKeys.UserProfileScreen,
            initial: false,
            params: {
              verification_id: this.getValueOfParamFromUrl(DynamicLinkParamKeys.VerificationId, url),
            },
          },
        });
        break;
      default:
        AlertHelper.error({ message: I18nService.t('common:invalidLink') });
        break;
    }
  };

  public handlePublicRoutes = (url: string): void => {
    const type = this.getValueOfParamFromUrl(DynamicLinkParamKeys.Type, url);

    switch (type) {
      case DynamicLinkTypes.AssetDescription:
        this.navigateTo(ScreensKeys.SearchStack, {
          screen: ScreensKeys.BottomTabs,
          params: {
            screen: ScreensKeys.Search,
            params: {
              screen: ScreensKeys.PropertyAssetDescription,
              initial: false,
              params: {
                propertyTermId: this.getValueOfParamFromUrl(DynamicLinkParamKeys.PropertyTermId, url) || 0,
              },
            },
          },
        });
        break;
      case DynamicLinkTypes.ResetPassword:
        this.navigateTo(ScreensKeys.AuthStack, {
          screen: ScreensKeys.ResetPassword,
          initial: false,
          params: {
            verification_id: this.getValueOfParamFromUrl(DynamicLinkParamKeys.VerificationId, url),
          },
        });
        break;
      default:
        AlertHelper.error({ message: 'Nope you cant open these links' });
        break;
    }
  };

  private navigateTo = (stackName: string, params: any): void => {
    const store = StoreProviderService.getStore();

    this.navigator.navigate(stackName, params);
    store.dispatch(StoreCommonActions.setRedirectionDetails({ redirectionLink: '', shouldRedirect: false }));
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

  private getValueOfParamFromUrl = (param: string, url: string): string => {
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    const match = url.match(`A?${param}=[^&]+`);

    if (!match) {
      return '';
    }

    return match[0].split('=')[1];
  };
}

const navigationService = new NavigationService();
export { navigationService as NavigationService };