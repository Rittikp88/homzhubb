import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { ITicket } from '@homzhub/common/src/domain/models/Ticket';
import { IImageSource } from '@homzhub/common/src/services/AttachmentService/interfaces';

export interface ITicketState {
  proofAttachment: IImageSource[];
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
  assetId?: number;
}
