import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { ITicket, Ticket } from '@homzhub/common/src/domain/models/Ticket';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IGetTicketParam } from '@homzhub/common/src/domain/repositories/interfaces';
import { ICurrentTicket } from '@homzhub/common/src/modules/tickets/interface';

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
  SET: {
    PROOF_ATTACHMENT: `${actionTypePrefix}PROOF_ATTACHMENT`,
    CURRENT_TICKET: `${actionTypePrefix}CURRENT_TICKET`,
  },
  REMOVE_ATTACHMENT: `${actionTypePrefix}REMOVE_ATTACHMENT`,
  CLEAR_STATE: `${actionTypePrefix}CLEAR_STATE`,
};

const setAttachment = (payload: string[]): IFluxStandardAction<string[]> => ({
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
  type: TicketActionTypes.GET.TICKET_DETAIL_SUCCESS,
});

export type TicketActionPayloadTypes = string[] | string | ITicket[] | ICurrentTicket | ITicket | IGetTicketParam;

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
};
