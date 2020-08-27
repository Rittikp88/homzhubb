import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { images } from '@homzhub/common/src/assets/images';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text, AssetMetrics, Image } from '@homzhub/common/src/components';

interface IProps {
  title?: number | string;
  income: number;
  expense: number;
  onPlusIconClicked?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  individualCardStyle?: StyleProp<ViewStyle>;
}

export const FinancialHeaderContainer = (props: IProps): React.ReactElement => {
  const { title = 0, income = 0, expense = 0, onPlusIconClicked, containerStyle, individualCardStyle } = props;
  const { t } = useTranslation();
  const currentYear = DateUtils.getCurrentYear();

  const bubblePlusIcon = (): void => {
    if (onPlusIconClicked) {
      onPlusIconClicked();
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.heading}>
        <View style={styles.property}>
          <View style={styles.logo}>
            <Image source={images.homzhubDashboard} />
          </View>
          <View>
            <Text type="regular" textType="bold" style={styles.title}>
              {title}
            </Text>
          </View>
        </View>
        {onPlusIconClicked && (
          <Icon
            style={styles.plusIcon}
            name={icons.plus}
            color={theme.colors.primaryColor}
            size={40}
            onPress={bubblePlusIcon}
            testID="icnPlus"
          />
        )}
      </View>
      <View style={styles.cardContainer}>
        <AssetMetrics
          header={t('assetFinancial:income', { year: currentYear })}
          value={`${income}/-`}
          currency="INR"
          colorA={theme.colors.gradientA}
          colorB={theme.colors.gradientB}
          cardStyle={individualCardStyle}
          textStyle={styles.priceStyle}
        />
        <AssetMetrics
          header={t('assetFinancial:expense', { year: currentYear })}
          value={`${expense}/-`}
          currency="INR"
          colorA={theme.colors.gradientC}
          colorB={theme.colors.gradientD}
          cardStyle={individualCardStyle}
          textStyle={styles.priceStyle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: 4,
  },
  heading: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  property: {
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logo: {
    flex: 0,
    paddingHorizontal: 15,
  },
  title: {
    color: theme.colors.darkTint1,
  },
  cardContainer: {
    flexDirection: 'row',
    marginLeft: 6,
  },
  plusIcon: {
    backgroundColor: theme.colors.lightGrayishBlue,
    marginRight: 12,
  },
  priceStyle: {
    color: theme.colors.white,
  },
});
