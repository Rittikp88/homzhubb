import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
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
}

const attachmentService = new AttachmentService();
export { attachmentService as AttachmentService };
