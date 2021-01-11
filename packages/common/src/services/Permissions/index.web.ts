import { PERMISSION_TYPE } from '@homzhub/common/src/constants/PermissionTypes';

// enum RESULTS {
//   GRANTED = 'granted',
//   DENIED = 'denied',
//   PROMPT = 'prompt',
// }
//
// const isLocationAvailable = (): boolean => {
//   return 'geolocation' in navigator;
// };
//
// const permissionStatus = (state: string): RESULTS => {
//   if (state === RESULTS.GRANTED) {
//     return RESULTS.GRANTED;
//   }
//   if (state === RESULTS.PROMPT) {
//     return RESULTS.PROMPT;
//   }
//   return RESULTS.DENIED;
// };
//
// class Permissions {
//   public checkPermission = async (type: PERMISSION_TYPE): Promise<boolean> => {
//     if (type === PERMISSION_TYPE.location) {
//       try {
//         await this.requestPermission((status) => console.log(` location permission => -----${status}`));
//       } catch (e) {
//         console.log(e);
//       }
//     }
//     return Promise.resolve(true);
//   };
//
//   private requestPermission = async (report: (status: RESULTS) => void): Promise<void> => {
//     if (isLocationAvailable()) {
//       await navigator.permissions.query({ name: 'geolocation' }).then((result): void => {
//         result.onchange = (): void => {
//           report(permissionStatus(result.state));
//         };
//         report(permissionStatus(result.state));
//       });
//     } else {
//       console.log('location unavailable');
//     }
//   };
// }

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
      console.log('permissionStatus => ', permissionStatus);
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
    const requestPermission: RESULTS = await new Promise((resolve, reject) => {
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
export { permissionsService as PermissionsService };
