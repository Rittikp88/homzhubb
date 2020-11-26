import {
  GeolocationError,
  GeolocationOptions,
  GeolocationResponse,
} from '@homzhub/common/src/services/Geolocation/interfaces';
// @ts-ignore
// eslint-disable-next-line import/extensions,import/no-unresolved
import { Geolocation } from './index';

const defaultPositionOptions: GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
};

class GeolocationService {
  public getCurrentPosition = (
    success: (position: GeolocationResponse) => void,
    error: (error: GeolocationError) => void,
    options: GeolocationOptions = defaultPositionOptions
  ): void => {
    Geolocation.getCurrentPosition(success, error, options);
  };
}

const geolocationService = new GeolocationService();
export { geolocationService as GeolocationService };
