import React, { ReactElement, useEffect, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { SVGUri } from '@homzhub/common/src/components/atoms/Svg';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface ITitle {
  title: string;
  id?: number;
}

export interface ICounterProps {
  defaultValue: number;
  name?: ITitle;
  svgImage?: string;
  onValueChange: (count: number, id?: number) => void;
  maxCount?: number;
  minCount?: number;
  containerStyles?: StyleProp<ViewStyle>;
  testID?: string;
}

export const Counter = (props: ICounterProps): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.common);
  const { onValueChange, defaultValue, name, svgImage, maxCount = 10, minCount = 0, containerStyles } = props;
  const [count, setCount] = useState(defaultValue);

  useEffect(() => {
    onValueChange(count, name?.id);
  }, [count]);

  const incrementCount = (): void => {
    if (count < maxCount) {
      setCount((prev) => prev + 1);
      return;
    }
    AlertHelper.error({ message: t('maxCount') });
  };

  const decrementCount = (): void => {
    if (count > minCount) {
      setCount((prev) => prev - 1);
      return;
    }
    AlertHelper.error({ message: t('minCount') });
  };

  const renderCounter = (): ReactElement => {
    return (
      <View style={[styles.counterContainer, styles.rowStyle]}>
        <Icon name={icons.minus} color={theme.colors.primaryColor} size={20} onPress={decrementCount} />
        <Label type="large">{count}</Label>
        <Icon name={icons.plus} color={theme.colors.primaryColor} size={20} onPress={incrementCount} />
      </View>
    );
  };

  return (
    <View style={[styles.rowStyle, containerStyles]}>
      <View style={styles.imageContainer}>
        {svgImage && <SVGUri height={25} width={25} uri={svgImage} />}
        {name && (
          <Text style={styles.textStyle} type="small">
            {name.title}
          </Text>
        )}
      </View>
      {renderCounter()}
    </View>
  );
};

const styles = StyleSheet.create({
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counterContainer: {
    borderColor: theme.colors.darkTint6,
    borderWidth: 1,
    borderRadius: 4,
    width: 100,
    padding: 4,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    marginLeft: 12,
  },
});
