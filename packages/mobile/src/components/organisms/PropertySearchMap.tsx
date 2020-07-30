import React from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import MapView, { Marker, PROVIDER_GOOGLE, LatLng } from 'react-native-maps';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { IUserPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { theme } from '@homzhub/common/src/styles/theme';
import { CustomMarker } from '@homzhub/common/src/components';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { PropertyMapCard } from '@homzhub/mobile/src/components/molecules/PropertyMapCard';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';

interface IState {
  currentSlide: number;
}

interface IProps {
  properties: Asset[];
  transaction_type: number;
  onSelectedProperty: (propertyTermId: number, propertyId: number) => void;
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
          {properties.map((property: Asset, index: number) => {
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
                <CustomMarker selected={index === currentSlide} />
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

  private renderCarouselItem = (item: Asset): React.ReactElement => {
    const { transaction_type, onSelectedProperty } = this.props;
    const {
      attachments,
      projectName,
      floorNumber,
      spaces,
      carpetAreaUnit,
      carpetArea,
      assetGroup: { name },
      leaseTerm,
      saleTerm,
      id,
    } = item;
    const currency = this.getCurrency(item);
    const price = this.getPrice(item);
    const amenities = PropertyUtils.getAmenities(carpetArea, carpetAreaUnit, spaces, floorNumber, name);
    const image = attachments.filter((currentImage: Attachment) => currentImage.isCoverImage);
    const navigateToAssetDetails = (): void => {
      if (leaseTerm) {
        onSelectedProperty(leaseTerm.id, id);
      }
      if (saleTerm) {
        onSelectedProperty(saleTerm.id, id);
      }
    };
    return (
      <PropertyMapCard
        source={{
          uri:
            image.length > 0
              ? image[0].link
              : 'https://www.investopedia.com/thmb/7GOsX_NmY3KrIYoZPWOu6SldNFI=/735x0/houses_and_land-5bfc3326c9e77c0051812eb3.jpg',
        }}
        name={projectName}
        currency={currency}
        price={price}
        priceUnit={transaction_type === 0 ? 'mo' : ''}
        isFavorite={false}
        amenitiesData={amenities}
        onFavorite={this.onFavorite}
        onSelectedProperty={navigateToAssetDetails}
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
    const currentProperty: Asset = properties[currentSlide];
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

  public getCurrency = (item: Asset): string => {
    const { leaseTerm, saleTerm } = item;
    if (leaseTerm) {
      return leaseTerm.currencyCode;
    }
    if (saleTerm) {
      return saleTerm.currencyCode;
    }
    return 'INR';
  };

  public getPrice = (item: Asset): number => {
    const { leaseTerm, saleTerm } = item;
    if (leaseTerm) {
      return Number(leaseTerm.expectedPrice);
    }
    if (saleTerm) {
      return Number(saleTerm.expectedPrice);
    }
    return 0;
  };
}

export default withTranslation()(PropertySearchMap);
const styles = StyleSheet.create({
  mapView: {
    flex: 1,
  },
  carouselStyle: {
    paddingBottom: 10,
    position: 'absolute',
    bottom: 14,
  },
});
