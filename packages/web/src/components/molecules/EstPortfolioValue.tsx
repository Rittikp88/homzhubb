import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import HomzhubDashboard from '@homzhub/common/src/assets/images/homzhubDashboard.svg';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IEstPortfolioProps {
  propertiesCount: number;
}

const EstPortfolioValue: React.FC<IEstPortfolioProps> = (props: IEstPortfolioProps) => {
  const { propertiesCount } = props;
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const styles = propertyOverviewStyle(isMobile);
  return (
    <View style={styles.portfolioContainer}>
      <Typography variant="text" size="small" fontWeight="semiBold" style={styles.heading}>
        {t('common:properties')}
      </Typography>
      <View style={styles.propertiesValueWrapper}>
        <HomzhubDashboard width={61} height={64} />
        <View style={styles.propertiesValueContainer}>
          <Typography variant="text" size="regular" fontWeight="bold" style={styles.valuation}>
            {propertiesCount}
          </Typography>
          <Typography variant="text" size="small" fontWeight="regular" style={styles.heading}>
            {t('assetPortfolio:yourPortfolio')}
          </Typography>
        </View>
      </View>
    </View>
  );
};

export default EstPortfolioValue;

interface IEstPortfolioValueStyle {
  heading: ViewStyle;
  portfolioContainer: ViewStyle;
  propertiesValueWrapper: ViewStyle;
  propertiesValueContainer: ViewStyle;
  valuation: ViewStyle;
}

const propertyOverviewStyle = (isMobile?: boolean): StyleSheet.NamedStyles<IEstPortfolioValueStyle> =>
  StyleSheet.create<IEstPortfolioValueStyle>({
    propertiesValueWrapper: {
      flexDirection: 'row',
      marginVertical: 'auto',
      paddingTop: '4%',
    },
    portfolioContainer: {
      flex: 1,
      height: isMobile ? undefined : '100%',
    },
    heading: {
      color: theme.colors.darkTint1,
      // marginBottom: 8,
    },
    propertiesValueContainer: {
      marginLeft: 8,
      justifyContent: 'space-evenly',
    },
    valuation: {
      color: theme.colors.darkTint3,
    },
  });
