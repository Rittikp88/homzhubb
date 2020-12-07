import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import Dues from '@homzhub/web/src/screens/dashboard/components/PropertyNotifications/Dues';
import Notifications from '@homzhub/web/src/screens/dashboard/components/PropertyNotifications/Notification';
import Tickets from '@homzhub/web/src/screens/dashboard/components/PropertyNotifications/Tickets';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const PropertyNotifications = (): React.ReactElement => {
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const styles = propertyNotificationsStyle(isMobile);
  return (
    <View style={styles.container}>
      <Notifications />
      <Tickets />
      <Dues />
    </View>
  );
};

interface IStyle {
  container: ViewStyle;
}

const propertyNotificationsStyle = (isMobile: boolean): StyleSheet.NamedStyles<IStyle> =>
  StyleSheet.create<IStyle>({
    container: {
      flexDirection: isMobile ? 'column' : 'row',
      display: isMobile ? 'none' : 'flex',
      justifyContent: 'space-between',
    },
  });

export default PropertyNotifications;
