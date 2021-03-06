import { ReducerUtils } from '@homzhub/common/src/utils/ReducerUtils';
import { TicketActionPayloadTypes, TicketActionTypes } from '@homzhub/common/src//modules/tickets/actions';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';

export const initialTicketState: ITicketState = {
  proofAttachment: [],
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
    default:
      return {
        ...state,
      };
  }
};
