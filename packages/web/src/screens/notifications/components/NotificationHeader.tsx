import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import OverviewCarousel, { IOverviewCarousalData } from '@homzhub/web/src/components/molecules/OverviewCarousel';
import EstPortfolioValue from '@homzhub/web/src/components/molecules/EstPortfolioValue';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';
import { MetricsCount } from '@homzhub/common/src/domain/models/MetricsCount';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { IPropertyNotificationDetails } from '@homzhub/common/src/constants/DashBoard';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  onMetricsClicked: (name: string) => void;
}

// TODO - Remove once API integration is done.
const getNotificationsData = (data: MetricsCount): IPropertyNotificationDetails[] => [
  {
    label: 'Visits',
    count: data?.siteVisit?.count ?? 0,
    iconColor: '#FFFFFF',
    colorCode: 'rgba(255, 113, 68, 1)',
    imageBackgroundColor: 'rgba(255, 127, 87, 1)',
    icon: icons.visit,
  },
  {
    label: 'Offer',
    count: data?.offer?.count ?? 0,
    iconColor: '#FFFFFF',
    colorCode: 'rgba(44, 186, 103, 1)',
    imageBackgroundColor: 'rgba(56, 205, 118, 1)',
    icon: icons.offers,
  },
  {
    label: 'Message',
    count: data?.message?.count ?? 0,
    iconColor: '#FFFFFF',
    colorCode: 'rgba(198, 142, 58, 1)',
    imageBackgroundColor: 'rgba(211, 159, 80, 1)',
    icon: icons.mail,
  },
];

const NotificationHeader: React.FC<IProps> = (props: IProps) => {
  const { onMetricsClicked } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.landing);
  const [portfolioMetrics, setPortfolioMetrics] = useState<IOverviewCarousalData[]>([]);
  const [countMetrics, setCountMetrics] = useState(0);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const styles = propertyOverviewStyle(isMobile);
  const transformData = (arrayObject: IPropertyNotificationDetails[]): IOverviewCarousalData[] => {
    const newArrayOfObj = arrayObject.map(({ label, colorCode, count, ...rest }) => ({
      label,
      colorCode,
      count,
      ...rest,
    }));
    return newArrayOfObj as IOverviewCarousalData[];
  };

  const notificationsMetrics = (datum: MetricsCount): IPropertyNotificationDetails[] => {
    setCountMetrics(datum.count);
    return getNotificationsData(datum);
  };

  useEffect(() => {
    getPorfolioMetrics((response) =>
      setPortfolioMetrics(transformData(notificationsMetrics(response.updates?.notifications)))
    ).then();
  }, []);

  const total = portfolioMetrics?.length ?? 0;
  return (
    <View style={styles.container}>
      <EstPortfolioValue
        icon={icons.bell}
        iconColor={theme.colors.green}
        title={t('assetMore:newNotification')}
        propertiesCount={countMetrics}
        headerText={t('assetMore:notifications')}
      />
      {total > 0 ? (
        <OverviewCarousel
          data={portfolioMetrics}
          onMetricsClicked={onMetricsClicked}
          carouselTitle="  "
          isVisible={false}
        />
      ) : null}
    </View>
  );
};

const getPorfolioMetrics = async (callback: (response: AssetMetrics) => void): Promise<void> => {
  try {
    const response: AssetMetrics = await DashboardRepository.getAssetMetrics();
    callback(response);
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error });
  }
};

interface IPropertyOverviewStyle {
  container: ViewStyle;
  upArrow: ViewStyle;
  valueContainer: ViewStyle;
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
      marginBottom: 36,
    },
    upArrow: {
      transform: [{ rotate: '-90deg' }],
    },
    valueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    valueChange: {
      color: theme.colors.lightGreen,
      marginRight: 8,
    },
    valueChangeTime: {
      color: theme.colors.darkTint6,
    },
  });

export default NotificationHeader;
