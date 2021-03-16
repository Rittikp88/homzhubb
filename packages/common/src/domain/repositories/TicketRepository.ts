import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { Ticket } from '@homzhub/common/src/domain/models/Ticket';
import { TicketCategory } from '@homzhub/common/src/domain/models/TicketCategory';
import { QuoteCategory } from '@homzhub/common/src/domain/models/QuoteCategory';
import { QuoteRequest } from '@homzhub/common/src/domain/models/QuoteRequest';
import {
  ICompleteTicketPayload,
  IGetTicketParam,
  IPostTicket,
  IPostTicketPayload,
  IQuoteApprovePayload,
  IQuoteParam,
  IQuoteSubmitPayload,
  ISubmitReview,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';

const ENDPOINTS = {
  ticket: 'tickets/',
  ticketCategories: 'ticket-categories/',
  quoteRequest: (param: IQuoteParam): string => `tickets/${param.ticketId}/quote-requests/${param.quoteRequestId}/`,
  quoteRequestCategory: (param: IQuoteParam): string =>
    `tickets/${param.ticketId}/quote-requests/${param.quoteRequestId}/quote-request-categories/`,
  quoteSubmit: (param: IQuoteParam): string =>
    `tickets/${param.ticketId}/quote-requests/${param.quoteRequestId}/quote-submit-group/`,
  reviewSubmit: (ticketId: number): string => `tickets/${ticketId}/reviews/`,
  quoteApprove: (param: IQuoteParam): string => `tickets/${param.ticketId}/quote-approved-group/`,
  ticketById: (ticketId: number): string => `tickets/${ticketId}/`,
};

class TicketRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public postTicket = async (requestPayload: IPostTicketPayload): Promise<IPostTicket> => {
    return await this.apiClient.post(ENDPOINTS.ticket, requestPayload);
  };

  public getTicketCategories = async (): Promise<TicketCategory[]> => {
    const response = await this.apiClient.get(ENDPOINTS.ticketCategories);
    return ObjectMapper.deserializeArray(TicketCategory, response);
  };

  public getTickets = async (param?: IGetTicketParam): Promise<Ticket[]> => {
    const response = await this.apiClient.get(ENDPOINTS.ticket, param);
    return ObjectMapper.deserializeArray(Ticket, response);
  };

  public getTicketDetail = async (payload: number): Promise<Ticket> => {
    const response = await this.apiClient.get(ENDPOINTS.ticketById(payload));
    return ObjectMapper.deserialize(Ticket, response);
  };

  public getQuoteRequestCategory = async (param: IQuoteParam): Promise<QuoteCategory[]> => {
    const response = await this.apiClient.get(ENDPOINTS.quoteRequestCategory(param));
    return ObjectMapper.deserializeArray(QuoteCategory, response);
  };

  public quoteSubmit = async (payload: IQuoteSubmitPayload): Promise<void> => {
    const { param, data } = payload;
    return await this.apiClient.post(ENDPOINTS.quoteSubmit(param), data);
  };

  public reviewSubmit = async (payload: ISubmitReview): Promise<void> => {
    const { param, data } = payload;
    return await this.apiClient.post(ENDPOINTS.reviewSubmit(param.ticketId), data);
  };

  public getQuoteRequest = async (param: IQuoteParam): Promise<QuoteRequest> => {
    const response = await this.apiClient.get(ENDPOINTS.quoteRequest(param));
    return ObjectMapper.deserialize(QuoteRequest, response);
  };

  public quoteApprove = async (payload: IQuoteApprovePayload): Promise<void> => {
    const { param, data } = payload;
    return await this.apiClient.post(ENDPOINTS.quoteApprove(param), data);
  };

  public completeTicket = async (payload: ICompleteTicketPayload): Promise<void> => {
    const { param, data } = payload;
    return await this.apiClient.patch(ENDPOINTS.ticketById(param.ticketId), data);
  };
}

const ticketRepository = new TicketRepository();
export { ticketRepository as TicketRepository };