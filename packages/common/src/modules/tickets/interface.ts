import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { ITicket } from '@homzhub/common/src/domain/models/Ticket';

export interface ITicketState {
  proofAttachment: string[];
  currentTicket: ICurrentTicket | null;
  tickets: ITicket[];
  ticketDetail: ITicket | null;
  loaders: {
    tickets: boolean;
    ticketDetail: boolean;
  };
}

export interface ICurrentTicket {
  ticketId: number;
  quoteRequestId?: number;
  propertyName?: string;
  currency?: Currency;
}
