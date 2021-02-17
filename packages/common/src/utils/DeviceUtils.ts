import DeviceInfo from 'react-native-device-info';

class DeviceUtils {
  get appVersion(): string {
    return DeviceInfo.getVersion();
  }

  public getDeviceId = (): string => {
    return DeviceInfo.getUniqueId();
  };

  public getAppVersion = (): string => {
    const appBuildNumber = DeviceInfo.getBuildNumber();
    return `App Version v${DeviceInfo.getVersion()} (${appBuildNumber})`;
  };
}

const deviceUtils = new DeviceUtils();
export { deviceUtils as DeviceUtils };
