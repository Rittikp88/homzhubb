import RNFetchBlob from 'rn-fetch-blob';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { PlatformUtils } from '@homzhub/common/src//utils/PlatformUtils';
import { AssetRepository } from '@homzhub/common/src//domain/repositories/AssetRepository';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
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

  // TODO: (Shikha) - Adding types and IOS part
  public downloadAttachment = async (refKey: string, fileName: string): Promise<void> => {
    const response: any = await AssetRepository.downloadAttachment(refKey);
    if (response) {
      try {
        const { dirs, writeFile, mkdir, isDir } = RNFetchBlob.fs;
        const dir = PlatformUtils.isIOS() ? dirs.DocumentDir : dirs.DownloadDir;
        RNFetchBlob.config({
          IOSBackgroundTask: true,
          fileCache: true,
          indicator: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            path: `${dir}/${fileName}`,
            notification: true,
            title: fileName,
          },
        })
          .fetch('GET', response.download_link)
          .then((res) => {
            // TODO: (Shikha) - Need to check for IOS
            if (PlatformUtils.isIOS()) {
              isDir(dir)
                .then(() => {
                  writeFile(`${dir}/${fileName}`, res.data, 'base64');
                })
                .catch(() => {
                  mkdir(dir).then(() => {
                    writeFile(`${dir}/${fileName}`, res.data, 'base64');
                  });
                });
            }
            AlertHelper.success({ message: 'Successfully Downloaded' });
          });
      } catch (err) {
        AlertHelper.success({ message: err });
      }
    }
  };
}

const attachmentService = new AttachmentService();
export { attachmentService as AttachmentService };
