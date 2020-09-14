import RNFetchBlob from 'rn-fetch-blob';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { PlatformUtils } from '@homzhub/common/src//utils/PlatformUtils';
import { AssetRepository } from '@homzhub/common/src//domain/repositories/AssetRepository';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { DownloadAttachment } from '@homzhub/common/src/domain/models/Attachment';
import { IUser } from '@homzhub/common/src/domain/models/User';

export enum AttachmentError {
  UPLOAD_IMAGE_ERROR = 'File is corrupted',
}

export const AllowedAttachmentFormats = {
  ImgJpeg: 'image/jpeg',
  ImgJpg: 'image/jpg',
  ImgPng: 'image/png',
  ImgPublic: 'public.image',
  AdobePdf: 'com.adobe.pdf',
  AppPdf: 'application/pdf',
};

const baseUrl = ConfigHelper.getBaseUrl();

class AttachmentService {
  public uploadImage = async (formData: any): Promise<any> => {
    const user: IUser | null = await StorageService.get(StorageKeys.USER);

    return await fetch(`${baseUrl}attachments/upload/`, {
      method: 'POST',
      headers: {
        'content-type': 'multipart/form-data',
        // @ts-ignore
        Authorization: `Bearer ${user.access_token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((e) => {
        Promise.reject(AttachmentError.UPLOAD_IMAGE_ERROR);
      });
  };

  public downloadAttachment = async (refKey: string, fileName: string): Promise<void> => {
    const response: DownloadAttachment = await AssetRepository.downloadAttachment(refKey);

    if (response) {
      try {
        const { dirs } = RNFetchBlob.fs;
        const dir = PlatformUtils.isIOS() ? dirs.DocumentDir : dirs.DownloadDir;
        const url = response.downloadLink;

        RNFetchBlob.config({
          IOSBackgroundTask: true,
          fileCache: true,
          indicator: true,
          path: `${dir}/${fileName}`,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: `${dir}/${fileName}`,
            title: fileName,
          },
        })
          .fetch('GET', url)
          .then((res) => {
            if (PlatformUtils.isIOS()) {
              RNFetchBlob.ios.previewDocument(res.path());
            } else {
              AlertHelper.success({ message: I18nService.t('downloadSuccess') });
            }
          })
          .catch((err) => {
            AlertHelper.error({ message: err });
          });
      } catch (err) {
        AlertHelper.error({ message: err });
      }
    }
  };
}

const attachmentService = new AttachmentService();
export { attachmentService as AttachmentService };
