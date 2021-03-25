import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import HomzhubDashboard from '@homzhub/common/src/assets/images/homzhubDashboard.svg';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import OverviewCarousel, { IOverviewCarousalData } from '@homzhub/web/src/components/molecules/OverviewCarousel';
import { Asset, Data } from '@homzhub/common/src/domain/models/Asset';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  onMetricsClicked: (name: string) => void;
}

const PortfolioOverview: React.FC<IProps> = (props: IProps) => {
  const { onMetricsClicked } = props;
  const [portfolioMetrics, setPortfolioMetrics] = useState<IOverviewCarousalData[]>([]);
  const [portfolioDetailsList, setPortfolioDetailsList] = useState<Asset[]>([]);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const styles = propertyOverviewStyle(isMobile);
  const transformData = (arrayObject: Data[]): IOverviewCarousalData[] => {
    const newArrayOfObj = arrayObject.map(({ name: label, colorCode, count, ...rest }) => ({
      label,
      colorCode,
      count,
      ...rest,
    }));
    return newArrayOfObj as IOverviewCarousalData[];
  };
  useEffect(() => {
    getPorfolioMetrics((response) => setPortfolioMetrics(transformData(response.assetMetrics.assetGroups))).then();
    getPorfolioAssetDetails((response) => setPortfolioDetailsList(response)).then();
  }, []);
  const total = portfolioMetrics?.length ?? 0;
  return (
    <View style={styles.container}>
      <EstPortfolioValue propertiesCount={portfolioDetailsList.length} />
      {total > 0 ? <OverviewCarousel data={portfolioMetrics} onMetricsClicked={onMetricsClicked} /> : null}
    </View>
  );
};
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
const getPorfolioMetrics = async (callback: (response: AssetMetrics) => void): Promise<void> => {
  try {
    const response: AssetMetrics = await PortfolioRepository.getAssetMetrics();
    callback(response);
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error });
  }
};
const getPorfolioAssetDetails = async (callback: (response: Asset[]) => void): Promise<void> => {
  try {
    const response: Asset[] = await PortfolioRepository.getUserAssetDetails('ALL');
    callback(response);
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error });
  }
};

interface IPropertyOverviewStyle {
  container: ViewStyle;
  heading: ViewStyle;
  portfolioContainer: ViewStyle;
  upArrow: ViewStyle;
  propertiesValueWrapper: ViewStyle;
  propertiesValueContainer: ViewStyle;
  valueContainer: ViewStyle;
  valuation: ViewStyle;
  valueChange: ViewStyle;
  valueChangeTime: ViewStyle;
}

const propertyOverviewStyle = (isMobile?: boolean): StyleSheet.NamedStyles<IPropertyOverviewStyle> =>
  StyleSheet.create<IPropertyOverviewStyle>({
    container: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 8,
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      borderRadius: 4,
      backgroundColor: theme.colors.white,
    },
    heading: {
      color: theme.colors.darkTint1,
    },
    portfolioContainer: {
      flex: 1,
      height: isMobile ? undefined : '100%',
    },
    upArrow: {
      transform: [{ rotate: '-90deg' }],
    },
    propertiesValueWrapper: {
      flexDirection: 'row',
      marginVertical: 'auto',
    },
    propertiesValueContainer: {
      marginLeft: 8,
      justifyContent: 'space-evenly',
    },
    valueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    valuation: {
      color: theme.colors.darkTint3,
    },
    valueChange: {
      color: theme.colors.lightGreen,
      marginRight: 8,
    },
    valueChangeTime: {
      color: theme.colors.darkTint6,
    },
  });

export default PortfolioOverview;
