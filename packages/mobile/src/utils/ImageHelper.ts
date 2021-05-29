import ImagePicker, { Image as ImagePickerResponse } from 'react-native-image-crop-picker';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { AssetGallery } from '@homzhub/common/src/domain/models/AssetGallery';
import { IPropertySelectedImages } from '@homzhub/common/src/domain/models/VerificationDocuments';
import { AttachmentType } from '@homzhub/common/src/constants/AttachmentTypes';

interface IUploadImage {
  assetId: number;
  selectedImages: AssetGallery[];
  toggleLoader?: () => void;
}

class ImageHelper {
  public handlePhotosUpload = async (props: IUploadImage): Promise<void> => {
    const { assetId, selectedImages, toggleLoader } = props;

    const store = StoreProviderService.getStore();

    try {
      // @ts-ignore
      const images: ImagePickerResponse[] = await ImagePicker.openPicker({
        multiple: true,
        compressImageMaxWidth: 400,
        compressImageMaxHeight: 400,
        compressImageQuality: PlatformUtils.isAndroid() ? 1 : 0.8,
        includeBase64: true,
        mediaType: 'photo',
      });
      const formData = new FormData();
      images.forEach((image) => {
        formData.append('files[]', {
          // @ts-ignore
          name: PlatformUtils.isIOS() ? image.filename : image.path.substring(image.path.lastIndexOf('/') + 1),
          uri: image.path,
          type: image.mime,
        });
      });

      try {
        if (toggleLoader) {
          toggleLoader();
        }
        const response = await AttachmentService.uploadImage(formData, AttachmentType.ASSET_IMAGE);

        const { data } = response;
        const localSelectedImages: IPropertySelectedImages[] = [];
        images.forEach((image, index: number) => {
          localSelectedImages.push({
            id: null,
            description: '',
            is_cover_image: false,
            asset: assetId,
            attachment: data[index].id,
            link: data[index].link,
            file_name: 'localImage',
            isLocalImage: true,
          });
        });
        if (selectedImages.length === 0) {
          localSelectedImages[0].is_cover_image = true;
        }
        console.log(localSelectedImages, selectedImages.concat(ObjectMapper.deserializeArray(AssetGallery, localSelectedImages)))
        store.dispatch(
          RecordAssetActions.setSelectedImages(
            selectedImages.concat(ObjectMapper.deserializeArray(AssetGallery, localSelectedImages))
          )
        );
        if (toggleLoader) {
          toggleLoader();
        }
      } catch (e) {
        if (toggleLoader) {
          toggleLoader();
        }
        AlertHelper.error({ message: e.message });
      }
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };
}

const imageHelper = new ImageHelper();
export { imageHelper as ImageHelper };
