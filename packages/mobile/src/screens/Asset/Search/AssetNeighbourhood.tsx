import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { WithTranslation, withTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { PointOfInterest } from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { PlaceTypes } from '@homzhub/common/src/services/GooglePlaces/constants';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { CustomMarker, SelectionPicker } from '@homzhub/common/src/components';
import { BottomSheet } from '@homzhub/mobile/src/components/molecules/BottomSheet';
import { ExploreSections } from '@homzhub/mobile/src/components/molecules/ExploreSections';
import { Header } from '@homzhub/mobile/src/components/molecules/Header';
import { RootStackParamList } from '@homzhub/mobile/src/navigation/SearchStackNavigator';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { Asset } from '@homzhub/common/src/domain/models/Asset';

// CONSTANTS & ENUMS
enum Tabs {
  Nearby = 0,
  Commute = 1,
}
const COMMUTE = [
  { key: PlaceTypes.Railway, label: 'Railway Station', icon: icons.train, mapMarker: icons.trainMarker },
  { key: PlaceTypes.BusStation, label: 'Bus Station', icon: icons.bus, mapMarker: icons.busMarker },
  { key: PlaceTypes.Airport, label: 'Airport', icon: icons.airport, mapMarker: icons.airportMarker },
];
const NEARBY = [
  { key: PlaceTypes.School, label: 'School', icon: icons.school, mapMarker: icons.schoolMarker },
  { key: PlaceTypes.Mall, label: 'Mall', icon: icons.mall, mapMarker: icons.mallMarker },
  { key: PlaceTypes.Restaurant, label: 'Restaurant', icon: icons.restaurant, mapMarker: icons.restaurantMarker },
  { key: PlaceTypes.GasStation, label: 'Fuel Station', icon: icons.fuel, mapMarker: icons.fuelMarker },
  { key: PlaceTypes.Hospital, label: 'Hospital', icon: icons.hospital, mapMarker: icons.hospitalMarker },
  { key: PlaceTypes.Groceries, label: 'Groceries', icon: icons.grocery, mapMarker: icons.groceryMarker },
  { key: PlaceTypes.Park, label: 'Park', icon: icons.park, mapMarker: icons.parkMarker },
  { key: PlaceTypes.FilmTheater, label: 'Theater', icon: icons.cinema, mapMarker: icons.cinemaMarker },
  { key: PlaceTypes.Atm, label: 'ATM', icon: icons.bank, mapMarker: icons.bankMarker },
  { key: PlaceTypes.Chemist, label: 'Chemist', icon: icons.chemist, mapMarker: icons.chemistMarker },
  { key: PlaceTypes.Lodging, label: 'Hotel', icon: icons.lodge, mapMarker: icons.lodgeMarker },
];

const EXPANDED = theme.viewport.height * 0.5;

// INTERFACES & TYPES
interface IStateProps {
  asset: Asset | null;
}
interface IOwnState {
  selectedTab: Tabs;
  selectedPlaceType: PlaceTypes;
  isBottomSheetVisible: boolean;
  pointsOfInterest: PointOfInterest[];
  selectedPlaceId: string;
}

type libraryProps = WithTranslation & NavigationScreenProps<RootStackParamList, ScreensKeys.AssetNeighbourhood>;
type Props = IStateProps & libraryProps;

class AssetNeighbourhood extends React.PureComponent<Props, IOwnState> {
  private mapRef: MapView | null = null;

  public state = {
    isBottomSheetVisible: true,
    selectedTab: Tabs.Nearby,
    selectedPlaceType: NEARBY[0].key,
    pointsOfInterest: [],
    selectedPlaceId: '',
  };

  public componentDidMount = async (): Promise<void> => {
    await this.fetchPOIs();
  };

  public render = (): React.ReactNode => {
    const { asset, t } = this.props;
    const { selectedTab, selectedPlaceType, isBottomSheetVisible, pointsOfInterest, selectedPlaceId } = this.state;

    if (!asset) return null;
    const {
      assetLocation: { longitude, latitude },
    } = asset;

    return (
      <View style={styles.container}>
        <Header
          icon={icons.leftArrow}
          onIconPress={this.onBackPress}
          isHeadingVisible
          title={asset.projectName}
          titleType="small"
          titleFontType="semiBold"
          backgroundColor={theme.colors.white}
        />
        <MapView
          ref={(mapRef: MapView): void => {
            this.mapRef = mapRef;
          }}
          provider={PROVIDER_GOOGLE}
          style={styles.mapView}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          <Marker coordinate={{ latitude, longitude }}>
            <CustomMarker selected />
          </Marker>
          {this.renderMarkers()}
        </MapView>
        <View style={styles.floatingTab}>
          <SelectionPicker
            data={[
              { title: t('nearby'), value: Tabs.Nearby },
              { title: t('commute'), value: Tabs.Commute },
            ]}
            selectedItem={[selectedTab]}
            onValueChange={this.onTabChange}
          />
        </View>
        <BottomSheet
          visible={isBottomSheetVisible}
          renderHeader={false}
          sheetHeight={EXPANDED}
          onCloseSheet={this.onBottomSheetClose}
        >
          <ExploreSections
            sections={selectedTab === Tabs.Nearby ? NEARBY : COMMUTE}
            selectedPlaceType={selectedPlaceType}
            selectedPlaceId={selectedPlaceId}
            onSectionChange={this.onPlaceTypeChange}
            onPoiPress={this.onPoiPress}
            results={pointsOfInterest}
          />
        </BottomSheet>
      </View>
    );
  };

  private renderMarkers = (): React.ReactNode => {
    const { pointsOfInterest, selectedPlaceId, selectedTab, selectedPlaceType } = this.state;
    let placeType = COMMUTE.find((commuteItem) => commuteItem.key === selectedPlaceType);

    if (selectedTab === Tabs.Nearby) {
      placeType = NEARBY.find((commuteItem) => commuteItem.key === selectedPlaceType);
    }

    return pointsOfInterest.map((point: PointOfInterest) => (
      <Marker key={point.placeId} coordinate={{ latitude: point.latitude, longitude: point.longitude }}>
        <Icon
          name={placeType?.mapMarker}
          color={selectedPlaceId === point.placeId ? theme.colors.active : theme.colors.darkTint5}
          size={24}
        />
      </Marker>
    ));
  };

  private onTabChange = (selectedTab: Tabs): void => {
    let placeTypeToUpdate = COMMUTE[0].key;

    if (selectedTab === Tabs.Nearby) {
      placeTypeToUpdate = NEARBY[0].key;
    }

    this.setState({ selectedTab, selectedPlaceType: placeTypeToUpdate, isBottomSheetVisible: true });
  };

  private onPlaceTypeChange = (selectedPlaceType: PlaceTypes): void => {
    this.setState({ selectedPlaceType }, () => {
      this.fetchPOIs().then();
    });
  };

  private onBottomSheetClose = (): void => {
    this.setState({ isBottomSheetVisible: false });
  };

  private onPoiPress = (poi: PointOfInterest): void => {
    const { latitude, longitude, placeId } = poi;
    this.setState({ selectedPlaceId: placeId });
    this.mapRef?.animateCamera({
      center: {
        latitude,
        longitude,
      },
    });
  };

  private onBackPress = (): void => {
    const {
      navigation: { goBack },
    } = this.props;
    goBack();
  };

  private fetchPOIs = async (): Promise<void> => {
    const { selectedPlaceType } = this.state;
    const { asset } = this.props;

    if (!asset) return;
    const { assetLocation } = asset;

    try {
      const pointsOfInterest = await GooglePlacesService.getPOIs(assetLocation, selectedPlaceType);
      this.setState({ pointsOfInterest });
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapView: {
    flex: 1,
  },
  floatingTab: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: theme.viewport.height * 0.12,
    alignItems: 'center',
  },
});

const mapStateToProps = (state: IState): IStateProps => {
  const { getAsset } = AssetSelectors;
  return {
    asset: getAsset(state),
  };
};

const connectedComponent = connect(
  mapStateToProps,
  null
)(withTranslation(LocaleConstants.namespacesKey.assetDescription)(AssetNeighbourhood));
export { connectedComponent as AssetNeighbourhood };
