import { request, check, RESULTS, Permission, PERMISSIONS } from 'react-native-permissions';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';

// List out all required permission types here
export enum PERMISSION_TYPE {
  location = 'location',
}

// Define platform specific permissions for each of the above type here
const PLATFORM_LOCATION_PERMISSIONS = {
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
};

// Final aggregate of all permissions grouped by Platform
export const REQUEST_PERMISSION_TYPE = {
  [PERMISSION_TYPE.location]: PLATFORM_LOCATION_PERMISSIONS,
};

class Permissions {
  public checkPermission = async (type: PERMISSION_TYPE): Promise<boolean> => {
    const permission = REQUEST_PERMISSION_TYPE[type][PlatformUtils.getPlatform() as 'ios' | 'android'];

    try {
      const permissionStatus = await check(permission);
      if (permissionStatus === RESULTS.GRANTED) {
        return true;
      }
      return this.requestPermission(permission);
    } catch (e) {
      return false;
    }
  };

  private requestPermission = async (permission: Permission): Promise<boolean> => {
    try {
      const response = await request(permission);
      return response === RESULTS.GRANTED;
    } catch (e) {
      return false;
    }
  };
}

const permissionsService = new Permissions();
export { permissionsService as PermissionsService };
