/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-names */
/* eslint-disable no-console */
import { GeolocationResponse } from '@homzhub/common/src/services/Geolocation/interfaces';
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
    const permission = REQUEST_PERMISSION_TYPE[type][PlatformUtils.getPlatform() as 'web'];
    console.log('REQUEST_PERMISSION_TYPE => ', permission);
    try {
      const permissionStatus = await this.check();
      console.log("permissionStatus => ",permissionStatus);
      if (permissionStatus === RESULTS.GRANTED) {
        return true;
      }
      return await this.requestPermission();
    } catch (e) {
      return false;
    }
  };

  private requestPermission = async (): Promise<boolean> => {
    // Should be a Promise Function
    try {
      const response = await this.request();
      console.log('myResponse => ', response);
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
    const status = this.isLocationAvailable();
    let permissionState;
    const response = await navigator.permissions.query({ name: 'geolocation' }).then(function (permissionStatus) {
      permissionState = permissionStatus.state;
      permissionStatus.onchange = function (): void {
        console.log('geolocation permission status has changed to ', this.state);
      };
      return permissionState;
    });
    if (response === 'granted' && status) {
      return RESULTS.GRANTED;
    }

    return RESULTS.DENIED;
  };

  private request = async (): Promise<RESULTS> => {
    console.log("I reached here")
    let requestPermission: RESULTS = await new Promise((resolve, reject) => {
      const repsonse = navigator.geolocation.getCurrentPosition(
        function (position) {
          console.log(position);
        },
        function (error) {
          console.error(`Error Code = ${error.code} - ${error.message}`);
        }
      );
      console.log(repsonse);
    });
    console.log(requestPermission);
    return requestPermission;
  };
}

const permissionsService = new Permissions();
export { permissionsService as PermissionsServiceWeb };
