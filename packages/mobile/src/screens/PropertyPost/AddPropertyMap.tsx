import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import MapView, { LatLng, MapEvent, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Formik, FormikActions, FormikProps, FormikValues } from 'formik';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button, FormButton, FormTextInput, Label, Text, WithShadowView } from '@homzhub/common/src/components';
import { BottomSheet } from '@homzhub/mobile/src/components/molecules/BottomSheet';
import Header from '@homzhub/mobile/src/components/molecules/Header';
import { AppStackParamList } from '@homzhub/mobile/src/navigation/AppNavigator';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

type Props = WithTranslation & NavigationScreenProps<AppStackParamList, ScreensKeys.AddProperty>;

interface IState {
  markerLatLng: LatLng;
  isVisible: boolean;
  location: {
    projectName: string;
    unitNo: number;
    blockNo: string;
  };
}

class AddPropertyMap extends React.PureComponent<Props, IState> {
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
        unitNo: 0,
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
          icon="left-arrow"
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
        <Formik initialValues={formData} onSubmit={this.onSaveLocation}>
          {(formProps: FormikProps<FormikValues>): React.ReactNode => {
            return (
              <>
                <View style={styles.fieldsView}>
                  <FormTextInput
                    autoFocus
                    name="projectName"
                    label={t('projectName')}
                    inputType="default"
                    maxLength={100}
                    placeholder={t('projectName')}
                    formProps={formProps}
                  />
                  <View style={styles.contentView}>
                    <View style={styles.subContentView}>
                      <FormTextInput name="unitNo" label={t('unitNo')} inputType="number" formProps={formProps} />
                    </View>
                    <View style={styles.flexOne}>
                      <FormTextInput name="blockNo" label={t('blockNo')} inputType="default" formProps={formProps} />
                    </View>
                  </View>
                </View>
                <WithShadowView outerViewStyle={styles.shadowView}>
                  <FormButton
                    type="primary"
                    title={t('saveLocation')}
                    containerStyle={styles.buttonStyle}
                    // @ts-ignore
                    onPress={formProps.handleSubmit}
                    formProps={formProps}
                  />
                </WithShadowView>
              </>
            );
          }}
        </Formik>
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
      })
      .catch((e: Error): void => {
        AlertHelper.error({ message: e.message });
      });
  };

  private onSaveLocation = (values: FormikValues, formActions: FormikActions<FormikValues>): void => {
    formActions.setSubmitting(true);
    // TODO: Add logic
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
    paddingStart: 16,
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
    paddingTop: 10,
    marginBottom: PlatformUtils.isIOS() ? 20 : 0,
    paddingBottom: 0,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
  fieldsView: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  contentView: {
    flexDirection: 'row',
  },
  subContentView: {
    flex: 1,
    marginRight: 16,
  },
  flexOne: {
    flex: 1,
  },
});

const HOC = withTranslation(LocaleConstants.namespacesKey.propertyPost)(AddPropertyMap);
export { HOC as AddPropertyMap };
