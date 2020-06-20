import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import {
  IServiceDetail,
  IServiceListStepsDetail,
  IVerificationDocumentList,
  IVerificationTypes,
  IPropertySelectedImages,
} from '@homzhub/common/src/domain/models/Service';

const ENDPOINTS = {
  getServiceData: (serviceId: number): string => `service-categories/${serviceId}/services`,
  getServiceSteps: (serviceId: number): string => `service-categories/services/${serviceId}/steps`,
  getVerificationDocumentDetails: (categoryId: number): string =>
    `service-categories/${categoryId}/verification-document-types`,
  existingVerificationDocuments: (propertyId: number): string => `assets/${propertyId}/verification-documents`,
  deleteExistingVerificationDocuments: (propertyId: number, documentId: number): string =>
    `assets/${propertyId}/verification-documents/${documentId}`,
  // TODO: Add the url for post call
  postDocument: (): string => 'someURLForPostingDocuments',
  getPropertyVerificationHelperMarkdown: (): string => 'someURLForPropertyVerificationMarkdown',
  attachmentUpload: (): string => 'attachments/upload/',
  getAssetAttachments: (propertyId: number): string => `assets/${propertyId}/attachments`,
  postAssetAttachments: (propertyId: number): string => `assets/${propertyId}/attachments/`,
  markAttachmentAsCoverImage: (propertyId: number, attachmentId: number): string =>
    `assets/${propertyId}/attachments/${attachmentId}/cover-image`,
  deletePropertyAttachment: (propertyId: number, attachmentId: number): string =>
    `assets/${propertyId}/attachments/${attachmentId}/`,
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

  // TODO: Add the return type when the api is ready
  public postDocument = async (requestBody: any): Promise<any> => {
    return await this.apiClient.post(ENDPOINTS.postDocument(), requestBody);
  };

  // TODO: Add the return type when the api is ready
  public deleteVerificationDocument = async (propertyId: number, documentId: number): Promise<any> => {
    return await this.apiClient.delete(ENDPOINTS.deleteExistingVerificationDocuments(propertyId, documentId));
  };

  // TODO: Add the return type when the api is ready
  public getPropertyVerificationHelperMarkdown = async (): Promise<any> => {
    return await this.apiClient.get(ENDPOINTS.getPropertyVerificationHelperMarkdown());
  };

  // TODO: Add the return type when the api is ready
  public postAttachment = async (requestBody: any): Promise<any> => {
    return await this.apiClient.post(ENDPOINTS.attachmentUpload(), requestBody);
  };

  public getPropertyImagesByPropertyId = async (propertyId: number): Promise<IPropertySelectedImages[]> => {
    return await this.apiClient.get(ENDPOINTS.getAssetAttachments(propertyId));
  };

  // TODO: Add the return type when the api is ready
  public markAttachmentAsCoverImage = async (propertyId: number, attachmentId: number): Promise<any> => {
    return await this.apiClient.get(ENDPOINTS.markAttachmentAsCoverImage(propertyId, attachmentId));
  };

  // TODO: Add the return type when the api is ready
  public postAttachmentsForProperty = async (propertyId: number, requestBody: { id: number[] }): Promise<any> => {
    return await this.apiClient.post(ENDPOINTS.postAssetAttachments(propertyId), requestBody);
  };

  // TODO: Add the return type when the api is ready
  public deletePropertyImage = async (propertyId: number, attachmentId: number): Promise<any> => {
    return await this.apiClient.delete(ENDPOINTS.deletePropertyAttachment(propertyId, attachmentId));
  };
}

const serviceRepository = new ServiceRepository();
export { serviceRepository as ServiceRepository };
