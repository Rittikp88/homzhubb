import React from 'react';
import { StyleSheet, View } from 'react-native';
import Dues from '@homzhub/web/src/screens/dashboard/components/PropertyNotifications/Dues';
import Notifications from '@homzhub/web/src/screens/dashboard/components/PropertyNotifications/Notification';
import Tickets from '@homzhub/web/src/screens/dashboard/components/PropertyNotifications/Tickets';

const PropertyNotifications = (): React.ReactElement => {
  return (
    <View style={styles.container}>
      <Notifications />
      <Tickets />
      <Dues />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 25,
  },
});

export default PropertyNotifications;
