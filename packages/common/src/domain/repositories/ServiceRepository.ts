import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import {
  IServiceDetail,
  IServiceListStepsDetail,
  IVerificationDocumentList,
  IVerificationTypes,
} from '@homzhub/common/src/domain/models/Service';
import { IServiceParam } from '@homzhub/common/src/domain/repositories/interfaces';

const ENDPOINTS = {
  getServiceData: (): string => 'service-categories/services/',
  getServiceSteps: (): string => 'service-categories/services/steps',
  getVerificationDocumentDetails: (categoryId: number): string =>
    `service-categories/${categoryId}/verification-document-types`,
  existingVerificationDocuments: (assetId: number): string => `assets/${assetId}/verification-documents`,
  // TODO: Add the url for post call
  postDocument: (): string => 'someURLForPostingDocuments',
  getPropertyVerificationHelperMarkdown: (): string => 'someURLForPropertyVerificationMarkdown',
};

class ServiceRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getServiceDetail = async (param: IServiceParam): Promise<IServiceDetail[]> => {
    return await this.apiClient.get(ENDPOINTS.getServiceData(), param);
  };

  public getServiceStepsDetails = async (serviceId: number): Promise<IServiceListStepsDetail[]> => {
    return await this.apiClient.get(ENDPOINTS.getServiceSteps(), { service_id: serviceId });
  };

  public getVerificationDocumentTypes = async (categoryId: number): Promise<IVerificationTypes[]> => {
    return await this.apiClient.get(ENDPOINTS.getVerificationDocumentDetails(categoryId));
  };

  public getExistingVerificationDocuments = async (assetId: number): Promise<IVerificationDocumentList[]> => {
    return await this.apiClient.get(ENDPOINTS.existingVerificationDocuments(assetId));
  };

  public postDocument = async (requestBody: any): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.postDocument(), requestBody);
  };

  public deleteVerificationDocument = async (documentId: number): Promise<void> => {
    return await this.apiClient.delete(ENDPOINTS.existingVerificationDocuments(documentId));
  };

  public getPropertyVerificationHelperMarkdown = async (): Promise<void> => {
    return await this.apiClient.get(ENDPOINTS.getPropertyVerificationHelperMarkdown());
  };
}

const serviceRepository = new ServiceRepository();
export { serviceRepository as ServiceRepository };
