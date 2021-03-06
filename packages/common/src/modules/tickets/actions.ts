import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';

const actionTypePrefix = 'Ticket/';
export const TicketActionTypes = {
  SET: {
    PROOF_ATTACHMENT: `${actionTypePrefix}PROOF_ATTACHMENT`,
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

export type TicketActionPayloadTypes = string[] | string;

export const TicketActions = {
  setAttachment,
  removeAttachment,
  clearState,
};
