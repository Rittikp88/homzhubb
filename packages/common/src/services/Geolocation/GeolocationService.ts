import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { PERMISSION_TYPE, PermissionsService } from '@homzhub/mobile/src/services/Permissions';
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
    success: ((position: GeolocationResponse) => void) | ((position: GeolocationResponse) => Promise<void>),
    error: (error: GeolocationError) => void,
    options: GeolocationOptions = defaultPositionOptions
  ): void => {
    Geolocation.getCurrentPosition(success, error, options);
  };

  public setLocationDetails = async (isLoggedIn: boolean): Promise<void> => {
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
          if (isLoggedIn) {
            store.dispatch(
              SearchActions.setFilter({
                search_latitude: lat,
                search_longitude: lng,
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
