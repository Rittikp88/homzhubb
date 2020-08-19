import React from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import MapView, { LatLng, MapEvent, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { FormikActions, FormikValues } from 'formik';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { MathUtils } from '@homzhub/common/src/utils/MathUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { ICreateAssetDetails, IUpdateAssetDetails } from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { PropertyActions } from '@homzhub/common/src/modules/property/actions';
import { PropertySelector } from '@homzhub/common/src/modules/property/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button, Label, Text, WithShadowView } from '@homzhub/common/src/components';
import { BottomSheet, Header, SetLocationForm } from '@homzhub/mobile/src/components';
import { PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IStateProps {
  propertyId: number;
}
interface IDispatchProps {
  setCurrentPropertyId: (propertyId: number) => void;
}
type OwnProps = WithTranslation & NavigationScreenProps<PropertyPostStackParamList, ScreensKeys.PostPropertyMap>;
type Props = OwnProps & IStateProps & IDispatchProps;

interface IAddPropertyState {
  markerLatLng: LatLng;
  isVisible: boolean;
  location: {
    projectName: string;
    unitNo: string;
    blockNo: string;
  };
}

export class AssetLocationMap extends React.PureComponent<Props, IAddPropertyState> {
  private mapRef: MapView | null = null;
  public constructor(props: Props) {
    super(props);
    const {
      route: { params },
    } = props;
    const { initialLatitude, initialLongitude, primaryTitle, secondaryTitle } = params;
    this.state = {
      markerLatLng: {
        latitude: initialLatitude,
        longitude: initialLongitude,
      },
      isVisible: false,
      location: {
        projectName: `${primaryTitle}, ${secondaryTitle}`,
        unitNo: '',
        blockNo: '',
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
        {this.renderBottomSheet()}
      </View>
    );
  }

  private renderHeader = (): React.ReactNode => {
    const {
      t,
      route: { params },
    } = this.props;
    const { primaryTitle, secondaryTitle } = params;
    return (
      <>
        <Header
          type="primary"
          icon={icons.leftArrow}
          onIconPress={this.onBackPress}
          title={t('common:location')}
          testID="location"
        />
        <View style={styles.titleContainer}>
          <Text type="small" textType="semiBold" style={[styles.titlePrimary, styles.textColor]}>
            {primaryTitle}
          </Text>
          <Label type="regular" textType="regular" style={[styles.titleSecondary, styles.textColor]}>
            {secondaryTitle}
          </Label>
        </View>
      </>
    );
  };

  private renderBottomSheet = (): React.ReactElement => {
    const { isVisible, location } = this.state;
    const { t } = this.props;
    const formData = { ...location };
    return (
      <BottomSheet visible={isVisible} onCloseSheet={this.onClose} headerTitle={t('locationDetails')} sheetHeight={400}>
        <SetLocationForm formData={formData} onSubmit={this.onSaveLocation} />
      </BottomSheet>
    );
  };

  private onPressSetLocation = (): void => {
    const { isVisible } = this.state;
    this.setState({ isVisible: !isVisible });
  };

  private onClose = (): void => {
    this.setState({ isVisible: false });
  };

  private onBackPress = (): void => {
    const {
      setCurrentPropertyId,
      navigation: { goBack },
    } = this.props;
    setCurrentPropertyId(0);
    goBack();
  };

  private onMarkerDragEnd = (event: MapEvent): void => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const {
      navigation: { setParams },
    } = this.props;

    GooglePlacesService.getLocationData({ lng: longitude, lat: latitude })
      .then((locData) => {
        const { formatted_address } = locData;
        const { location } = this.state;
        const { primaryAddress, secondaryAddress } = GooglePlacesService.getSplitAddress(formatted_address);
        setParams({
          primaryTitle: primaryAddress,
          secondaryTitle: secondaryAddress,
        });
        this.setState({
          location: {
            ...location,
            projectName: formatted_address,
          },
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

  private onSaveLocation = async (values: FormikValues, formActions: FormikActions<FormikValues>): Promise<void> => {
    formActions.setSubmitting(true);
    const {
      propertyId,
      setCurrentPropertyId,
      navigation: { navigate },
    } = this.props;
    const {
      markerLatLng: { longitude, latitude },
    } = this.state;

    this.onClose();
    Keyboard.dismiss();

    try {
      const requestBody: ICreateAssetDetails | IUpdateAssetDetails = {
        block_number: values.blockNo || '',
        unit_number: values.unitNo,
        project_name: values.projectName,
        latitude: MathUtils.roundToDecimal(latitude, 8),
        longitude: MathUtils.roundToDecimal(longitude, 7),
      };

      if (propertyId) {
        await AssetRepository.updateAsset(propertyId, requestBody as IUpdateAssetDetails);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const property = await AssetRepository.createAsset(requestBody as ICreateAssetDetails);
        setCurrentPropertyId(property.id);
      }

      navigate(ScreensKeys.PropertyDetailsScreen);
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
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
  },
  titleSecondary: {
    marginBottom: 12,
  },
  textColor: {
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

export const mapStateToProps = (state: IState): IStateProps => {
  const { getCurrentPropertyId } = PropertySelector;
  return {
    propertyId: getCurrentPropertyId(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setCurrentPropertyId } = PropertyActions;
  return bindActionCreators(
    {
      setCurrentPropertyId,
    },
    dispatch
  );
};

export default connect<IStateProps, IDispatchProps, OwnProps, IState>(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.property)(AssetLocationMap));
