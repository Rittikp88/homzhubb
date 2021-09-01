import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IInvoiceSummary, InvoiceSummary } from '@homzhub/common/src/domain/models/InvoiceSummary';
import { ITicket, Ticket } from '@homzhub/common/src/domain/models/Ticket';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IGetTicketParam, IInvoiceSummaryPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { ICurrentTicket } from '@homzhub/common/src/modules/tickets/interface';
import { IImageSource } from '@homzhub/common/src/services/AttachmentService/interfaces';

const actionTypePrefix = 'Ticket/';
export const TicketActionTypes = {
  GET: {
    TICKETS: `${actionTypePrefix}TICKETS`,
    TICKETS_SUCCESS: `${actionTypePrefix}TICKETS_SUCCESS`,
    TICKETS_FAILURE: `${actionTypePrefix}TICKETS_FAILURE`,
    TICKET_DETAIL: `${actionTypePrefix}TICKET_DETAIL`,
    TICKET_DETAIL_SUCCESS: `${actionTypePrefix}TICKET_DETAIL_SUCCESS`,
    TICKET_DETAIL_FAILURE: `${actionTypePrefix}TICKET_DETAIL_FAILURE`,
  },
  POST: {
    INVOICE_SUMMARY: `${actionTypePrefix}INVOICE_SUMMARY`,
    INVOICE_SUMMARY_SUCCESS: `${actionTypePrefix}INVOICE_SUMMARY_SUCCESS`,
    INVOICE_SUMMARY_FAILURE: `${actionTypePrefix}INVOICE_SUMMARY_FAILURE`,
  },
  SET: {
    PROOF_ATTACHMENT: `${actionTypePrefix}PROOF_ATTACHMENT`,
    CURRENT_TICKET: `${actionTypePrefix}CURRENT_TICKET`,
  },
  CLOSE_TICKET: `${actionTypePrefix}CLOSE_TICKET`,
  CLOSE_TICKET_SUCCESS: `${actionTypePrefix}CLOSE_TICKET_SUCCESS`,
  CLOSE_TICKET_FAILURE: `${actionTypePrefix}CLOSE_TICKET_FAILURE`,
  REMOVE_ATTACHMENT: `${actionTypePrefix}REMOVE_ATTACHMENT`,
  SEND_TICKET_REMINDER: `${actionTypePrefix}SEND_TICKET_REMINDER`,
  HANDLE_TICKET_REMINDER_SENT: `${actionTypePrefix}HANDLE_TICKET_REMINDER_SENT`,
  CLEAR_STATE: `${actionTypePrefix}CLEAR_STATE`,
};

const setAttachment = (payload: IImageSource[]): IFluxStandardAction<IImageSource[]> => ({
  type: TicketActionTypes.SET.PROOF_ATTACHMENT,
  payload,
});

const removeAttachment = (key: string): IFluxStandardAction<string> => ({
  type: TicketActionTypes.REMOVE_ATTACHMENT,
  payload: key,
});

const clearState = (): IFluxStandardAction => ({
  type: TicketActionTypes.CLEAR_STATE,
});

const getTickets = (payload?: IGetTicketParam): IFluxStandardAction<IGetTicketParam> => ({
  type: TicketActionTypes.GET.TICKETS,
  payload,
});

const getTicketsSuccess = (payload: Ticket[]): IFluxStandardAction<ITicket[]> => ({
  type: TicketActionTypes.GET.TICKETS_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getTicketsFailure = (): IFluxStandardAction => ({
  type: TicketActionTypes.GET.TICKETS_FAILURE,
});

const setCurrentTicket = (payload: ICurrentTicket): IFluxStandardAction<ICurrentTicket> => ({
  type: TicketActionTypes.SET.CURRENT_TICKET,
  payload,
});

const getTicketDetail = (payload: number): IFluxStandardAction<number> => ({
  type: TicketActionTypes.GET.TICKET_DETAIL,
  payload,
});

const getTicketDetailSuccess = (payload: Ticket): IFluxStandardAction<ITicket> => ({
  type: TicketActionTypes.GET.TICKET_DETAIL_SUCCESS,
  payload: ObjectMapper.serialize(payload),
});

const getTicketDetailFailure = (): IFluxStandardAction => ({
  type: TicketActionTypes.GET.TICKET_DETAIL_FAILURE,
});

const getInvoiceSummary = (payload: IInvoiceSummaryPayload): IFluxStandardAction<IInvoiceSummaryPayload> => ({
  type: TicketActionTypes.POST.INVOICE_SUMMARY,
  payload,
});

const getInvoiceSummarySuccess = (payload: InvoiceSummary): IFluxStandardAction<IInvoiceSummary> => ({
  type: TicketActionTypes.POST.INVOICE_SUMMARY_SUCCESS,
  payload: ObjectMapper.serialize(payload),
});

const getInvoiceSummaryFailure = (): IFluxStandardAction => ({
  type: TicketActionTypes.POST.INVOICE_SUMMARY_FAILURE,
});

const closeTicket = (): IFluxStandardAction => ({
  type: TicketActionTypes.CLOSE_TICKET,
});

const closeTicketSuccess = (): IFluxStandardAction => ({
  type: TicketActionTypes.CLOSE_TICKET_SUCCESS,
});

const closeTicketFailure = (): IFluxStandardAction => ({
  type: TicketActionTypes.CLOSE_TICKET_FAILURE,
});

const sendTicketReminder = (): IFluxStandardAction => ({
  type: TicketActionTypes.SEND_TICKET_REMINDER,
});

const handleTicketReminderSent = (): IFluxStandardAction => ({
  type: TicketActionTypes.HANDLE_TICKET_REMINDER_SENT,
});

export type TicketActionPayloadTypes =
  | string[]
  | string
  | number
  | ITicket[]
  | ICurrentTicket
  | ITicket
  | IGetTicketParam
  | IImageSource[]
  | IInvoiceSummaryPayload
  | IInvoiceSummary;

export const TicketActions = {
  setAttachment,
  removeAttachment,
  clearState,
  getTickets,
  getTicketsSuccess,
  getTicketDetail,
  getTicketDetailSuccess,
  getTicketDetailFailure,
  setCurrentTicket,
  getTicketsFailure,
  getInvoiceSummary,
  getInvoiceSummarySuccess,
  getInvoiceSummaryFailure,
  closeTicket,
  closeTicketSuccess,
  closeTicketFailure,
  sendTicketReminder,
  handleTicketReminderSent,
};
