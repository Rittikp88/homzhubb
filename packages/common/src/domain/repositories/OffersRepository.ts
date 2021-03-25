import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { ProspectProfile } from '@homzhub/common/src/domain/models/ProspectProfile';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { OfferManagement } from '@homzhub/common/src/domain/models/OfferManagement';
import { ReceivedOfferFilter } from '@homzhub/common/src/domain/models/ReceivedOfferFilter';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import {
  INegotiationParam,
  INegotiationPayload,
  IReceivedNegotiationParam,
  IUpdateProspectProfile,
  IPostOfferLease,
  IPostOfferSell,
  ISubmitOffer,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';

const ENDPOINTS = {
  prospects: 'prospects/',
  tenantTypes: 'list-of-values/prospect-tenant-types/',
  jobTypes: 'list-of-values/user-employer-job-types/',
  submitOffer: (param: INegotiationParam): string =>
    `${param.listingType}/${param.listingId}/${param.negotiationType}/`,
  listingNegotiations: (param: INegotiationParam): string =>
    `${param.listingType}/${param.listingId}/${param.negotiationType}/${param.negotiationId}/`,
  receivedListingNegotiations: (): string => 'listings-negotiations/received',
  offerManagement: (): string => 'offers/management-tab/',
  receivedOfferFilters: (): string => 'filters/offers-received',
};

class OffersRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getProspectsInfo = async (): Promise<ProspectProfile> => {
    const response = await this.apiClient.get(ENDPOINTS.prospects);
    return ObjectMapper.deserialize(ProspectProfile, response);
  };

  public getTenantTypes = async (): Promise<Unit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.tenantTypes);
    return ObjectMapper.deserializeArray(Unit, response);
  };

  public getJobType = async (): Promise<Unit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.jobTypes);
    return ObjectMapper.deserializeArray(Unit, response);
  };

  public updateProspects = async (body: IUpdateProspectProfile): Promise<void> => {
    return await this.apiClient.put(ENDPOINTS.prospects, body);
  };

  public postOffer = async (payload: ISubmitOffer): Promise<IPostOfferLease | IPostOfferSell> => {
    const { param, data } = payload;
    return await this.apiClient.post(ENDPOINTS.submitOffer(param), data);
  };

  public updateNegotiation = async (payload: INegotiationPayload): Promise<void> => {
    const { param, data } = payload;
    return await this.apiClient.patch(ENDPOINTS.listingNegotiations(param), data);
  };

  public getReceivedOffers = async (params: IReceivedNegotiationParam): Promise<Asset[]> => {
    const response = await this.apiClient.get(ENDPOINTS.receivedListingNegotiations(), params);
    return ObjectMapper.deserializeArray(Asset, response);
  };

  public getOfferData = async (): Promise<OfferManagement> => {
    const response = await this.apiClient.get(ENDPOINTS.offerManagement());
    return ObjectMapper.deserialize(OfferManagement, response);
  };

  public getReceivedOfferFilters = async (): Promise<ReceivedOfferFilter> => {
    const response = await this.apiClient.get(ENDPOINTS.receivedOfferFilters());
    return ObjectMapper.deserialize(ReceivedOfferFilter, response);
  };
}

const offersRepository = new OffersRepository();
export { offersRepository as OffersRepository };
