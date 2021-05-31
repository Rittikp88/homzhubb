import { showMessage } from 'react-native-flash-message';
import { History, LocationState } from 'history';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { theme } from '@homzhub/common/src/styles/theme';

interface INavigationOptions<S> {
  path: string;
  params?: S;
}

interface IErrorMessageProps {
  message: string;
}

class NavigationUtils<T extends History> {
  private navigator: any;
  private history: any;
  get navigation(): any {
    return this.navigator;
  }

  get appHistory(): any {
    return this.history;
  }

  public setTopLevelNavigator = (navigatorRef: any): void => {
    this.navigator = navigatorRef;
    this.history = navigatorRef.history;
  };

  public navigate<S = LocationState>(navigationProps: T, options: INavigationOptions<S>): void {
    const { path, params = undefined } = options;
    navigationProps.push(path, params);
  }

  public goBack(navigationProps: T): void {
    navigationProps.goBack();
  }

  public openNewTab<S = LocationState>(options: INavigationOptions<S>): void {
    const { path } = options;
    const newWindow = window.open(path, '_blank');
    if (newWindow) {
      newWindow.focus();
    }
  }

  public errorNavSwitch = (status: number, messageProps: IErrorMessageProps): void => {
    const statusCode = Number(status) >= 500 && Number(status) !== 504 ? 500 : Number(status);
    const { message } = messageProps;
    switch (statusCode) {
      case 504:
        this.navigate(this.history, { path: RouteNames.publicRoutes.ERROR504 });
        break;
      case 404:
        this.navigate(this.history, { path: RouteNames.publicRoutes.ERROR404 });
        break;
      case 500:
        this.navigate(this.history, { path: RouteNames.publicRoutes.ERROR });
        break;
      default:
        showMessage({
          duration: 5000,
          message,
          type: 'danger',
          backgroundColor: theme.colors.error,
        });
    }
  };
}

const navigationUtils = new NavigationUtils();
export { navigationUtils as NavigationUtils };
