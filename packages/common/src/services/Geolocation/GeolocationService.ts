/* eslint-disable @typescript-eslint/ban-ts-comment */
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { PermissionsService } from '@homzhub/common/src/services/Permissions/PermissionService';
import {
  GeolocationError,
  GeolocationOptions,
  GeolocationResponse,
} from '@homzhub/common/src/services/Geolocation/interfaces';
import { PERMISSION_TYPE } from '@homzhub/common/src/constants/PermissionTypes';
// @ts-ignore
// eslint-disable-next-line import/extensions,import/no-unresolved
import { Geolocation } from './index';

const defaultPositionOptions: GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
};

class GeolocationService {
  public getCurrentPosition = (
    success: ((position: GeolocationResponse) => void) | ((position: GeolocationResponse) => Promise<void>),
    error: (error: GeolocationError) => void,
    options: GeolocationOptions = defaultPositionOptions
  ): void => {
    Geolocation.getCurrentPosition(success, error, options);
  };

  public setLocationDetails = async (isLoggedIn: boolean, searchAddress: string): Promise<void> => {
    const store = StoreProviderService.getStore();
    const permission = await PermissionsService.checkPermission(PERMISSION_TYPE.location);
    let deviceCountry = 'IN';
    if (permission) {
      this.getCurrentPosition(
        async (data: GeolocationResponse): Promise<void> => {
          const { latitude: lat, longitude: lng } = data.coords;
          const deviceLocation = await GooglePlacesService.getLocationData({
            lat,
            lng,
          });

          const country = deviceLocation.address_components.find((address) => address.types.includes('country'));
          deviceCountry = country?.short_name ?? deviceCountry;
          if (isLoggedIn && !searchAddress) {
            store.dispatch(
              SearchActions.setFilter({
                search_latitude: lat,
                search_longitude: lng,
                user_location_latitude: lat,
                user_location_longitude: lng,
                search_address: deviceLocation.formatted_address,
              })
            );
          }
        },
        (error: GeolocationError) => {}
      );
    }
    store.dispatch(CommonActions.setDeviceCountry(deviceCountry));
  };
}

const geolocationService = new GeolocationService();
export { geolocationService as GeolocationService };
