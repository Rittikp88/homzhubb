import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Ticket } from '@homzhub/common/src/domain/models/Ticket';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { ICurrentTicket } from '@homzhub/common/src/modules/tickets/interface';

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

const getCurrentTicket = (state: IState): ICurrentTicket | null => {
  const {
    ticket: { currentTicket },
  } = state;
  return currentTicket;
};

const getTicketDetail = (state: IState): Ticket | null => {
  const {
    ticket: { ticketDetail },
  } = state;
  return ObjectMapper.deserialize(Ticket, ticketDetail);
};

const getTicketLoader = (state: IState): boolean => {
  const {
    ticket: { loaders },
  } = state;
  return loaders.tickets;
};

const getTicketDetailLoader = (state: IState): boolean => {
  const {
    ticket: { loaders },
  } = state;
  return loaders.ticketDetail;
};

export const TicketSelectors = {
  getProofAttachment,
  getTickets,
  getCurrentTicket,
  getTicketDetail,
  getTicketLoader,
  getTicketDetailLoader,
};
