import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { TicketCategory } from '@homzhub/common/src/domain/models/TicketCategory';
import { Ticket } from '@homzhub/common/src/domain/models/Ticket';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { IPostTicket, IPostTicketPayload } from '@homzhub/common/src/domain/repositories/interfaces';

const ENDPOINTS = {
  postTicket: 'tickets/',
  getCategories: 'ticket-categories/',
};

class TicketRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public postTicket = async (requestPayload: IPostTicketPayload): Promise<IPostTicket> => {
    return await this.apiClient.post(ENDPOINTS.postTicket, requestPayload);
  };

  public getTicketCategories = async (): Promise<TicketCategory[]> => {
    const response = await this.apiClient.get(ENDPOINTS.getCategories);
    return ObjectMapper.deserializeArray(TicketCategory, response);
  };

  public getTickets = async (): Promise<Ticket[]> => {
    const response = await this.apiClient.get(ENDPOINTS.postTicket);
    return ObjectMapper.deserializeArray(Ticket, response);
  };
}

const tedgerRepository = new TicketRepository();
export { tedgerRepository as TicketRepository };
