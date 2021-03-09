import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { ITicket, Ticket } from '@homzhub/common/src/domain/models/Ticket';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';

const actionTypePrefix = 'Ticket/';
export const TicketActionTypes = {
  SET: {
    PROOF_ATTACHMENT: `${actionTypePrefix}PROOF_ATTACHMENT`,
  },
  REMOVE_ATTACHMENT: `${actionTypePrefix}REMOVE_ATTACHMENT`,
  CLEAR_STATE: `${actionTypePrefix}CLEAR_STATE`,
  GET: {
    GET_TICKETS: `${actionTypePrefix}GET_TICKETS`,
    GET_TICKETS_SUCCESS: `${actionTypePrefix}GET_TICKETS_SUCCESS`,
  },
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

const getTickets = (): IFluxStandardAction => ({
  type: TicketActionTypes.GET.GET_TICKETS,
});

const getTicketsSuccess = (payload: Ticket[]): IFluxStandardAction<ITicket[]> => ({
  type: TicketActionTypes.GET.GET_TICKETS_SUCCESS,
  payload: ObjectMapper.serialize(payload),
});

export type TicketActionPayloadTypes = string[] | string | ITicket[];

export const TicketActions = {
  setAttachment,
  removeAttachment,
  clearState,
  getTickets,
  getTicketsSuccess,
};
