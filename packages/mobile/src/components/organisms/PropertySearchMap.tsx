import React from 'react';
import { View, StyleSheet } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { theme } from '@homzhub/common/src/styles/theme';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { PropertyMapCard } from '@homzhub/mobile/src/components/molecules/PropertyMapCard';

interface IState {
  currentSlide: number;
}

const SLIDER_WIDTH = theme.viewport.width - 60;
const MAP_DELTA = 0.1;
const coordinates = [
  { name: 'Burger', latitude: 37.8025259, longitude: -122.4351431, price: 32000 },
  { name: 'Pizza', latitude: 37.7946386, longitude: -122.421646, price: 32000 },
  { name: 'Soup', latitude: 37.7665248, longitude: -122.4165628, price: 32000 },
  { name: 'Sushi', latitude: 37.7834153, longitude: -122.4527787, price: 32000 },
  { name: 'Curry', latitude: 37.7948105, longitude: -122.4596065, price: 32000 },
];

export class PropertySearchMap extends React.PureComponent<{}, IState> {
  private mapRef: MapView | null = null;
  private carouselRef: Carousel<typeof coordinates> | null = null;

  public state = {
    currentSlide: 0,
  };

  public render = (): React.ReactNode => {
    const { currentSlide } = this.state;
    return (
      <>
        <MapView
          ref={(mapRef): void => {
            this.mapRef = mapRef;
          }}
          provider={PROVIDER_GOOGLE}
          style={styles.mapView}
          initialRegion={{
            latitude: 37.8025259,
            longitude: -122.4351431,
            latitudeDelta: MAP_DELTA,
            longitudeDelta: MAP_DELTA,
          }}
        >
          {coordinates.map((coordinate, index) => {
            const { latitude, longitude } = coordinate;
            const onMarkerPress = (): void => {
              this.onMarkerPress(index);
            };
            return (
              <Marker key={coordinate.name} coordinate={{ latitude, longitude }} onPress={onMarkerPress}>
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
          carouselData={coordinates}
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

  private renderCarouselItem = (item: any): React.ReactElement => {
    return (
      <PropertyMapCard
        source={{
          uri:
            'data:image/jpeg;base64,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',
        }}
        name={item.name}
        currency="₹"
        price={item.price}
        priceUnit="month"
        onFavorite={this.onFavorite}
      />
    );
  };

  private onFavorite = (): void => {
    // TODO (Aditya 14/7/2020): Do we require a favourite service?
  };

  public onSnapToItem = (currentSlide: number): void => {
    const { latitude, longitude } = coordinates[currentSlide];
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
