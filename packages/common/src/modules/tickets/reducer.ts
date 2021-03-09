import { ReducerUtils } from '@homzhub/common/src/utils/ReducerUtils';
import { TicketActionPayloadTypes, TicketActionTypes } from '@homzhub/common/src//modules/tickets/actions';
import { ITicket } from '@homzhub/common/src/domain/models/Ticket';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { ICurrentTicket, ITicketState } from '@homzhub/common/src/modules/tickets/interface';

export const initialTicketState: ITicketState = {
  proofAttachment: [],
  currentTicket: null,
  tickets: [],
};

export const ticketReducer = (
  state: ITicketState = initialTicketState,
  action: IFluxStandardAction<TicketActionPayloadTypes>
): ITicketState => {
  switch (action.type) {
    case TicketActionTypes.SET.PROOF_ATTACHMENT:
      return {
        ...state,
        ['proofAttachment']: [...state.proofAttachment, ...(action.payload as string[])],
      };
    case TicketActionTypes.REMOVE_ATTACHMENT:
      return {
        ...state,
        ['proofAttachment']: ReducerUtils.removeAttachment(action.payload as string, state.proofAttachment),
      };
    case TicketActionTypes.CLEAR_STATE:
      return {
        ...state,
        proofAttachment: initialTicketState.proofAttachment,
      };
    case TicketActionTypes.GET.GET_TICKETS_SUCCESS:
      return {
        ...state,
        ['tickets']: action.payload as ITicket[],
      };
    case TicketActionTypes.SET.CURRENT_TICKET:
      return {
        ...state,
        ['currentTicket']: action.payload as ICurrentTicket,
      };
    default:
      return {
        ...state,
      };
  }
};
