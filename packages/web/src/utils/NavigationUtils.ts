import { History, LocationState } from 'history';

interface INavigationOptions<S> {
  path: string;
  params?: S;
}

class NavigationUtils<T extends History> {
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
}

const navigationUtils = new NavigationUtils();
export { navigationUtils as NavigationUtils };
