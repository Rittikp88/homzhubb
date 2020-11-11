import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { AssetDocument } from '@homzhub/common/src/domain/models/AssetDocument';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';

interface IProps {
  testID?: string;
  userEmail: string;
  document: AssetDocument;
  handleShare: (link: string) => void;
  handleDelete: (id: number) => void;
  handleDownload: (refKey: string, fileName: string) => void;
}

export const DocumentCard = ({
  document,
  handleShare,
  userEmail,
  handleDelete,
  handleDownload,
}: IProps): React.ReactElement => {
  const {
    attachment: { fileName, link, presignedReferenceKey },
    user,
  } = document;
  const { t } = useTranslation();
  const uploadedBy = userEmail === user?.email ? t('you') : user?.fullName;
  const uploadedOn = DateUtils.getDisplayDate(document.uploadedOn, 'L');
  const onShare = (): void => handleShare(link);
  const onDelete = (): void => handleDelete(document.id);
  const onDownload = (): void => handleDownload(presignedReferenceKey, fileName);
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.leftView}>
          <Label type="large" textType="semiBold" style={styles.title}>
            {fileName}
          </Label>
          <Label type="regular" style={styles.description}>
            {t('assetPortfolio:uploadedOn', { uploadedOn, uploadedBy })}
          </Label>
        </View>
        <Icon name={icons.doc} size={35} color={theme.colors.lowPriority} />
      </View>
      <View style={styles.iconContainer}>
        <Icon name={icons.trash} size={22} color={theme.colors.blue} style={styles.iconStyle} onPress={onDelete} />
        <Icon name={icons.shareFilled} size={22} color={theme.colors.blue} style={styles.iconStyle} onPress={onShare} />
        <Icon name={icons.download} size={22} color={theme.colors.blue} style={styles.iconStyle} onPress={onDownload} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 6,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 18,
  },
  leftView: {
    flex: 1,
  },
  title: {
    color: theme.colors.darkTint3,
  },
  description: {
    color: theme.colors.darkTint5,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    marginEnd: 28,
  },
});
