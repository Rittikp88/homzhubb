/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-names */
/* eslint-disable no-console */
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
// List out all required permission types here
export enum PERMISSION_TYPE_WEB {
  location = 'location',
}

export enum PERMISSION_STATE {
  GRANTED = 'granted',
  DENIED = 'denied',
  PROMPT = 'prompt',
}
// Define platform specific permissions for each of the above type here
const PLATFORM_LOCATION_PERMISSIONS = {
  //   ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  //   android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  web: 'web.permission.LOCATION_WHEN_IN_USE',
};

// Final aggregate of all permissions grouped by Platform
export const REQUEST_PERMISSION_TYPE = {
  [PERMISSION_TYPE_WEB.location]: PLATFORM_LOCATION_PERMISSIONS,
};

class Permissions {
  public checkPermission = async (type: PERMISSION_TYPE_WEB): Promise<boolean> => {
    // Should be a Promise Function
    const permission = REQUEST_PERMISSION_TYPE[type][PlatformUtils.getPlatform() as 'web'];
    console.log('REQUEST_PERMISSION_TYPE => ', permission);
    try {
      const permissionStatus = await this.check();
      //   const permissionStatus = await check(permission);
      if (permissionStatus === PERMISSION_STATE.GRANTED) {
        return true;
      }
      return this.requestPermission(permission);
    } catch (e) {
      return false;
    }
  };

  private requestPermission = (permission: any): boolean => {
    // Should be a Promise Function
    try {
      const response = this.request(permission);
      return response === true;
    } catch (e) {
      return false;
    }
  };

  private isLocationAvailable = (): boolean => {
    if ('geolocation' in navigator) {
      return true;
    }
    return false;
  };

  private check = async (): Promise<string> => {
    const status = this.isLocationAvailable();
    console.log('isLocationAvailable() status => ', status);
    let permissionState;
    const response = await navigator.permissions.query({ name: 'geolocation' }).then(function (permissionStatus) {
      console.log('geolocation permission status is ', permissionStatus.state);
      permissionState = permissionStatus.state;
      permissionStatus.onchange = function (): void {
        console.log('geolocation permission status has changed to ', this.state);
      };
      return permissionState;
    });
    console.log('mystate => ', response);
    if (permissionState === 'granted' && status) {
      return PERMISSION_STATE.GRANTED;
    }

    return PERMISSION_STATE.DENIED;
  };

  private request = (permission: boolean): boolean => {
    console.log('request() permission args => ', permission);
    let requestPermission = false;
    navigator.geolocation.getCurrentPosition(
      function (position) {
        console.log('geolocation.getCurrentPosition => ', position);
        requestPermission = true;
      },
      function (error) {
        console.error(`Error Code = ${error.code} - ${error.message}`);
        requestPermission = false;
      }
    );
    return requestPermission;
  };
}

const permissionsService = new Permissions();
export { permissionsService as PermissionsServiceWeb };
