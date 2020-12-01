import React from 'react';
import { StyleSheet, View } from 'react-native';
import Dues from '@homzhub/web/src/screens/dashboard/components/PropertyNotifications/Dues';
import Notifications from '@homzhub/web/src/screens/dashboard/components/PropertyNotifications/Notification';
import Tickets from '@homzhub/web/src/screens/dashboard/components/PropertyNotifications/Tickets';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const PropertyNotifications = (): React.ReactElement => {
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      <Notifications />
      <Tickets />
      <Dues />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerMobile: {
    flexDirection: 'column',
  },
  notificationItems: {
    marginRight: 15,
    marginVertical: 24,
  },
});

export default PropertyNotifications;
