import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Ticket } from '@homzhub/common/src/domain/models/Ticket';
import { IState } from '@homzhub/common/src/modules/interfaces';

const getProofAttachment = (state: IState): string[] => {
  const {
    ticket: { proofAttachment },
  } = state;
  return proofAttachment;
};

const getTickets = (state: IState): Ticket[] => {
  const {
    ticket: { tickets },
  } = state;
  return ObjectMapper.deserializeArray(Ticket, tickets);
};

export const TicketSelectors = { getProofAttachment, getTickets };
