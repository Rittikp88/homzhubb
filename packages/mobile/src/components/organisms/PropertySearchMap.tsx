import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import MapView, { Marker, PROVIDER_GOOGLE, LatLng } from 'react-native-maps';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { IUserPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { theme } from '@homzhub/common/src/styles/theme';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { PropertyMapCard } from '@homzhub/mobile/src/components/molecules/PropertyMapCard';
import { IImages, IProperties } from '@homzhub/common/src/domain/models/Search';

interface IState {
  currentSlide: number;
}

interface IProps {
  properties: IProperties[];
  transaction_type: number;
}

type Props = IProps & WithTranslation;
const SLIDER_WIDTH = theme.viewport.width - 60;
const MAP_DELTA = 0.1;

class PropertySearchMap extends React.PureComponent<Props, IState> {
  private mapRef: MapView | null = null;
  private carouselRef = null;

  public state = {
    currentSlide: 0,
  };

  public componentDidUpdate = (prevProps: Props): void => {
    const { properties } = this.props;
    if (prevProps.properties.length <= 0 || properties.length <= 0) {
      return;
    }

    const { latitude, longitude } = prevProps.properties[0];
    const { latitude: newLat, longitude: newLong } = properties[0];
    if (newLat !== latitude || newLong !== longitude) {
      this.mapRef?.animateCamera({
        center: {
          longitude: Number(newLong),
          latitude: Number(newLat),
        },
      });
    }
  };

  public render = (): React.ReactNode => {
    const { currentSlide } = this.state;
    const { properties } = this.props;
    const initialMarker: LatLng = {
      latitude: properties.length > 0 ? Number(properties[0].latitude) : 12.9716,
      longitude: properties.length > 0 ? Number(properties[0].longitude) : 77.5946,
    };
    return (
      <>
        <MapView
          ref={(mapRef): void => {
            this.mapRef = mapRef;
          }}
          provider={PROVIDER_GOOGLE}
          style={styles.mapView}
          region={{
            latitude: initialMarker.latitude,
            longitude: initialMarker.longitude,
            latitudeDelta: MAP_DELTA,
            longitudeDelta: MAP_DELTA,
          }}
          initialRegion={{
            latitude: initialMarker.latitude,
            longitude: initialMarker.longitude,
            latitudeDelta: MAP_DELTA,
            longitudeDelta: MAP_DELTA,
          }}
        >
          {properties.map((property: IProperties, index) => {
            const marker: LatLng = {
              latitude: Number(property.latitude),
              longitude: Number(property.longitude),
            };
            const { latitude, longitude } = marker;
            const onMarkerPress = (): void => {
              this.onMarkerPress(index);
            };
            return (
              <Marker key={property.id} coordinate={{ latitude, longitude }} onPress={onMarkerPress}>
                {index === currentSlide ? (
                  <View style={styles.selectedMarker}>
                    <View style={styles.marker} />
                  </View>
                ) : (
                  <View style={styles.marker} />
                )}
              </Marker>
            );
          })}
        </MapView>
        <SnapCarousel
          containerStyle={styles.carouselStyle}
          carouselData={properties}
          activeIndex={currentSlide}
          itemWidth={SLIDER_WIDTH}
          carouselItem={this.renderCarouselItem}
          onSnapToItem={this.onSnapToItem}
          bubbleRef={(ref): void => {
            this.carouselRef = ref;
          }}
        />
      </>
    );
  };

  private renderCarouselItem = (item: IProperties): React.ReactElement => {
    const { transaction_type } = this.props;
    const { images, project_name } = item;
    const currency = this.getCurrency(item);
    const price = this.getPrice(item);
    const amenities = PropertyUtils.getAmenities(item);
    const image = images.filter((currentImage: IImages) => currentImage.is_cover_image);
    return (
      <PropertyMapCard
        source={{
          uri:
            image.length > 0
              ? image[0].link
              : 'https://www.investopedia.com/thmb/7GOsX_NmY3KrIYoZPWOu6SldNFI=/735x0/houses_and_land-5bfc3326c9e77c0051812eb3.jpg',
        }}
        name={project_name}
        currency={currency}
        price={price}
        priceUnit={transaction_type === 0 ? 'mo' : ''}
        isFavorite={false}
        amenitiesData={amenities}
        onFavorite={this.onFavorite}
      />
    );
  };

  private onFavorite = async (): Promise<void> => {
    const { t } = this.props;
    const user: IUserPayload | null = (await StorageService.get(StorageKeys.USER)) ?? null;
    if (!user) {
      AlertHelper.error({ message: t('common:loginToContinue') });
    }
    // TODO: Call the api from favorite service
  };

  public onSnapToItem = (currentSlide: number): void => {
    const { properties } = this.props;
    const currentProperty: IProperties = properties[currentSlide];
    const marker: LatLng = {
      latitude: Number(currentProperty.latitude),
      longitude: Number(currentProperty.longitude),
    };
    const { latitude, longitude } = marker;
    this.mapRef?.animateCamera({
      center: {
        longitude,
        latitude,
      },
    });
    this.setState({ currentSlide });
  };

  private onMarkerPress = (index: number): void => {
    // @ts-ignore
    this.carouselRef.snapToItem(index);
  };

  public getCurrency = (item: IProperties): string => {
    const { lease_term, sale_term } = item;
    if (lease_term) {
      return lease_term.currency_code;
    }
    if (sale_term) {
      return sale_term.currency_code;
    }
    return 'INR';
  };

  public getPrice = (item: IProperties): number => {
    const { lease_term, sale_term } = item;
    if (lease_term) {
      return Number(lease_term.expected_price);
    }
    if (sale_term) {
      return Number(sale_term.expected_price);
    }
    return 0;
  };
}

export default withTranslation()(PropertySearchMap);
const styles = StyleSheet.create({
  mapView: {
    flex: 1,
  },
  marker: {
    width: 16,
    height: 16,
    borderRadius: 16 / 2,
    backgroundColor: theme.colors.primaryColor,
  },
  selectedMarker: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: theme.colors.markerOpacity,
  },
  carouselStyle: {
    paddingBottom: 10,
    position: 'absolute',
    bottom: 14,
  },
});
