import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { IRedirectionDetails } from '@homzhub/ffm/src/services/LinkingService';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { IUserTokens, StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { CommonActions as StoreCommonActions } from '@homzhub/common/src/modules/common/actions';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';
import { DynamicLinkParamKeys, DynamicLinkTypes } from '@homzhub/ffm/src/services/constants';

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

    if (!this.navigator) {
      return;
    }

    // Handle private routes inside the below if statement
    if (userData && redirectionLink && shouldRedirect) {
      this.handlePrivateRoutes(redirectionLink);
      return;
    }

    // Otherwise redirect user to the signup screen which has login option too
    if (redirectionLink && shouldRedirect) {
      this.navigator.navigate(ScreenKeys.OnBoarding);
    }
  };

  public handlePrivateRoutes = (url: string): void => {
    const type = this.getValueOfParamFromUrl(DynamicLinkParamKeys.Type, url);
    const visitId = this.getValueOfParamFromUrl(DynamicLinkParamKeys.VisitId, url);

    switch (type) {
      case DynamicLinkTypes.PropertyVisitAssignment:
        this.navigateTo(ScreenKeys.BottomTab, {
          screen: ScreenKeys.SiteVisits,
          params: {
            screen: ScreenKeys.VisitDetail,
            params: { visitId },
          },
        });
        break;
      default:
        AlertHelper.error({ message: I18nService.t('common:invalidLink') });
        break;
    }
  };

  private navigateTo = (stackName: string, params: any): void => {
    const store = StoreProviderService.getStore();
    this.navigator.navigate(stackName, params);
    store.dispatch(StoreCommonActions.setRedirectionDetails({ redirectionLink: '', shouldRedirect: false }));
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
