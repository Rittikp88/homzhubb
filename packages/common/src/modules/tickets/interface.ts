import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { IInvoiceSummary } from '@homzhub/common/src/domain/models/InvoiceSummary';
import { ITicket } from '@homzhub/common/src/domain/models/Ticket';
import { IImageSource } from '@homzhub/common/src/services/AttachmentService/interfaces';

export interface ITicketState {
  proofAttachment: IImageSource[];
  currentTicket: ICurrentTicket | null;
  tickets: ITicket[];
  ticketDetail: ITicket | null;
  invoiceSummary: IInvoiceSummary | null;
  loaders: {
    tickets: boolean;
    ticketDetail: boolean;
    invoiceSummary: boolean;
    closeTicket: boolean;
    ticketReminder: boolean;
  };
}

export interface ICurrentTicket {
  ticketId: number;
  quoteRequestId?: number;
  propertyName?: string;
  currency?: Currency;
  assetId?: number;
}
