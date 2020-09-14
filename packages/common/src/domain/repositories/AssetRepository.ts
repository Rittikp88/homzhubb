import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IPropertyDetailsData } from '@homzhub/common/src/domain/models/Property';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import {
  ICreateAssetDetails,
  ICreateAssetResult,
  ICreateDocumentPayload,
  IScheduleVisitPayload,
  IUpcomingVisitPayload,
  IUpdateAssetDetails,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { DownloadAttachment } from '@homzhub/common/src/domain/models/Attachment';
import { AssetDocument } from '@homzhub/common/src/domain/models/AssetDocument';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { AssetLeadType, UpcomingSlot } from '@homzhub/common/src/domain/models/AssetVisit';
import {
  ILeaseTermDetails,
  ICreateLeaseTermDetails,
  IUpdateLeaseTermDetails,
} from '@homzhub/common/src/domain/models/LeaseTerms';
import {
  ICreateSaleTermDetails,
  ISaleDetails,
  IUpdateSaleTermDetails,
} from '@homzhub/common/src/domain/models/SaleTerms';
import {
  IMarkCoverImageAttachment,
  IPostVerificationDocuments,
  IPropertyImagesPostPayload,
  IPropertySelectedImages,
  IVerificationDocumentList,
  IVerificationTypes,
} from '@homzhub/common/src/domain/models/Service';

const ENDPOINTS = {
  asset: (): string => 'assets/',
  updateAsset: (id: number): string => `assets/${id}/`,
  getAssetById: (propertyId: number): string => `assets/${propertyId}/`,
  leaseTerms: (propertyId: number): string => `assets/${propertyId}/lease-listings/`,
  updateLeaseTerms: (propertyId: number, leaseTermId: number): string =>
    `assets/${propertyId}/lease-listings/${leaseTermId}/`,
  saleTerms: (propertyId: number): string => `assets/${propertyId}/sale-listings/`,
  updateSaleTerms: (propertyId: number, saleTermId: number): string =>
    `assets/${propertyId}/sale-listings/${saleTermId}/`,
  existingVerificationDocuments: (propertyId: number): string => `assets/${propertyId}/verification-documents/`,
  deleteExistingVerificationDocuments: (propertyId: number, documentId: number): string =>
    `assets/${propertyId}/verification-documents/${documentId}/`,
  assetAttachments: (propertyId: number): string => `assets/${propertyId}/attachments/`,
  postVerificationDocuments: (propertyId: number): string => `assets/${propertyId}/verification-documents/`,
  markAttachmentAsCoverImage: (propertyId: number, attachmentId: number): string =>
    `assets/${propertyId}/attachments/${attachmentId}/cover-image`,
  getPropertyDetails: (): string => 'asset-groups/',
  deletePropertyAttachment: (attachmentId: number): string => `attachments/${attachmentId}`,
  assetIdentityDocuments: (): string => 'asset-identity-documents/',
  getVerificationDocumentDetails: (): string => 'verification-document-types/',
  getRatings: (id: number): string => `assets/${id}/ratings`,
  getLeaseListing: (propertyTermId: number): string => `lease-listings/${propertyTermId}`,
  getSaleListing: (propertyTermId: number): string => `sale-listings/${propertyTermId}`,
  getSimilarPropertiesForLease: (propertyTermId: number): string =>
    `lease-listings/${propertyTermId}/similar-properties/`,
  getSimilarPropertiesForSale: (propertyTermId: number): string =>
    `sale-listings/${propertyTermId}/similar-properties/`,
  assetDocument: (propertyId: number): string => `assets/${propertyId}/asset-documents/`,
  deleteAssetDocument: (propertyId: number, documentId: number): string =>
    `assets/${propertyId}/asset-documents/${documentId}/`,
  downloadAttachment: (): string => 'attachments/download/',
  getVisitLead: (): string => 'list-of-values/site-visit-lead-types/',
  getUpcomingVisits: (): string => 'listing-visits/upcoming-visits/',
  assetVisit: (): string => 'listing-visits/',
};

class AssetRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getAssetById = async (propertyId: number): Promise<Asset> => {
    const response = await this.apiClient.get(ENDPOINTS.getAssetById(propertyId));
    return ObjectMapper.deserialize(Asset, response);
  };

  public getDetails = async (): Promise<IPropertyDetailsData[]> => {
    return await this.apiClient.get(ENDPOINTS.getPropertyDetails());
  };

  public createAsset = async (assetDetails: ICreateAssetDetails): Promise<ICreateAssetResult> => {
    return await this.apiClient.post(ENDPOINTS.asset(), assetDetails);
  };

  public updateAsset = async (id: number, requestBody: IUpdateAssetDetails): Promise<void> => {
    return await this.apiClient.patch(ENDPOINTS.updateAsset(id), requestBody);
  };

  public getLeaseTerms = async (propertyId: number): Promise<ILeaseTermDetails[]> => {
    return await this.apiClient.get(ENDPOINTS.leaseTerms(propertyId));
  };

  public createLeaseTerms = async (
    propertyId: number,
    leaseTerms: ICreateLeaseTermDetails
  ): Promise<{ id: number }> => {
    return await this.apiClient.post(ENDPOINTS.leaseTerms(propertyId), leaseTerms);
  };

  public updateLeaseTerms = async (
    propertyId: number,
    leaseTermId: number,
    leaseTerms: IUpdateLeaseTermDetails
  ): Promise<void> => {
    return await this.apiClient.put(ENDPOINTS.updateLeaseTerms(propertyId, leaseTermId), leaseTerms);
  };

  public getSaleTerms = async (propertyId: number): Promise<ISaleDetails[]> => {
    return await this.apiClient.get(ENDPOINTS.saleTerms(propertyId));
  };

  public createSaleTerms = async (propertyId: number, saleTerms: ICreateSaleTermDetails): Promise<{ id: number }> => {
    return await this.apiClient.post(ENDPOINTS.saleTerms(propertyId), saleTerms);
  };

  public updateSaleTerms = async (
    propertyId: number,
    saleTermId: number,
    saleTerms: IUpdateSaleTermDetails
  ): Promise<void> => {
    return await this.apiClient.put(ENDPOINTS.updateSaleTerms(propertyId, saleTermId), saleTerms);
  };

  public getExistingVerificationDocuments = async (propertyId: number): Promise<IVerificationDocumentList[]> => {
    return await this.apiClient.get(ENDPOINTS.existingVerificationDocuments(propertyId));
  };

  public deleteVerificationDocument = async (propertyId: number, documentId: number): Promise<void> => {
    return await this.apiClient.delete(ENDPOINTS.deleteExistingVerificationDocuments(propertyId, documentId));
  };

  public getPropertyImagesByPropertyId = async (propertyId: number): Promise<IPropertySelectedImages[]> => {
    return await this.apiClient.get(ENDPOINTS.assetAttachments(propertyId));
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
  ): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.assetAttachments(propertyId), requestBody);
  };

  public postVerificationDocuments = async (
    propertyId: number,
    requestBody: IPostVerificationDocuments[]
  ): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.postVerificationDocuments(propertyId), requestBody);
  };

  public deletePropertyImage = async (attachmentId: number): Promise<void> => {
    return await this.apiClient.delete(ENDPOINTS.deletePropertyAttachment(attachmentId));
  };

  public getAssetIdentityDocuments = async (): Promise<IVerificationDocumentList[]> => {
    return await this.apiClient.get(ENDPOINTS.assetIdentityDocuments());
  };

  public getVerificationDocumentTypes = async (): Promise<IVerificationTypes[]> => {
    return await this.apiClient.get(ENDPOINTS.getVerificationDocumentDetails());
  };

  public getRatings = async (id: number): Promise<AssetReview[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getRatings(id));
    return ObjectMapper.deserializeArray(AssetReview, response);
  };

  public getLeaseListing = async (propertyTermId: number): Promise<Asset> => {
    const response = await this.apiClient.get(ENDPOINTS.getLeaseListing(propertyTermId));
    return ObjectMapper.deserialize(Asset, response);
  };

  public getSaleListing = async (propertyTermId: number): Promise<Asset> => {
    const response = await this.apiClient.get(ENDPOINTS.getSaleListing(propertyTermId));
    return ObjectMapper.deserialize(Asset, response);
  };

  public getSimilarProperties = async (propertyTermId: number, type: number): Promise<Asset[]> => {
    if (type === 0) {
      // RENT FLOW
      const response = await this.apiClient.get(ENDPOINTS.getSimilarPropertiesForLease(propertyTermId));
      return ObjectMapper.deserializeArray(Asset, response);
    }
    // SALE FLOW
    const response = await this.apiClient.get(ENDPOINTS.getSimilarPropertiesForSale(propertyTermId));
    return ObjectMapper.deserializeArray(Asset, response);
  };

  public getPropertiesByStatus = async (status?: string): Promise<Asset[]> => {
    const response = await this.apiClient.get(ENDPOINTS.asset(), { status });
    return ObjectMapper.deserializeArray(Asset, response);
  };

  public createAssetDocument = async (payload: ICreateDocumentPayload): Promise<void> => {
    const { propertyId, documentData } = payload;
    await this.apiClient.post(ENDPOINTS.assetDocument(propertyId), documentData);
  };

  public getAssetDocument = async (propertyId: number): Promise<AssetDocument[]> => {
    const response = await this.apiClient.get(ENDPOINTS.assetDocument(propertyId));
    return ObjectMapper.deserializeArray(AssetDocument, response);
  };

  public deleteAssetDocument = async (propertyId: number, documentId: number): Promise<void> => {
    await this.apiClient.delete(ENDPOINTS.deleteAssetDocument(propertyId, documentId));
  };

  public downloadAttachment = async (refKey: string): Promise<DownloadAttachment> => {
    const response = await this.apiClient.get(ENDPOINTS.downloadAttachment(), { presigned_reference_key: refKey });
    return ObjectMapper.deserialize(DownloadAttachment, response);
  };

  public getVisitLeadType = async (): Promise<AssetLeadType[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getVisitLead());
    return ObjectMapper.deserializeArray(AssetLeadType, response);
  };

  public getUpcomingVisits = async (payload?: IUpcomingVisitPayload): Promise<UpcomingSlot[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getUpcomingVisits(), payload);
    return ObjectMapper.deserializeArray(UpcomingSlot, response);
  };

  public scheduleVisit = async (payload: IScheduleVisitPayload): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.assetVisit(), payload);
  };
}

const propertyRepository = new AssetRepository();
export { propertyRepository as AssetRepository };
