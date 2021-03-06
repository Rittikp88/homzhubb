import { IState } from '@homzhub/common/src/modules/interfaces';

const getProofAttachment = (state: IState): string[] => {
  const {
    ticket: { proofAttachment },
  } = state;
  return proofAttachment;
};

export const TicketSelectors = { getProofAttachment };
