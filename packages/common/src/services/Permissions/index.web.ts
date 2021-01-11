// List out all required permission types here
export enum PERMISSION_TYPE_WEB {
  location = 'location',
}
enum RESULTS {
  GRANTED = 'granted',
  DENIED = 'denied',
  PROMPT = 'prompt',
}

class Permissions {
  public checkPermission = async (type: PERMISSION_TYPE_WEB): Promise<boolean> => {
    // Should be a Promise Function
    try {
      const permissionStatus = await this.check();
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
      return response === RESULTS.GRANTED;
    } catch (e) {
      return false;
    }
  };

  private isLocationAvailable = (): boolean => {
    return 'geolocation' in navigator;
  };

  private check = async (): Promise<RESULTS> => {
    const status = this.isLocationAvailable();
    let permissionState;
    const response = await navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
      permissionState = permissionStatus.state;
      permissionStatus.onchange = (): void => {
        // handle permission change Here
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
        (position) => {
          console.log(position);
        },
        (error) => {
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
