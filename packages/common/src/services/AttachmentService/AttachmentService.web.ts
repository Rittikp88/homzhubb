import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { AttachmentType, AttachmentError } from '@homzhub/common/src/constants/AttachmentTypes';

const baseUrl = ConfigHelper.getBaseUrl();

class AttachmentService {
  public uploadImage = async (formData: any, type: AttachmentType): Promise<any> => {
    const token = StoreProviderService.getUserToken();

    return await fetch(`${baseUrl}attachments/upload/?category=${type}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
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
    // todo implementation for web
  };
}

const attachmentService = new AttachmentService();
export { attachmentService as AttachmentService };
