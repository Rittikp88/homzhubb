import React, { useState } from 'react';
import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import ImagePicker, { Image as ImagePickerResponse } from 'react-native-image-crop-picker';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import ProofOfCompletion from '@homzhub/common/src/components/molecules/ProofOfCompletion';
import { IUploadAttachmentResponse } from '@homzhub/mobile/src/components/organisms/AddRecordForm';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { TicketRepository } from '@homzhub/common/src/domain/repositories/TicketRepository';
import { ICompleteTicketPayload, TicketAction } from '@homzhub/common/src/domain/repositories/interfaces';
import { AttachmentType } from '@homzhub/common/src/constants/AttachmentTypes';
import { TOTAL_IMAGES } from '@homzhub/common/src/constants/ServiceTickets';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';

const WorkCompleted = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { navigate, goBack } = useNavigation();

  const [comment, setComment] = useState('');
  const [isLoading, setLoader] = useState(false);
  const [proofImages, setProofImages] = useState<ImagePickerResponse[]>([]);
  const attachments = useSelector(TicketSelectors.getProofAttachment);
  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);

  // HANDLERS
  const handleImageUpload = async (): Promise<void> => {
    const prevAttachments: ImagePickerResponse[] = cloneDeep(proofImages);
    try {
      const response: ImagePickerResponse | ImagePickerResponse[] = await ImagePicker.openPicker({
        compressImageMaxWidth: 400,
        compressImageMaxHeight: 400,
        compressImageQuality: PlatformUtils.isAndroid() ? 1 : 0.8,
        includeBase64: true,
        maxFiles: !attachments.length ? TOTAL_IMAGES : attachments.length - TOTAL_IMAGES,
        multiple: true,
        mediaType: 'photo',
      });

      const images = response as ImagePickerResponse[];
      let attachment: string[] = [];
      images.forEach((item) => {
        attachment = [...attachment, item.path];
      });
      setProofImages([...prevAttachments, ...images]);
      dispatch(TicketActions.setAttachment(attachment));
    } catch (err) {
      AlertHelper.error({ message: err.message });
    }
  };

  const onCommentChange = (value: string): void => {
    setComment(value);
  };

  const onWorkDone = async (): Promise<void> => {
    const formData = new FormData();
    let attachmentIds: number[] = [];
    setLoader(true);

    if (proofImages.length > 0) {
      proofImages.forEach((image) => {
        // @ts-ignore
        formData.append('files[]', {
          // @ts-ignore
          name: PlatformUtils.isIOS() ? image.filename : image.path.substring(image.path.lastIndexOf('/') + 1),
          uri: image.path,
          type: image.mime,
        });
      });

      /* API call for attachment upload on s3 */
      const response = await AttachmentService.uploadImage(formData, AttachmentType.TICKET_DOCUMENTS);
      const { data, error } = response;
      if (data && data.length > 0) {
        attachmentIds = data.map((i: IUploadAttachmentResponse) => i.id);
      }

      if (error) {
        AlertHelper.error({ message: t('common:fileCorrupt') });
      }
    }
    try {
      if (selectedTicket) {
        const payload: ICompleteTicketPayload = {
          param: { ticketId: selectedTicket.ticketId },
          data: {
            action: TicketAction.COMPLETE_TICKET,
            payload: {
              ...(!!comment && { comment }),
              attachments: attachmentIds,
            },
          },
        };

        await TicketRepository.completeTicket(payload);
        setLoader(false);
        AlertHelper.success({ message: t('ticketComplete') });
        navigate(ScreensKeys.ServiceTicketDetail);
        dispatch(TicketActions.clearState());
        dispatch(TicketActions.getTickets());

        /* Analytics for closed ticket */
        AnalyticsService.track(EventType.ClosedServiceTicket, {
          project_name: selectedTicket.propertyName ?? '',
          ticketId: selectedTicket.ticketId,
        });
      }
    } catch (e) {
      setLoader(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  const onGoBack = (): void => {
    dispatch(TicketActions.clearState());
    goBack();
  };

  // HANDLERS

  return (
    <UserScreen
      title={selectedTicket?.propertyName ?? ''}
      pageTitle={t('workCompleted')}
      onBackPress={onGoBack}
      loading={isLoading}
    >
      <ProofOfCompletion onUploadImage={handleImageUpload} onUpdateComment={onCommentChange} />
      <Button type="primary" title={t('common:done')} onPress={onWorkDone} />
    </UserScreen>
  );
};

export default WorkCompleted;
