import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';

interface IProps {
  selected: boolean;
}

const CustomMarker = (props: IProps): React.ReactElement => {
  const { selected } = props;

  if (!selected) {
    return <View style={styles.marker} />;
  }

  return (
    <View style={styles.selectedMarker}>
      <View style={styles.marker} />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

const memoizedComponent = React.memo(CustomMarker);
export { memoizedComponent as CustomMarker };
