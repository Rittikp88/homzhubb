/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-names */
/* eslint-disable no-console */
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
// List out all required permission types here
export enum PERMISSION_TYPE_WEB {
  location = 'location',
}

interface IPermissionState {
  GRANTED: 'granted';
  DENIED: 'denied';
  PROMPT: 'prompt';
}
enum RESULTS {
  GRANTED = 'granted',
  DENIED = 'denied',
  PROMPT = 'prompt',
}
type Permission = IPermissionState;
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
    // const permission = REQUEST_PERMISSION_TYPE[type][PlatformUtils.getPlatform() as 'web'];
    // console.log('REQUEST_PERMISSION_TYPE => ', permission);
    try {
      const permissionStatus = await this.check();
      // const permissionStatus = RESULTS.GRANTED;
      console.log('permissionStatus parent => ', permissionStatus);
      if (permissionStatus === RESULTS.GRANTED) {
        return true;
      }
      return this.requestPermission();
    } catch (e) {
      return false;
    }
  };

  private requestPermission = async (): Promise<boolean> => {
    // Should be a Promise Function
    try {
      const response = await this.request();
      return response === RESULTS.GRANTED;
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

  private check = async (): Promise<RESULTS> => {
    // const status = this.isLocationAvailable();
    // console.log('isLocationAvailable() status => ', status);

    // const permissionState = await navigator.permissions
    //   .query({ name: 'geolocation' })
    //   .then(function (permissionStatus) {
    //     console.log('geolocation permission status is ', permissionStatus.state);
    //     // permissionState = permissionStatus.state;
    //     permissionStatus.onchange = function (): string {
    //       console.log('geolocation permission status has changed to ', this.state);
    //       if (permissionStatus.state === RESULTS.GRANTED) {
    //         return permissionStatus.state;
    //       }
    //       return RESULTS.DENIED;
    //     };
    //     return permissionStatus.state;
    //   });
    // console.log('mystate => ', permissionState);
    // if (permissionState === 'granted' && status) {
    //   return RESULTS.GRANTED;
    // }

    return RESULTS.DENIED;
  };

  private request = (): RESULTS => {
    let requestPermission: RESULTS = RESULTS.PROMPT;
    navigator.geolocation.getCurrentPosition(
      function (position) {
        console.log('geolocation.getCurrentPosition => ', position);
        requestPermission = RESULTS.GRANTED;
      },
      function (error) {
        console.log(`Error Code = ${error.code} - ${error.message}`);
        requestPermission = RESULTS.DENIED;
      }
    );
    return requestPermission;
  };
}

const permissionsService = new Permissions();
export { permissionsService as PermissionsServiceWeb };
