import React, { useState } from 'react';
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, ViewStyle, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';

interface IProps {
  header: string;
  value: string | number;
  currency?: string;
  cardStyle?: StyleProp<ViewStyle>;
  angle?: number;
  location?: number[];
  colorA: string;
  colorB: string;
  testID?: string;
  textStyle?: StyleProp<TextStyle>;
  onPressMetrics?: () => void;
}

const AssetMetrics = (props: IProps): React.ReactElement => {
  const {
    header,
    value,
    angle,
    colorA,
    colorB,
    location,
    currency,
    cardStyle,
    testID,
    textStyle,
    onPressMetrics,
  } = props;

  const [selected, onSelect] = useState(false);
  const isGradient = colorA && colorB;
  const handlePress = (): void => {
    onSelect(!selected);
    if (onPressMetrics) {
      onPressMetrics();
    }
  };

  const renderItem = (): React.ReactElement => {
    return (
      <>
        <Text
          type="small"
          textType="semiBold"
          style={[styles.metrics, isGradient ? styles.textWithGradient : styles.textWithoutGradient]}
        >
          {header}
        </Text>
        {currency ? (
          <PricePerUnit textStyle={textStyle} priceTransformation={false} currency={currency} price={value as number} />
        ) : (
          <Text
            type="large"
            textType="semiBold"
            style={[styles.metrics, isGradient ? styles.textWithGradient : styles.valueWithoutGradient]}
          >
            {value}
          </Text>
        )}
      </>
    );
  };

  return (
    <TouchableOpacity onPress={handlePress} testID={testID}>
      {isGradient ? (
        <LinearGradient
          useAngle
          angle={angle}
          colors={[colorA, colorB]}
          locations={location}
          style={[styles.container, cardStyle]}
        >
          {renderItem()}
        </LinearGradient>
      ) : (
        <View
          style={[styles.container, cardStyle, styles.containerWithoutGradient, selected && styles.selectedContainer]}
        >
          {renderItem()}
        </View>
      )}
    </TouchableOpacity>
  );
};

const memoizedComponent = React.memo(AssetMetrics);
export { memoizedComponent as AssetMetrics };

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  containerWithoutGradient: {
    backgroundColor: theme.colors.gradientK,
    borderColor: theme.colors.lightBlue,
    borderWidth: 1.5,
  },
  selectedContainer: {
    borderColor: theme.colors.blue,
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
