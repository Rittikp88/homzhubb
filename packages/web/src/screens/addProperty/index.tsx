import React, { FC, useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Script from 'react-load-script';
import { useHistory } from 'react-router-dom';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationUtils } from '@homzhub/web/src/utils/NavigationUtils';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { useDispatch, useSelector } from 'react-redux';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { AddPropertyContext } from '@homzhub/web/src/screens/addProperty/AddPropertyContext';
import { AppLayoutContext } from '@homzhub/web/src/screens/appLayout/AppLayoutContext';
import { theme } from '@homzhub/common/src/styles/theme';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import AddPropertyLocation from '@homzhub/web/src/screens/addPropertyLocation';
import AddPropertyView from '@homzhub/common/src/components/organisms/AddPropertyView';
import PropertyDetailsMap from '@homzhub/web/src/screens/addProperty/components/PropertyDetailsMap';
import { ILatLng } from '@homzhub/common/src/modules/search/interface';
import { AttachmentType } from '@homzhub/common/src/constants/AttachmentTypes';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { IPropertySelectedImages } from '@homzhub/common/src/domain/models/VerificationDocuments';
import { AssetGallery } from '@homzhub/common/src/domain/models/AssetGallery';

interface IComponentMap {
  component: AddPropertyStack;
}

export enum AddPropertyStack {
  AddPropertyLocationScreen,
  PropertyDetailsMapScreen,
  AddPropertyViewScreen,
}

export const AddPropertyActionsGrp: FC = () => {
  const { t } = useTranslation();
  const styles = AddPropertyActionStyles;
  const { setGoBackClicked } = useContext(AppLayoutContext);
  const onGoBackPress = (): void => {
    setGoBackClicked(true);
  };
  return (
    <Button type="secondary" containerStyle={[styles.button, styles.addBtn]} onPress={onGoBackPress}>
      <Icon name={icons.dartBack} color={theme.colors.white} style={styles.buttonIconRight} />
      <Typography variant="label" size="large" style={styles.buttonBlueTitle}>
        {t('backText')}
      </Typography>
    </Button>
  );
};

const AddProperty: FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const assetId = useSelector(RecordAssetSelectors.getCurrentAssetId);
  const selectedImages = useSelector(RecordAssetSelectors.getSelectedImages);
  const { goBackClicked, setGoBackClicked } = useContext(AppLayoutContext);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const [hasScriptLoaded, setHasScriptLoaded] = useState(false);
  const [latLng, setLatLng] = useState({ lat: 0, lng: 0 } as ILatLng);
  const [placeData, setPlacesData] = useState({});
  const [addressDetails, setAddressDetails] = useState({});
  const [currentScreen, setCurrentScreen] = useState(AddPropertyStack.AddPropertyLocationScreen);
  useEffect(() => {
    if (goBackClicked) {
      goBack();
      setGoBackClicked(false);
    }
  }, [goBackClicked]);

  const navigateScreen = (comp: AddPropertyStack): void => {
    setCurrentScreen(comp);
  };
  const goBack = (): void => {
    if (currentScreen === 0) {
      navigateToDashboard();
    }
    if (currentScreen !== AddPropertyStack.AddPropertyLocationScreen) {
      const activeIndex = compArray.findIndex((value) => value.component === currentScreen);
      setCurrentScreen(compArray[activeIndex - 1].component);
    }
  };

  const navigateToDashboard = (): void => {
    NavigationUtils.navigate(history, { path: RouteNames.protectedRoutes.DASHBOARD });
  };
  const handleEditSelection = (): void => {
    setCurrentScreen(AddPropertyStack.PropertyDetailsMapScreen);
  };

  const onImageSelection = async (files?: File[]): Promise<void> => {
    if (!files) {
      return;
    }
    try {
      const formData = new FormData();
      files.forEach((image: File) => {
        formData.append('files[]', image);
      });
      try {
        const response = await AttachmentService.uploadImage(formData, AttachmentType.ASSET_IMAGE);

        const { data } = response;
        const localSelectedImages: IPropertySelectedImages[] = [];
        data.forEach((item: any) => {
          localSelectedImages.push({
            id: null,
            description: '',
            is_cover_image: false,
            asset: assetId,
            attachment: item.id,
            link: item.link,
            file_name: 'localImage',
            isLocalImage: true,
          });
        });
        if (selectedImages.length === 0) {
          localSelectedImages[0].is_cover_image = true;
        }
        dispatch(
          RecordAssetActions.setSelectedImages(
            selectedImages.concat(ObjectMapper.deserializeArray(AssetGallery, localSelectedImages))
          )
        );
      } catch (e) {
        AlertHelper.error({ message: e.message });
      }
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };
  const compArray: IComponentMap[] = [
    { component: AddPropertyStack.AddPropertyLocationScreen },
    { component: AddPropertyStack.PropertyDetailsMapScreen },
    { component: AddPropertyStack.AddPropertyViewScreen },
  ];
  const styles = AddPropertyStyles;
  const compProps = {
    wasRedirected: true,
  };
  const onNavigateToPlanSelection = (): void => {
    NavigationUtils.navigate(history, { path: RouteNames.protectedRoutes.ADD_LISTING, params: { ...compProps } });
  };
  const renderScreen = (comp: AddPropertyStack): React.ReactElement => {
    const { AddPropertyLocationScreen, PropertyDetailsMapScreen, AddPropertyViewScreen } = AddPropertyStack;
    switch (comp) {
      case PropertyDetailsMapScreen:
        return <PropertyDetailsMap />;
      case AddPropertyViewScreen:
        return (
          <View style={styles.flexOne}>
            <AddPropertyView
              onUploadImage={onImageSelection}
              onEditPress={handleEditSelection}
              onNavigateToPlanSelection={onNavigateToPlanSelection}
              onNavigateToDetail={FunctionUtils.noop}
            />
          </View>
        );
      case AddPropertyLocationScreen:
      default:
        return (
          <AddPropertyLocation
            setUpdatedLatLng={setLatLng}
            hasScriptLoaded={hasScriptLoaded}
            navigateScreen={navigateScreen}
          />
        );
    }
  };
  return (
    <AddPropertyContext.Provider
      value={{
        hasScriptLoaded,
        latLng,
        setUpdatedLatLng: setLatLng,
        navigateScreen,
        placeData,
        setPlacesData,
        addressDetails,
        setAddressDetails,
        goBack,
      }}
    >
      <View style={[styles.container, isTablet && styles.containerTablet]}>
        <Script
          url={`https://maps.googleapis.com/maps/api/js?key=${ConfigHelper.getPlacesApiKey()}&libraries=places`}
          onLoad={(): void => setHasScriptLoaded(true)}
        />
        {renderScreen(currentScreen)}
      </View>
    </AddPropertyContext.Provider>
  );
};
const AddPropertyActionStyles = StyleSheet.create({
  buttonIconRight: {
    marginRight: 8,
  },
  button: {
    borderColor: theme.colors.subHeader,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 16,
    width: 'max-content',
    backgroundColor: theme.colors.subHeader,
  },
  addBtn: {
    paddingHorizontal: 24,
    marginLeft: 0,
  },
  buttonBlueTitle: {
    color: theme.colors.white,
    marginRight: 8,
  },
});
const AddPropertyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    flexDirection: 'row',
    marginBottom: 48,
    borderRadius: 4,
    width: '100%',
  },
  flexOne: {
    flex: 1,
  },
  containerTablet: {
    flexDirection: 'column',
  },
});
export default AddProperty;
