import React from 'react';
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, ViewStyle, View } from 'react-native';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '@homzhub/common/src/styles/theme';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';

interface IProps {
  header: string;
  selectedAssetType?: string;
  value: string | number;
  isCurrency: boolean;
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
    cardStyle,
    testID,
    textStyle,
    onPressMetrics,
    isCurrency,
    selectedAssetType,
  } = props;

  const currency = useSelector(UserSelector.getCurrency);
  const isGradient = colorA && colorB;

  const handlePress = (): void => {
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
        {isCurrency ? (
          <PricePerUnit textStyle={textStyle} currency={currency} priceTransformation={false} price={value as number} />
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
          style={[
            styles.container,
            cardStyle,
            styles.containerWithoutGradient,
            header === selectedAssetType && styles.selectedContainer,
          ]}
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
    paddingVertical: 8,
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
