import { ITicket } from '@homzhub/common/src/domain/models/Ticket';

export interface ITicketState {
  proofAttachment: string[];
  currentTicket: ICurrentTicket | null;
  tickets: ITicket[];
  loaders: {
    tickets: boolean;
  };
}

export interface ICurrentTicket {
  ticketId: number;
  quoteRequestId: number;
  propertyName?: string;
}
