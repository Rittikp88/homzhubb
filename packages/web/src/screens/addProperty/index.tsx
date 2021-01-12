import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Script from 'react-load-script';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { theme } from '@homzhub/common/src/styles/theme';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import AddPropertyLocation from '@homzhub/web/src/screens/addPropertyLocation';
import PropertyDetailsMap from '@homzhub/web/src/screens/addProperty/components/PropertyDetailsMap';
import { AddPropertyContext, ILatLng } from '@homzhub/web/src/screens/addProperty/AddPropertyContext';

interface IComponentMap {
  [index: number]: { component: React.FC };
}

const AddProperty: FC = () => {
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const AddPropertyScreens: IComponentMap = {
    0: { component: AddPropertyLocation },
    1: { component: PropertyDetailsMap },
  };
  const [currentComp, setCurrentComp] = useState(0);
  const [hasScriptLoaded, setHasScriptLoaded] = useState(false);
  const [latLng, setLatLng] = useState({ lat: 0, lng: 0 } as ILatLng);
  const CurrentScreen = AddPropertyScreens[currentComp].component;
  const navigateScreen = (action: string): void => {
    function moveAhead(): void {
      setCurrentComp((prevState) => {
        if (prevState !== Object.values(AddPropertyScreens).length - 1) {
          return currentComp + 1;
        }

        return prevState;
      });
    }

    function goBack(): void {
      setCurrentComp((prevState) => {
        if (prevState !== 0) {
          return currentComp - 1;
        }

        return prevState;
      });
    }

    if (action === 'back') {
      goBack();
    } else if (action === 'ahead') {
      moveAhead();
    }
  };
  console.log(' Current Coords => ', latLng);
  return (
    <AddPropertyContext.Provider
      value={{
        hasScriptLoaded,
        latLng,
        setUpdatedLatLng: setLatLng,
        navigateScreen,
      }}
    >
      <View style={[styles.container, isTablet && styles.containerTablet]}>
        <Script
          url={`https://maps.googleapis.com/maps/api/js?key=${ConfigHelper.getPlacesApiKey()}&libraries=places`}
          onLoad={(): void => setHasScriptLoaded(true)}
        />
        <CurrentScreen />
      </View>
    </AddPropertyContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    padding: 20,
    marginBottom: 48,
    borderRadius: 4,
    width: '100%',
  },
  containerTablet: {
    flexDirection: 'column',
  },
});
export default AddProperty;
