import { PlatformUtils } from '../utils/PlatformUtils';

const layoutStyles = {
  screenPadding: PlatformUtils.isIOS() ? 20 : 16,
  navToolbarPadding: PlatformUtils.isIOS() ? 20 : 16,
  homeLayoutVerticalMargin: 16,
  navToolbarHeight: PlatformUtils.isIOS() ? 44 : 54,
};

export { layoutStyles as layout };
