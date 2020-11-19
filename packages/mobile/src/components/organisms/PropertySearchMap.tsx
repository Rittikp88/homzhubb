import React from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { Point } from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { CustomMarker } from '@homzhub/common/src/components/atoms/CustomMarker';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { PropertyMapCard } from '@homzhub/mobile/src/components/molecules/PropertyMapCard';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';

interface IState {
  currentSlide: number;
}

interface IProps {
  searchLocation: Point;
  properties: Asset[];
  transaction_type: number;
  onSelectedProperty: (propertyTermId: number, propertyId: number) => void;
  onFavorite: (propertyTermId: number, isFavourite: boolean) => void;
}

type Props = IProps & WithTranslation;
const SLIDER_WIDTH = theme.viewport.width - 60;
const MAP_DELTA = 0.1;

export class PropertySearchMap extends React.PureComponent<Props, IState> {
  private mapRef: MapView | null = null;
  private carouselRef = null;

  public state = {
    currentSlide: 0,
  };

  public componentDidUpdate = (prevProps: Props): void => {
    const { properties, searchLocation } = this.props;
    if (properties.length <= 0) {
      this.animateCamera(searchLocation.lat, searchLocation.lng);
      return;
    }

    if (prevProps.properties.length !== properties.length) {
      this.animateCamera(properties[0].latitude, properties[0].longitude);
      // @ts-ignore
      this.carouselRef.snapToItem(0);
    }
  };

  public render = (): React.ReactNode => {
    const { currentSlide } = this.state;
    const { properties, searchLocation } = this.props;
    let { lat: initLatitude, lng: initLongitude } = searchLocation;

    if (properties.length > 0) {
      initLatitude = properties[0].latitude;
      initLongitude = properties[0].longitude;
    }

    return (
      <>
        <MapView
          ref={(mapRef): void => {
            this.mapRef = mapRef;
          }}
          provider={PROVIDER_GOOGLE}
          style={styles.mapView}
          initialRegion={{
            latitude: initLatitude,
            longitude: initLongitude,
            latitudeDelta: MAP_DELTA,
            longitudeDelta: MAP_DELTA,
          }}
        >
          {properties.map((property: Asset, index: number) => {
            const { latitude, longitude } = property;
            const onMarkerPress = (): void => {
              this.onMarkerPress(index);
            };
            return (
              <Marker key={`${property.id}${index}`} coordinate={{ latitude, longitude }} onPress={onMarkerPress}>
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
          testID="assetSnap"
        />
      </>
    );
  };

  private renderCarouselItem = (item: Asset): React.ReactElement => {
    const { transaction_type, onSelectedProperty, onFavorite } = this.props;
    const {
      attachments,
      projectName,
      furnishing,
      spaces,
      carpetAreaUnit,
      carpetArea,
      assetGroup: { code },
      leaseTerm,
      saleTerm,
      isWishlisted,
      id,
    } = item;
    const price = this.getPrice(item);
    const amenities = PropertyUtils.getAmenities(spaces, furnishing, code, carpetArea, carpetAreaUnit?.title ?? '');
    const image = attachments.filter((currentImage: Attachment) => currentImage.isCoverImage);
    const isFavourite = isWishlisted ? isWishlisted.status : false;

    const navigateToAssetDetails = (): void => {
      if (leaseTerm) {
        onSelectedProperty(leaseTerm.id, id);
      }
      if (saleTerm) {
        onSelectedProperty(saleTerm.id, id);
      }
    };

    const handleFav = (): void => {
      if (leaseTerm) {
        onFavorite(leaseTerm.id, isFavourite);
      }
      if (saleTerm) {
        onFavorite(saleTerm.id, isFavourite);
      }
    };

    return (
      <PropertyMapCard
        source={image[0]?.link ?? null}
        name={projectName}
        currency={item.country.currencies[0]}
        price={price}
        priceUnit={transaction_type === 0 ? 'mo' : ''}
        isFavorite={isFavourite}
        amenitiesData={amenities}
        onFavorite={handleFav}
        onSelectedProperty={navigateToAssetDetails}
      />
    );
  };

  public onSnapToItem = (currentSlide: number): void => {
    const { properties } = this.props;
    const { latitude, longitude } = properties[currentSlide];

    this.animateCamera(latitude, longitude);
    this.setState({ currentSlide });
  };

  private onMarkerPress = (index: number): void => {
    // @ts-ignore
    this.carouselRef.snapToItem(index);
  };

  private animateCamera = (latitude: number, longitude: number): void => {
    this.mapRef?.animateCamera({
      center: {
        longitude,
        latitude,
      },
    });
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
