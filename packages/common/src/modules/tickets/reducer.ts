import { ReducerUtils } from '@homzhub/common/src/utils/ReducerUtils';
import { TicketActionPayloadTypes, TicketActionTypes } from '@homzhub/common/src//modules/tickets/actions';
import { ITicket } from '@homzhub/common/src/domain/models/Ticket';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { ICurrentTicket, ITicketState } from '@homzhub/common/src/modules/tickets/interface';
import { IImageSource } from '@homzhub/common/src/services/AttachmentService/interfaces';

export const initialTicketState: ITicketState = {
  proofAttachment: [],
  currentTicket: null,
  tickets: [],
  ticketDetail: null,
  loaders: {
    tickets: false,
    ticketDetail: false,
    closeTicket: false,
    ticketReminder: false,
  },
};

export const ticketReducer = (
  state: ITicketState = initialTicketState,
  action: IFluxStandardAction<TicketActionPayloadTypes>
): ITicketState => {
  switch (action.type) {
    case TicketActionTypes.SET.PROOF_ATTACHMENT:
      return {
        ...state,
        ['proofAttachment']: [...state.proofAttachment, ...(action.payload as IImageSource[])],
      };
    case TicketActionTypes.REMOVE_ATTACHMENT:
      return {
        ...state,
        ['proofAttachment']: ReducerUtils.removeAttachment(action.payload as string, state.proofAttachment),
      };
    case TicketActionTypes.GET.TICKETS:
      return {
        ...state,
        ['tickets']: [],
        ['loaders']: { ...state.loaders, ['tickets']: true },
      };
    case TicketActionTypes.GET.TICKETS_SUCCESS:
      return {
        ...state,
        ['tickets']: [...(action.payload as ITicket[])],
        ['loaders']: { ...state.loaders, ['tickets']: false },
      };
    case TicketActionTypes.GET.TICKETS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['tickets']: false },
      };
    case TicketActionTypes.SET.CURRENT_TICKET:
      return {
        ...state,
        ['currentTicket']: action.payload as ICurrentTicket,
      };
    case TicketActionTypes.GET.TICKET_DETAIL:
      return {
        ...state,
        ['ticketDetail']: initialTicketState.ticketDetail,
        ['currentTicket']: initialTicketState.currentTicket,
        ['loaders']: { ...state.loaders, ['ticketDetail']: true },
      };
    case TicketActionTypes.GET.TICKET_DETAIL_SUCCESS:
      return {
        ...state,
        ['ticketDetail']: action.payload as ITicket,
        ['loaders']: { ...state.loaders, ['ticketDetail']: false },
      };
    case TicketActionTypes.GET.TICKET_DETAIL_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['ticketDetail']: false },
      };
    case TicketActionTypes.CLOSE_TICKET:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['closeTicket']: true },
      };
    case TicketActionTypes.CLOSE_TICKET_SUCCESS:
    case TicketActionTypes.CLOSE_TICKET_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['closeTicket']: false },
      };
    case TicketActionTypes.SEND_TICKET_REMINDER:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['ticketReminder']: true },
      };
    case TicketActionTypes.HANDLE_TICKET_REMINDER_SENT:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['ticketReminder']: false },
      };
    case TicketActionTypes.CLEAR_STATE:
      return {
        ...state,
        proofAttachment: initialTicketState.proofAttachment,
        currentTicket: initialTicketState.currentTicket,
      };
    default:
      return {
        ...state,
      };
  }
};
