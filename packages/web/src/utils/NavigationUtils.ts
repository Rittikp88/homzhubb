import { History, LocationState } from 'history';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';

interface INavigationOptions<S> {
  path: string;
  params?: S;
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

  public errorNavSwitch = (status: string): void => {
    switch (status) {
      case '504':
        this.navigate(this.history, { path: RouteNames.publicRoutes.ERROR504 });
        break;
      case '404':
        this.navigate(this.history, { path: RouteNames.publicRoutes.ERROR404 });
        break;
      default:
        this.navigate(this.history, { path: RouteNames.publicRoutes.ERROR });
    }
  };
}

const navigationUtils = new NavigationUtils();
export { navigationUtils as NavigationUtils };
