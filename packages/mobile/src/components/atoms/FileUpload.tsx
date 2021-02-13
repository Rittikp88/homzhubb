import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as RNProgress from 'react-native-progress';
import { theme } from '@homzhub/common/src/styles/theme';
import { viewport } from '@homzhub/common/src/styles/viewport';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { IDocumentSource } from '@homzhub/mobile/src/components/molecules/UploadBoxComponent';
import { UploadFileType } from '@homzhub/common/src/domain/models/Attachment';

interface IFileUploadProps {
  attachments: IDocumentSource[];
  onDelete: (uri: string) => void;
}

const FileUpload = (props: IFileUploadProps): React.ReactElement | null => {
  const { attachments = [], onDelete } = props;
  const { t } = useTranslation();
  const fileSize = (bytes: number): string => {
    const integral = parseFloat((bytes / (1024 * 1024)).toFixed(1));
    return integral ? `${integral} mb` : `${(bytes / 1024).toFixed(1)} kb`;
  };
  const fileName = (name: string, extension: string): string =>
    name.length > 20 ? `${name.slice(0, 20)}...${extension}` : name;

  if (attachments.length) {
    return (
      <>
        {attachments.map((attachment: IDocumentSource) => {
          const { name, uri, size } = attachment;
          const extension = name.split('.').reverse()[0];
          const fileType = extension === 'pdf' ? UploadFileType.PDF : UploadFileType.IMAGE;
          const isLastAttachment = attachments.indexOf(attachment) === attachments.length - 1;
          const fileIcon = fileType === UploadFileType.PDF ? icons.doc : icons.imageFile;

          const RenderDivider = (): React.ReactElement =>
            !isLastAttachment ? <Divider containerStyles={styles.divider} /> : <View style={styles.endingEmptyView} />;

          const onPress = (): void => onDelete(uri);

          return (
            <>
              <View key={uri} style={styles.fullContainer}>
                <View style={styles.fileIconView}>
                  <Icon name={fileIcon} size={40} color={theme.colors.lowPriority} style={styles.fileIcon} />
                </View>

                <View style={styles.topView}>
                  <View style={styles.titleView}>
                    <Text
                      type="small"
                      textType="semiBold"
                      style={styles.fileName}
                      ellipsizeMode="tail"
                      numberOfLines={1}
                    >
                      {fileName(name, extension)}
                    </Text>
                    <Icon
                      name={icons.close}
                      size={20}
                      color={theme.colors.darkTint3}
                      style={styles.closeIcon}
                      onPress={onPress}
                    />
                  </View>

                  <RNProgress.Bar
                    color="green"
                    progress={1}
                    borderRadius={4}
                    width={viewport.width / 1.5}
                    height={5}
                    unfilledColor={theme.colors.background}
                    style={styles.progressBar}
                  />

                  <View style={styles.bottomView}>
                    <Text type="small" textType="semiBold" style={styles.fileInfo}>
                      {t('common:completed')}
                    </Text>
                    <Text type="small" textType="semiBold" style={styles.fileInfo}>
                      {fileSize(size)}
                    </Text>
                  </View>
                </View>
              </View>
              <RenderDivider />
            </>
          );
        })}
      </>
    );
  }
  return null;
};

export default React.memo(FileUpload);

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 85,
    marginTop: 10,
  },
  fileIconView: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  topView: { flex: 4 },
  titleView: {
    flex: 0.7,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  fileName: {
    color: theme.colors.darkTint3,
  },
  closeIcon: {
    marginHorizontal: 10,
  },
  progressBar: {
    borderColor: theme.colors.disabled,
    marginTop: 10,
  },
  bottomView: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 8,
  },
  fileInfo: {
    color: theme.colors.darkTint6,
    fontSize: 14,
  },
  divider: {
    borderWidth: 1,
    marginVertical: 5,
    borderColor: theme.colors.divider,
  },
  fileIcon: {
    marginHorizontal: 10,
  },
  endingEmptyView: {
    marginVertical: 5,
  },
});
