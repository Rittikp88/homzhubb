import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { IPostTicketPayload } from '@homzhub/common/src/domain/repositories/interfaces';

const ENDPOINTS = {
  postTicket: 'tickets/',
  getCategories: 'ticket-categories/',
};

class TicketRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public postTicket = async (requestPayload: IPostTicketPayload): Promise<void> => {
    return await this.apiClient.get(ENDPOINTS.postTicket, requestPayload);
  };
}

const tedgerRepository = new TicketRepository();
export { tedgerRepository as TicketRepository };
