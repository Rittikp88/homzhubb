import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDown, useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import Settings from '@homzhub/web/src/screens/settings';
import ProfileContainer from '@homzhub/web/src/screens/profile/components/ProfileContainer';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const Profile: FC = () => {
  const isTablet = useOnly(deviceBreakpoint.TABLET);
  const isMobile = useDown(deviceBreakpoint.MOBILE);

  return !isTablet && !isMobile ? (
    <View style={!isTablet && !isMobile && styles.rowStyle}>
      <ProfileContainer />
      {!isTablet && !isMobile && (
        <View style={styles.setting}>
          <Settings />
        </View>
      )}
    </View>
  ) : (
    <ProfileContainer />
  );
};

const styles = StyleSheet.create({
  setting: { marginLeft: 24, width: '58vw' },
  rowStyle: { flexDirection: 'row' },
});

export default Profile;
