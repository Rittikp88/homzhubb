import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  header: string;
  value: string | number;
  colorA?: string;
  colorB?: string;
}

const AssetMetrics = (props: IProps): React.ReactElement => {
  const { header, value, colorA, colorB } = props;
  const [selected, onSelect] = useState(false);
  const isColorAvailable = !!colorA;
  const gradient = [colorA || theme.colors.gradientK, colorB || theme.colors.white];

  const handlePress = (): void => {
    onSelect(!selected);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <LinearGradient
        useAngle
        angle={180}
        colors={gradient}
        locations={[0, 1]}
        style={[
          styles.container,
          !isColorAvailable && selected ? styles.selectedContainer : styles.containerWithoutGradient,
        ]}
      >
        <Text
          type="small"
          textType="semiBold"
          style={[styles.metrics, isColorAvailable ? styles.textWithGradient : styles.textWithoutGradient]}
        >
          {header}
        </Text>
        <Text
          type="large"
          textType="semiBold"
          style={[styles.metrics, isColorAvailable ? styles.textWithGradient : styles.valueWithoutGradient]}
        >
          {value}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export { AssetMetrics };

const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderRadius: 8,
    padding: 5,
    minWidth: (theme.viewport.width - 90) / 3,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  containerWithoutGradient: {
    borderColor: theme.colors.lightBlue,
    borderWidth: 1,
  },
  selectedContainer: {
    borderColor: theme.colors.blue,
    borderWidth: 1,
  },
  metrics: {
    textAlign: 'center',
    marginVertical: 5,
  },
  textWithGradient: {
    color: theme.colors.white,
  },
  textWithoutGradient: {
    color: theme.colors.darkTint4,
  },
  valueWithoutGradient: {
    color: theme.colors.darkTint1,
  },
});
