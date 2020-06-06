import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import MapView, { LatLng, MapEvent, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { FormikActions, FormikValues } from 'formik';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button, Label, Text, WithShadowView } from '@homzhub/common/src/components';
import { BottomSheet } from '@homzhub/mobile/src/components/molecules/BottomSheet';
import SetLocationForm from '@homzhub/mobile/src/components/molecules/SetLocationForm';
import Header from '@homzhub/mobile/src/components/molecules/Header';
import { AppStackParamList } from '@homzhub/mobile/src/navigation/AppNavigator';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { PropertyRepository } from '@homzhub/common/src/domain/repositories/PropertyRepository';
import { ICreateAssetDetails } from '@homzhub/common/src/domain/repositories/interfaces';

type Props = WithTranslation & NavigationScreenProps<AppStackParamList, ScreensKeys.AddProperty>;

interface IState {
  markerLatLng: LatLng;
  isVisible: boolean;
  location: {
    projectName: string;
    unitNo: string;
    blockNo: string;
  };
}

class AddPropertyMap extends React.PureComponent<Props, IState> {
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
      <SafeAreaView style={styles.container}>
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
      </SafeAreaView>
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
          icon={icons.leftArrow}
          iconColor={theme.colors.white}
          onIconPress={this.onBackPress}
          isHeadingVisible
          title={t('common:location')}
          titleType="small"
          titleFontType="semiBold"
          titleStyle={styles.textColor}
          backgroundColor={theme.colors.primaryColor}
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
      navigation: { goBack },
    } = this.props;
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
      navigation: { navigate },
    } = this.props;
    const {
      markerLatLng: { longitude, latitude },
    } = this.state;

    try {
      const requestBody: ICreateAssetDetails = {
        block_number: values.blockNo,
        unit_number: values.unitNo,
        project_name: values.projectName,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      };
      const property = await PropertyRepository.createAsset(requestBody);
      const { primaryAddress, secondaryAddress } = GooglePlacesService.getSplitAddress(values.projectName);
      this.onClose();
      navigate(ScreensKeys.PropertyDetailsScreen, {
        propertyId: property.id,
        primaryAddress,
        secondaryAddress,
      });
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

const HOC = withTranslation(LocaleConstants.namespacesKey.propertyPost)(AddPropertyMap);
export { HOC as AddPropertyMap };
