import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import ImagePicker, { Image as ImagePickerResponse } from 'react-native-image-crop-picker';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import ProofOfCompletion from '@homzhub/common/src/components/molecules/ProofOfCompletion';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { TOTAL_IMAGES } from '@homzhub/common/src/constants/ServiceTickets';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const WorkCompleted = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { navigate, goBack } = useNavigation();
  const attachments = useSelector(TicketSelectors.getProofAttachment);
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);

  // HANDLERS
  const handleImageUpload = async (): Promise<void> => {
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
      dispatch(TicketActions.setAttachment(attachment));
    } catch (err) {
      AlertHelper.error({ message: err.message });
    }
  };

  const onWorkDone = (): void => {
    // TODO: (Shikha) - Handle API integration
    navigate(ScreensKeys.ServiceTicketDetail);
    dispatch(TicketActions.clearState());
  };

  const onGoBack = (): void => {
    dispatch(TicketActions.clearState());
    goBack();
  };

  // HANDLERS

  return (
    <UserScreen title={t('tickets')} pageTitle={t('workCompleted')} onBackPress={onGoBack}>
      <ProofOfCompletion onUploadImage={handleImageUpload} />
      <Button type="primary" title={t('common:done')} onPress={onWorkDone} />
    </UserScreen>
  );
};

export default WorkCompleted;
