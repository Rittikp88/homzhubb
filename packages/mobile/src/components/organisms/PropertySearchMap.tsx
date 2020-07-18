import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, LatLng } from 'react-native-maps';
import { SpaceAvailableTypes } from '@homzhub/common/src/domain/repositories/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { PropertyMapCard } from '@homzhub/mobile/src/components/molecules/PropertyMapCard';
import { IImages, IProperties, ISpaces } from '@homzhub/common/src/domain/models/Search';

interface IState {
  currentSlide: number;
}

interface IProps {
  properties: IProperties[];
}

const SLIDER_WIDTH = theme.viewport.width - 60;
const MAP_DELTA = 0.1;

export class PropertySearchMap extends React.PureComponent<IProps, IState> {
  private mapRef: MapView | null = null;
  private carouselRef = null;

  public state = {
    currentSlide: 0,
  };

  public render = (): React.ReactNode => {
    const { currentSlide } = this.state;
    const { properties } = this.props;
    if (properties.length === 0) {
      return null;
    }
    const initialMarker: LatLng = {
      latitude: Number(properties[0].latitude),
      longitude: Number(properties[0].longitude),
    };
    return (
      <>
        <MapView
          ref={(mapRef): void => {
            this.mapRef = mapRef;
          }}
          provider={PROVIDER_GOOGLE}
          style={styles.mapView}
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
              <Marker key={property.project_name} coordinate={{ latitude, longitude }} onPress={onMarkerPress}>
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
    const {
      images,
      project_name,
      carpet_area,
      carpet_area_unit,
      spaces,
      lease_term: { expected_price, currency_code },
    } = item;
    const bedroom: ISpaces[] = spaces.filter((space: ISpaces) => {
      return space.name === SpaceAvailableTypes.BEDROOM;
    });
    const bathroom: ISpaces[] = spaces.filter((space: ISpaces) => {
      return space.name === SpaceAvailableTypes.BATHROOM;
    });
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
        currency={currency_code}
        price={Number(expected_price)}
        priceUnit="month"
        bedroom={bedroom[0].count.toString() ?? '-'}
        bathroom={bathroom[0].count.toString() ?? '-'}
        carpetArea="1000 Sqft"
        onFavorite={this.onFavorite}
      />
    );
  };

  private onFavorite = (): void => {
    // TODO (Aditya 14/7/2020): Do we require a favourite service?
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
}

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
