import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import {
  IServiceDetail,
  IServiceListStepsDetail,
  IVerificationDocumentList,
  IVerificationTypes,
  IPropertySelectedImages,
  IPropertyImagesPostPayload,
  IMarkCoverImageAttachment,
  IPostVerificationDocuments,
} from '@homzhub/common/src/domain/models/Service';

const ENDPOINTS = {
  getServiceData: (serviceId: number): string => `service-categories/${serviceId}/services`,
  getServiceSteps: (serviceId: number): string => `service-categories/services/${serviceId}/steps`,
  getVerificationDocumentDetails: (categoryId: number): string =>
    `service-categories/${categoryId}/verification-document-types`,
  existingVerificationDocuments: (propertyId: number): string => `assets/${propertyId}/verification-documents`,
  deleteExistingVerificationDocuments: (propertyId: number, documentId: number): string =>
    `assets/${propertyId}/verification-documents/${documentId}`,
  postVerificationDocuments: (propertyId: number): string => `assets/${propertyId}/verification-documents/`,
  getAssetAttachments: (propertyId: number): string => `assets/${propertyId}/attachments`,
  postAssetAttachments: (propertyId: number): string => `assets/${propertyId}/attachments/`,
  markAttachmentAsCoverImage: (propertyId: number, attachmentId: number): string =>
    `assets/${propertyId}/attachments/${attachmentId}/cover-image`,
  deletePropertyAttachment: (attachmentId: number): string => `attachments/${attachmentId}`,
};

class ServiceRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getServiceDetail = async (serviceId: number): Promise<IServiceDetail[]> => {
    return await this.apiClient.get(ENDPOINTS.getServiceData(serviceId));
  };

  public getServiceStepsDetails = async (serviceId: number): Promise<IServiceListStepsDetail[]> => {
    return await this.apiClient.get(ENDPOINTS.getServiceSteps(serviceId));
  };

  public getVerificationDocumentTypes = async (categoryId: number): Promise<IVerificationTypes[]> => {
    return await this.apiClient.get(ENDPOINTS.getVerificationDocumentDetails(categoryId));
  };

  public getExistingVerificationDocuments = async (propertyId: number): Promise<IVerificationDocumentList[]> => {
    return await this.apiClient.get(ENDPOINTS.existingVerificationDocuments(propertyId));
  };

  public deleteVerificationDocument = async (propertyId: number, documentId: number): Promise<any> => {
    return await this.apiClient.delete(ENDPOINTS.deleteExistingVerificationDocuments(propertyId, documentId));
  };

  public getPropertyImagesByPropertyId = async (propertyId: number): Promise<IPropertySelectedImages[]> => {
    return await this.apiClient.get(ENDPOINTS.getAssetAttachments(propertyId));
  };

  public markAttachmentAsCoverImage = async (
    propertyId: number,
    attachmentId: number
  ): Promise<IMarkCoverImageAttachment> => {
    return await this.apiClient.put(ENDPOINTS.markAttachmentAsCoverImage(propertyId, attachmentId));
  };

  public postAttachmentsForProperty = async (
    propertyId: number,
    requestBody: IPropertyImagesPostPayload[]
  ): Promise<any> => {
    return await this.apiClient.post(ENDPOINTS.postAssetAttachments(propertyId), requestBody);
  };

  public deletePropertyImage = async (attachmentId: number): Promise<any> => {
    return await this.apiClient.delete(ENDPOINTS.deletePropertyAttachment(attachmentId));
  };

  public postVerificationDocuments = async (
    propertyId: number,
    requestBody: IPostVerificationDocuments[]
  ): Promise<any> => {
    return await this.apiClient.post(ENDPOINTS.postVerificationDocuments(propertyId), requestBody);
  };
}

const serviceRepository = new ServiceRepository();
export { serviceRepository as ServiceRepository };
