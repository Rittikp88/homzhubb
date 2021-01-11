import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import AddPropertyLocation from '@homzhub/web/src/screens/addPropertyLocation';
import PropertyDetailsMap from '@homzhub/web/src/screens/addProperty/components/PropertyDetailsMap';

interface IComponentMap {
  [index: number]: { component: React.FC<IScreenProps> };
}

interface IScreenProps {
  navigateScreen: Function;
  coords: { lat: number; lng: number };
  setCoords: Function;
}
const AddProperty: FC = () => {
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const AddPropertyScreens: IComponentMap = {
    0: {
      component: AddPropertyLocation,
    },
    1: { component: PropertyDetailsMap },
  };
  const [currentComp, setCurrentComp] = useState(0);
  const [coords, setCoords] = useState({ lat: 0, lng: 0 });
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
  console.log(' Current Coords => ', coords);
  return (
    <View style={[styles.container, isTablet && styles.containerTablet]}>
      <CurrentScreen navigateScreen={navigateScreen} coords={coords} setCoords={setCoords} />
    </View>
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
