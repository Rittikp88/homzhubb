import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import MapView, { LatLng, MapEvent, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { ResponseHelper } from '@homzhub/common/src/services/GooglePlaces/ResponseHelper';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button, Label, WithShadowView } from '@homzhub/common/src/components';
import { Header } from '@homzhub/mobile/src/components';
import { GooglePlaceDetail } from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';

type Props = WithTranslation & NavigationScreenProps<PropertyPostStackParamList, ScreensKeys.AssetLocationMap>;

interface IOwnState {
  markerLatLng: LatLng;
}

export class AssetLocationMap extends React.PureComponent<Props, IOwnState> {
  private mapRef: MapView | null = null;
  public constructor(props: Props) {
    super(props);
    const {
      route: { params },
    } = props;
    const {
      placeData: {
        geometry: {
          location: { lat, lng },
        },
      },
    } = params;
    this.state = {
      markerLatLng: {
        latitude: lat,
        longitude: lng,
      },
    };
  }

  public render(): React.ReactNode {
    const { markerLatLng } = this.state;
    const { t } = this.props;

    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <MapView
          ref={(mapRef): void => {
            this.mapRef = mapRef;
          }}
          provider={PROVIDER_GOOGLE}
          style={styles.mapView}
          initialRegion={{
            ...markerLatLng,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          }}
        >
          <Marker draggable coordinate={markerLatLng} onDragEnd={this.onMarkerDragEnd} />
        </MapView>
        <WithShadowView outerViewStyle={styles.shadowView}>
          <Button
            type="primary"
            title={t('setLocation')}
            containerStyle={styles.buttonStyle}
            onPress={this.onPressSetLocation}
          />
        </WithShadowView>
      </View>
    );
  }

  private renderHeader = (): React.ReactNode => {
    const {
      t,
      route: { params },
    } = this.props;
    const { placeData } = params;
    return (
      <>
        <Header
          isBarVisible={false}
          type="primary"
          icon={icons.leftArrow}
          onIconPress={this.onBackPress}
          title={t('common:location')}
          testID="location"
        />
        <View style={styles.titleContainer}>
          <Label type="large" textType="semiBold" style={styles.titlePrimary}>
            {`${placeData.name ?? ''}\n${placeData.formatted_address}`}
          </Label>
        </View>
      </>
    );
  };

  private onPressSetLocation = (): void => {
    const {
      route: {
        params: { placeData },
      },
      navigation: { navigate },
    } = this.props;
    const {
      name,
      formatted_address,
      geometry: {
        location: { lat, lng },
      },
    } = placeData;
    const { state, city, country, pincode } = ResponseHelper.getLocationDetails(placeData);
    navigate(ScreensKeys.PostAssetDetails, {
      lat,
      lng,
      name,
      address: formatted_address,
      city,
      pincode,
      country,
      state,
    });
  };

  private onMarkerDragEnd = (event: MapEvent): void => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const {
      navigation: { setParams },
    } = this.props;

    GooglePlacesService.getLocationData({ lng: longitude, lat: latitude })
      .then((locData) => {
        GooglePlacesService.getPlaceDetail(locData.place_id)
          .then((placeData: GooglePlaceDetail) => {
            setParams({ placeData });
          })
          .catch((e: Error): void => {
            AlertHelper.error({ message: e.message });
          });

        this.setState({
          markerLatLng: {
            longitude,
            latitude,
          },
        });
        this.mapRef?.animateCamera({
          center: {
            longitude,
            latitude,
          },
        });
      })
      .catch((e: Error): void => {
        AlertHelper.error({ message: e.message });
      });
  };

  private onBackPress = (): void => {
    const {
      navigation: { goBack },
    } = this.props;
    goBack();
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  mapView: {
    flex: 1,
  },
  titleContainer: {
    backgroundColor: theme.colors.primaryColor,
    paddingHorizontal: 16,
  },
  titlePrimary: {
    marginTop: 4,
    marginBottom: 8,
    color: theme.colors.white,
  },
  shadowView: {
    marginBottom: PlatformUtils.isIOS() ? 20 : 0,
    paddingBottom: 0,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
});

export default withTranslation(LocaleConstants.namespacesKey.property)(AssetLocationMap);
