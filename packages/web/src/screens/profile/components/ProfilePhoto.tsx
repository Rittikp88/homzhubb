import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Progress } from '@homzhub/common/src/components/atoms/Progress/Progress';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { UserProfile as UserProfileModel } from '@homzhub/common/src/domain/models/UserProfile';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

export interface IProp {
  userProfileInfo: UserProfileModel;
}

const ProfilePhoto: FC<IProp> = (props: IProp) => {
  const { t } = useTranslation();
  const isTablet = useOnly(deviceBreakpoint.TABLET);
  const { userProfileInfo } = props;
  if (!userProfileInfo) {
    return null;
  }
  const { profileProgress, profilePicture, name } = userProfileInfo;
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.profileImage}>
          <Avatar isOnlyAvatar fullName={name || ''} imageSize={90} image={profilePicture} />
        </View>
        <Progress
          containerStyles={isTablet && styles.ProgressBarTab}
          title={t('assetMore:profile')}
          progress={profileProgress || 0}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    width: '100%',
    paddingBottom: 44,
  },
  profileImage: {
    marginTop: 40,
    alignItems: 'center',
  },
  ProgressBarTab: {
    width: 296,
    marginHorizontal: 'auto',
    marginTop: 12,
  },
  innerContainer: {
    marginHorizontal: 24,
  },
});
export default ProfilePhoto;
