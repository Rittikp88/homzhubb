import React, { FC } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import PropertyUpdatesCard from '@homzhub/web/src/screens/dashboard/components/PropertyUpdates/PropertyUpdatesCard';
import { AssetUpdates } from '@homzhub/common/src/domain/models/AssetMetrics';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { IPropertyNotification, IPropertyNotificationDetails } from '@homzhub/common/src/constants/DashBoard';

interface IProp {
  updatesData: AssetUpdates;
}

const notificationsData: IPropertyNotificationDetails[] = [
  {
    label: 'Visits',
    count: 10,
    icon: icons.visit,
  },
  {
    label: 'Offer',
    count: 10,
    icon: icons.offers,
  },
  {
    label: 'Message',
    count: 10,
    icon: icons.mail,
  },
];

const ticketsData: IPropertyNotificationDetails[] = [
  {
    label: 'Open',
    count: 10,
    icon: icons.openTemplate,
  },
  {
    label: 'Closed',
    count: 10,
    icon: icons.closeTemplate,
  },
];

const duesData: IPropertyNotificationDetails[] = [
  {
    label: 'Over Due',
    count: 10,
    icon: icons.billPamphlet,
  },
  {
    label: 'Upcoming',
    count: 10,
    icon: icons.billPamphlet,
  },
];

const propertyUpdatesData = (
  notificationCount: number,
  ticketCount: number,
  duesCount: number
): IPropertyNotification[] => [
  {
    icon: icons.bell,
    iconColor: theme.colors.green,
    title: 'assetDashboard:notification',
    count: notificationCount,
    details: notificationsData,
  },
  {
    icon: icons.ticket,
    iconColor: theme.colors.orange,
    title: 'assetDashboard:tickets',
    count: ticketCount,
    details: ticketsData,
  },
  {
    icon: icons.wallet,
    iconColor: theme.colors.danger,
    title: 'assetDashboard:dues',
    count: duesCount,
    details: duesData,
  },
];

const PropertyUpdates: FC<IProp> = ({ updatesData }: IProp) => {
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const styles = propertyUpdatesStyle(isMobile);
  const data = propertyUpdatesData(
    updatesData?.notifications?.count ?? 0,
    updatesData?.dues?.count ?? 0,
    updatesData?.tickets?.count ?? 0
  );
  return (
    <View style={styles.container}>
      {data.map((item) => (
        <PropertyUpdatesCard key={item.title} data={item} />
      ))}
    </View>
  );
};

interface IStyle {
  container: ViewStyle;
}

const propertyUpdatesStyle = (isMobile: boolean): StyleSheet.NamedStyles<IStyle> =>
  StyleSheet.create<IStyle>({
    container: {
      flexDirection: isMobile ? 'column' : 'row',
      display: 'flex',
      justifyContent: 'space-between',
    },
  });

export default PropertyUpdates;
