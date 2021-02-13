import React, { useCallback } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { useTranslation } from 'react-i18next';
import Share from 'react-native-share';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import SharingService from '@homzhub/mobile/src/services/SharingService';
import { theme } from '@homzhub/common/src/styles/theme';
import Facebook from '@homzhub/common/src/assets/images/facebook.svg';
import Google from '@homzhub/common/src/assets/images/google.svg';
import Twitter from '@homzhub/common/src/assets/images/TwitterColor.svg';
import Whatsapp from '@homzhub/common/src/assets/images/whatsapp.svg';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';

interface ISocialMediaProps {
  headerTitle: string;
  onCloseSharing: () => void;
  visible: boolean;
  sharingUrl?: string;
  sharingMessage: string;
}

interface ISocialMedium {
  key: string;
  text: string;
  icon: () => React.ReactElement;
  onPress: () => void;
}

const { Social } = Share;

const SocialMediaShareComp = (props: ISocialMediaProps): React.ReactElement => {
  const { headerTitle, onCloseSharing, visible, sharingMessage, sharingUrl } = props;
  const { t } = useTranslation();
  const handleOnPress = (medium: Share.Social): void => {
    SharingService.Share(medium, sharingMessage, sharingUrl);
    onCloseSharing();
  };
  const shareData: ISocialMedium[] = [
    {
      key: Share.Social.WHATSAPP,
      text: t('common:whatsapp'),
      icon: (): React.ReactElement => <Whatsapp />,
      onPress: (): void => handleOnPress(Social.WHATSAPP),
    },
    {
      key: Share.Social.FACEBOOK,
      text: t('common:facebook'),
      icon: (): React.ReactElement => <Facebook width={24} height={25} />,
      onPress: (): void => handleOnPress(Social.FACEBOOK),
    },
    {
      key: Share.Social.TWITTER,
      text: t('common:twitter'),
      icon: (): React.ReactElement => <Twitter />,
      onPress: (): void => handleOnPress(Social.TWITTER),
    },
    {
      key: Share.Social.EMAIL,
      text: t('common:gmail'),
      icon: (): React.ReactElement => <Google width={24} height={24} />,
      onPress: (): void => handleOnPress(Social.EMAIL),
    },
  ];

  const onCopyToClipboard = useCallback((): void => {
    Clipboard.setString(sharingMessage);
    onCloseSharing();
    AlertHelper.info({ message: t('common:sharingUrlCopied') });
  }, [sharingMessage, onCloseSharing, t]);

  const renderItem = ({ item }: { item: ISocialMedium }): React.ReactElement => (
    <TouchableOpacity key={item.text} style={styles.shareOption} activeOpacity={0.5} onPress={item.onPress}>
      {item.icon()}
      <Label type="regular" style={styles.shareText}>
        {item.text}
      </Label>
    </TouchableOpacity>
  );

  const keyExtractor = ({ key }: { key: string }): string => key;

  return (
    <BottomSheet
      headerTitle={headerTitle}
      onCloseSheet={onCloseSharing}
      sheetHeight={theme.viewport.height / 2}
      visible={visible}
    >
      <>
        <FlatList
          data={shareData}
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContainer}
          keyExtractor={keyExtractor}
        />
        <Button
          title={t('assetMore:copySharingUrl')}
          type="text"
          onPress={onCopyToClipboard}
          testID="shareUrlCopy"
          textSize="small"
          fontType="semiBold"
          titleStyle={styles.sharingText}
          containerStyle={styles.sharingButton}
        />
        <View style={styles.bottomExtraView} />
      </>
    </BottomSheet>
  );
};
const memoised = React.memo(SocialMediaShareComp);
export { memoised as SocialMediaShare };

const styles = StyleSheet.create({
  shareOption: {
    alignItems: 'center',
  },
  icon: {
    alignSelf: 'center',
  },
  shareText: {
    marginTop: 8,
    textAlign: 'center',
    color: theme.colors.darkTint5,
  },
  sharingButton: {
    marginTop: 30,
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: theme.colors.blueOpacity,
  },
  sharingText: {
    color: theme.colors.blue,
    textAlign: 'center',
  },
  flatListContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginTop: 30,
  },
  bottomExtraView: {
    flex: 0.8,
  },
});
