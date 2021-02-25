import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ImagePicker, { Image as ImagePickerResponse } from 'react-native-image-crop-picker';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { IApiClientError } from '@homzhub/common/src/network/ApiClientError';
import { MessageRepository } from '@homzhub/common/src/domain/repositories/MessageRepository';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import ChatInputBox from '@homzhub/common/src/components/molecules/ChatInputBox';
import MessagePreview from '@homzhub/common/src/components/organisms/MessagePreview';
import { IMessagePayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { IAttachmentResponse } from '@homzhub/common/src/services/AttachmentService/interfaces';
import { AttachmentType } from '@homzhub/common/src/constants/AttachmentTypes';

interface IProps {
  shouldEnableOuterScroll: (enable: boolean) => void;
}

// TODO: Need to fix scroll issue
const MessageTab = (props: IProps): React.ReactElement => {
  const { shouldEnableOuterScroll } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [attachment, setAttachment] = useState<ImagePickerResponse | null>(null);
  const [isScrollToBottom, setScrollToBottom] = useState<boolean>(true);

  const currentChat = useSelector(CommonSelectors.getCurrentChatDetail);

  const onClickImage = (): void => {
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      compressImageMaxWidth: 400,
      compressImageMaxHeight: 400,
      compressImageQuality: PlatformUtils.isAndroid() ? 1 : 0.8,
      useFrontCamera: true,
      cropping: true,
    })
      .then((response: ImagePickerResponse | ImagePickerResponse[]) => {
        const image = response as ImagePickerResponse;
        setAttachment(image);
        dispatch(CommonActions.setAttachment(image.path));
      })
      .catch((err) => {
        AlertHelper.error({ message: err.message });
      });
  };

  const onUploadAttachment = async (): Promise<void> => {
    try {
      const response: ImagePickerResponse | ImagePickerResponse[] = await ImagePicker.openPicker({
        compressImageMaxWidth: 400,
        compressImageMaxHeight: 400,
        compressImageQuality: PlatformUtils.isAndroid() ? 1 : 0.8,
        includeBase64: true,
        mediaType: 'photo',
      });
      const image = response as ImagePickerResponse;
      setAttachment(image);
      dispatch(CommonActions.setAttachment(image.path));
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };

  const onSendMessage = (text: string, isAttachment?: boolean): void => {
    if (!currentChat || (isAttachment && !attachment)) return;

    let payload: IMessagePayload = {
      groupId: currentChat.groupId,
      message: text,
      attachments: [],
    };
    if (isAttachment && attachment) {
      const formData = new FormData();
      formData.append('files[]', {
        // @ts-ignore
        name: PlatformUtils.isIOS()
          ? attachment.filename ?? attachment.path.substring(attachment.path.lastIndexOf('/') + 1)
          : attachment.path.substring(attachment.path.lastIndexOf('/') + 1),
        uri: attachment.path,
        type: attachment.mime,
      });

      AttachmentService.uploadImage(formData, AttachmentType.CHAT_DOCUMENT)
        .then((res: IAttachmentResponse) => {
          const { data } = res;
          const attachmentId: number = data[0].id;
          payload = {
            ...payload,
            attachments: [attachmentId],
          };
          handleSend(payload);
        })
        .catch((e: IApiClientError) => {
          AlertHelper.error({ message: e.message });
        });
    }

    if (!isAttachment && !!payload.message) {
      handleSend(payload);
    }
  };

  const handleSend = (payload: IMessagePayload): void => {
    MessageRepository.sendMessage(payload)
      .then(() => {
        dispatch(CommonActions.getMessages({ groupId: payload.groupId, isNew: true }));
      })
      .catch((err) => {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
      });
  };

  const onFocus = (): void => {
    setScrollToBottom(true);
  };

  const updateScroll = (): void => {
    setScrollToBottom(false);
  };

  if (!currentChat)
    return (
      <EmptyState
        isIconRequired={false}
        title={t('assetMore:noActiveThread')}
        subTitle={t('assetMore:accessOldMessage')}
        containerStyle={styles.emptyView}
      />
    );

  return (
    <View style={styles.container}>
      <MessagePreview
        isScrollToBottom={isScrollToBottom}
        shouldEnableOuterScroll={shouldEnableOuterScroll}
        shouldScrollToBottom={updateScroll}
      />
      <KeyboardAvoidingView behavior={PlatformUtils.isIOS() ? 'padding' : undefined}>
        <ChatInputBox
          onInputFocus={onFocus}
          onPressCamera={onClickImage}
          onUploadImage={onUploadAttachment}
          onSubmit={onSendMessage}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default MessageTab;

const styles = StyleSheet.create({
  container: {
    height: 500,
  },
  emptyView: {
    minHeight: 200,
  },
});
