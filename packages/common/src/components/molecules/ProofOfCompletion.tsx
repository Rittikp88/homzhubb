import React, { ReactElement, useState } from 'react';
import { FlatList, ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { UploadBox } from '@homzhub/common/src/components/molecules/UploadBox';
import { TOTAL_IMAGES } from '@homzhub/common/src/constants/ServiceTickets';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  onUploadImage: () => void;
  onUpdateComment: (value: string) => void;
}

const ProofOfCompletion = ({ onUploadImage, onUpdateComment }: IProps): ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);
  const dispatch = useDispatch();
  const attachments = useSelector(TicketSelectors.getProofAttachment);

  const [comment, setComment] = useState('');

  // HANDLERS
  const onCommentChange = (value: string): void => {
    setComment(value);
    onUpdateComment(value);
  };

  const onAddProof = (): void => {
    if (attachments.length === TOTAL_IMAGES) {
      AlertHelper.error({ message: t('common:uploadWarning') });
    } else {
      onUploadImage();
    }
  };

  const onRemoveProof = (index: string): void => {
    dispatch(TicketActions.removeAttachment(index));
  };
  // HANDLERS

  const renderImageView = ({ item }: { item: string }): ReactElement => {
    return (
      <View style={styles.imageContainer}>
        <ImageBackground source={{ uri: item }} style={styles.image}>
          <TouchableOpacity style={styles.iconContainer} onPress={(): void => onRemoveProof(item)}>
            <Icon name={icons.close} color={theme.colors.white} size={18} />
          </TouchableOpacity>
        </ImageBackground>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text type="small" textType="semiBold">
        {t('uploadProof')}
      </Text>
      <Text type="small" style={styles.subHeading}>
        {t('showcasePhoto')}
      </Text>
      <UploadBox
        icon={icons.gallery}
        header={t('common:addPhoto')}
        subHeader={t('uploadIssuePhotoHelperText')}
        onPress={onAddProof}
        containerStyle={styles.uploadButton}
      />
      {attachments.length > 0 && (
        <>
          <Text type="small">{t('property:uploadedImages')}</Text>
          <FlatList
            data={attachments}
            renderItem={renderImageView}
            numColumns={2}
            contentContainerStyle={styles.list}
          />
        </>
      )}
      <TextArea
        value={comment}
        label={t('common:comment')}
        helpText={t('common:optional')}
        placeholder={t('common:typeComment')}
        wordCountLimit={450}
        onMessageChange={onCommentChange}
      />
    </View>
  );
};

export default ProofOfCompletion;

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  subHeading: {
    marginVertical: 12,
  },
  list: {
    marginVertical: 14,
  },
  uploadButton: {
    marginVertical: 20,
  },
  imageContainer: {
    margin: 6,
  },
  image: {
    width: 160,
    height: 100,
  },
  iconContainer: {
    height: 22,
    width: 22,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: theme.colors.darkTint4,
  },
});
