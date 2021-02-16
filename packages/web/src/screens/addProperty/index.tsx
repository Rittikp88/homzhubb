import React, { FC, useContext, useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Script from 'react-load-script';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import AddPropertyLocation from '@homzhub/web/src/screens/addPropertyLocation';
import AddPropertyView from '@homzhub/common/src/components/organisms/AddPropertyView';
import PropertyDetailsMap from '@homzhub/web/src/screens/addProperty/components/PropertyDetailsMap';
import { AddPropertyContext, ILatLng } from '@homzhub/web/src/screens/addProperty/AddPropertyContext';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { AppLayoutContext } from '@homzhub/web/src/screens/appLayout/AppLayoutContext';
import { useDispatch } from 'react-redux';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';


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
  const { goBackClicked, setGoBackClicked } = useContext(AppLayoutContext);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const [hasScriptLoaded, setHasScriptLoaded] = useState(false);
  const [latLng, setLatLng] = useState({ lat: 0, lng: 0 } as ILatLng);
  const [placeData, setPlacesData] = useState({});
  const [addressDetails, setAddressDetails] = useState({});
  const dispatch = useDispatch();
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
    if (currentScreen !== AddPropertyStack.AddPropertyLocationScreen) {
      const activeIndex = compArray.findIndex((value) => value.component === currentScreen);
      setCurrentScreen(compArray[activeIndex - 1].component);
    }
  };
  const compArray: IComponentMap[] = [
    { component: AddPropertyStack.AddPropertyLocationScreen },
    { component: AddPropertyStack.PropertyDetailsMapScreen },
    { component: AddPropertyStack.AddPropertyViewScreen },
  ];
  const styles = AddPropertyStyles;
  const renderScreen = (comp: AddPropertyStack): React.ReactElement => {
    const { AddPropertyLocationScreen, PropertyDetailsMapScreen, AddPropertyViewScreen } = AddPropertyStack;
    switch (comp) {
      case AddPropertyLocationScreen:
        return <AddPropertyLocation />;
      case PropertyDetailsMapScreen:
        return <PropertyDetailsMap />;
      case AddPropertyViewScreen:
        return (
          <View style={styles.flexOne}>
            <AddPropertyView
              onUploadImage={FunctionUtils.noop}
              onEditPress={FunctionUtils.noop}
              onNavigateToPlanSelection={FunctionUtils.noop}
              onNavigateToDetail={FunctionUtils.noop}
            />
          </View>
        );
      default:
        return <AddPropertyLocation />;
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
