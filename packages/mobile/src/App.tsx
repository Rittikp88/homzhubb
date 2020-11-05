import React from 'react';
import { Provider } from 'react-redux';
import FlashMessage, { MessageComponentProps } from 'react-native-flash-message';
import { GeolocationError, GeolocationResponse } from '@react-native-community/geolocation';
import { GeolocationService } from '@homzhub/common/src/services/Geolocation/GeolocationService';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { PERMISSION_TYPE, PermissionsService } from '@homzhub/mobile/src/services/Permissions';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { IUserTokens, StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { configureStore } from '@homzhub/common/src/modules/store';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { RootNavigator } from '@homzhub/mobile/src/navigation/RootNavigator';
import { Toast } from '@homzhub/mobile/src/components/molecules/Toast';
import { BlankScreen } from '@homzhub/mobile/src/screens/BlankScreen'; // For Testing on UI
import { SupportedLanguages } from '@homzhub/common/src/services/Localization/constants';

interface IState {
  booting: boolean;
  showBlankScreen: boolean; // For Testing on UI
}

StoreProviderService.init(configureStore);
const store = StoreProviderService.getStore();

export default class App extends React.PureComponent<{}, IState> {
  public state = {
    booting: true,
    showBlankScreen: false, // For Testing on UI, change to false for regular flow
  };

  public componentDidMount = async (): Promise<void> => {
    await this.bootUp();
  };

  public render = (): React.ReactNode => {
    const { booting, showBlankScreen } = this.state;
    // For UI Testing Remove once app goes live
    if (showBlankScreen) {
      return <BlankScreen />;
    }

    return (
      <Provider store={store}>
        <RootNavigator booting={booting} />
        <FlashMessage position="bottom" MessageComponent={this.renderToast} />
      </Provider>
    );
  };

  private renderToast = (props: MessageComponentProps): React.ReactElement => <Toast {...props} />;

  private bootUp = async (): Promise<void> => {
    // FETCH COUNTRY OF THE DEVICE
    const permission = await PermissionsService.checkPermission(PERMISSION_TYPE.location);

    let deviceCountry = 'IN';
    if (permission) {
      GeolocationService.getCurrentPosition(
        async (data: GeolocationResponse) => {
          const { latitude: lat, longitude: lng } = data.coords;
          const deviceLocation = await GooglePlacesService.getLocationData({
            lat,
            lng,
          });

          const country = deviceLocation.address_components.find((address) => address.types.includes('country'));
          deviceCountry = country?.short_name ?? deviceCountry;
          store.dispatch(
            SearchActions.setFilter({
              search_latitude: lat,
              search_longitude: lng,
              search_address: deviceLocation.formatted_address,
            })
          );
        },
        (error: GeolocationError) => {}
      );
    }
    store.dispatch(CommonActions.setDeviceCountry(deviceCountry));
    store.dispatch(CommonActions.getCountries());

    const isOnBoardingCompleted = (await StorageService.get<boolean>(StorageKeys.IS_ONBOARDING_COMPLETED)) ?? false;
    store.dispatch(UserActions.updateOnBoarding(isOnBoardingCompleted));

    const userData = await StorageService.get<IUserTokens>(StorageKeys.USER);
    if (userData) {
      store.dispatch(UserActions.loginSuccess(userData));
      store.dispatch(UserActions.getUserProfile());
      store.dispatch(UserActions.getUserPreferences());
      store.dispatch(AssetActions.getAssetCount());
    }

    const selectedLanguage: SupportedLanguages | null = await StorageService.get(StorageKeys.USER_SELECTED_LANGUAGE);
    await I18nService.init(selectedLanguage || undefined);

    setTimeout(() => {
      this.setState({ booting: false });
    }, 500);
  };
}
