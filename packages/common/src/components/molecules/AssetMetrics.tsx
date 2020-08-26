import React, { useState } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';

interface IProps {
  header: string;
  value: string | number;
  currency?: string;
  cardStyle?: StyleProp<ViewStyle>;
  angle: number;
  location: number[];
  colorA: string;
  colorB: string;
  showPlusIcon?: boolean;
  testID?: string;
}

const AssetMetrics = (props: IProps): React.ReactElement => {
  const { header, value, angle, colorA, colorB, location, showPlusIcon = false, currency, cardStyle, testID } = props;

  const [selected, onSelect] = useState(false);
  const gradient = [colorA || theme.colors.gradientK, colorB || theme.colors.white];

  const handlePress = (): void => {
    onSelect(!selected);
  };

  return (
    <TouchableOpacity onPress={handlePress} testID={testID}>
      <LinearGradient
        useAngle
        angle={angle}
        colors={gradient}
        locations={location}
        style={[
          styles.container,
          cardStyle,
          showPlusIcon && selected ? styles.selectedContainer : styles.containerWithoutGradient,
        ]}
      >
        <Text
          type="small"
          textType="semiBold"
          style={[styles.metrics, !showPlusIcon ? styles.textWithGradient : styles.textWithoutGradient]}
        >
          {header}
        </Text>
        {currency ? (
          <PricePerUnit priceTransformation={false} currency={currency} price={value as number} />
        ) : (
          <Text
            type="large"
            textType="semiBold"
            style={[styles.metrics, !showPlusIcon ? styles.textWithGradient : styles.valueWithoutGradient]}
          >
            {value}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export { AssetMetrics };

const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 5,
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
