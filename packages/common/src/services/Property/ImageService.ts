import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { IYoutubeResponse } from '@homzhub/common/src/domain/models/VerificationDocuments';
import { AssetGallery } from '@homzhub/common/src/domain/models/AssetGallery';
import { IPropertyImagesPostPayload } from '@homzhub/common/src/domain/repositories/interfaces';

interface IPostAttachment {
  propertyId: number;
  selectedImages: AssetGallery[];
  isVideoToggled: boolean;
  videoUrl: string;
}

class ImageService {
  public postAttachment = async (props: IPostAttachment): Promise<void> => {
    const { propertyId, selectedImages, isVideoToggled, videoUrl } = props;
    const attachmentIds: IPropertyImagesPostPayload[] = [];
    selectedImages.forEach((selectedImage: AssetGallery) =>
      attachmentIds.push({ attachment: selectedImage.attachment, is_cover_image: selectedImage.isCoverImage })
    );
    if (isVideoToggled && !!videoUrl) {
      const payload = [{ link: videoUrl }];
      try {
        const urlResponse: IYoutubeResponse[] = await AssetRepository.postAttachmentUpload(payload);
        attachmentIds.push({ attachment: urlResponse[0].id, is_cover_image: false });
      } catch (e) {
        AlertHelper.error({ message: I18nService.t('property:validVideoUrl') });
        return;
      }
    }

    await AssetRepository.postAttachmentsForProperty(propertyId, attachmentIds);
  };
}

const imageService = new ImageService();
export { imageService as ImageService };
