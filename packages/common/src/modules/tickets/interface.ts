import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { IInvoiceSummary } from '@homzhub/common/src/domain/models/InvoiceSummary';
import { ITicket } from '@homzhub/common/src/domain/models/Ticket';
import { IQuoteCategory } from '@homzhub/common/src/domain/models/QuoteCategory';
import { IDocumentSource, IImageSource } from '@homzhub/common/src/services/AttachmentService/interfaces';
import {
  IQuoteRequestParam,
  IQuoteSubmitPayload,
  IReassignTicketParam,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { IQuoteGroup } from '@homzhub/common/src/constants/ServiceTickets';

export interface ITicketState {
  proofAttachment: IImageSource[];
  currentTicket: ICurrentTicket | null;
  tickets: ITicket[];
  ticketDetail: ITicket | null;
  invoiceSummary: IInvoiceSummary | null;
  quoteAttachment: IDocumentSource[];
  quotes: IQuoteGroup[];
  quotesCategory: IQuoteCategory[];
  loaders: {
    tickets: boolean;
    ticketDetail: boolean;
    invoiceSummary: boolean;
    closeTicket: boolean;
    ticketReminder: boolean;
    reassignTicket: boolean;
    requestQuote: boolean;
    quotesCategory: boolean;
    submitQuote: boolean;
  };
}

export interface ICurrentTicket {
  ticketId: number;
  quoteRequestId?: number;
  propertyName?: string;
  currency?: Currency;
  assetId?: number;
  assignedUserId?: number;
}

export interface IReassignTicket {
  ticketId: number;
  payload: IReassignTicketParam;
  onCallback: (status: boolean) => void;
}

export interface IRequestQuote {
  ticketId: number;
  payload: IQuoteRequestParam;
  onCallback: (status: boolean) => void;
}

export interface ISubmitQuote {
  data: IQuoteSubmitPayload;
  onCallback: (status: boolean) => void;
}
