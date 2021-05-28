/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { theme } from '@homzhub/common/src/styles/theme';
import { Progress } from '@homzhub/common/src/components/atoms/Progress/Progress';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { ImageLoader } from '@homzhub/web/src/components/molecules/ImageLoader';
import EditIconUpload from '@homzhub/web/src/components/molecules/EditIconUpload';
import { UserProfile as UserProfileModel } from '@homzhub/common/src/domain/models/UserProfile';
import { AttachmentError, AttachmentType } from '@homzhub/common/src/constants/AttachmentTypes';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

export interface IProp {
  userProfileInfo: UserProfileModel;
}

const ProfilePhoto: FC<IProp> = (props: IProp) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const isTablet = useOnly(deviceBreakpoint.TABLET);
  const { userProfileInfo } = props;
  if (!userProfileInfo) {
    return null;
  }
  const { profileProgress, profilePicture, name } = userProfileInfo;
  const handleFileUpload = async (uploadedFile: File): Promise<void> => {
    if (uploadedFile) {
      const formData = new FormData();
      formData.append('files[]', uploadedFile);
      setIsLoading(true);
      try {
        // eslint-disable-next-line no-unused-vars
        const response = await AttachmentService.uploadImage(formData, AttachmentType.PROFILE_IMAGE);
        // TODOS - Mohak: Use { link, id} to display and upload photo
        setIsLoading(false);
      } catch (e) {
        if (e === AttachmentError.UPLOAD_IMAGE_ERROR) {
          AlertHelper.error({ message: t('property:supportedImageFormats') });
        }
        setIsLoading(false);
      }
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.profileImage}>
          <ImageLoader visible={isLoading} imageSize={90} />
          <Avatar isOnlyAvatar fullName={name || ''} imageSize={90} image={profilePicture} />
        </View>
        {!isLoading && <EditIconUpload handleFile={handleFileUpload} />}
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
