import { theme } from '@homzhub/common/src/styles/theme';
import { IDocumentSource } from '@homzhub/common/src/services/AttachmentService/interfaces';

// ENUM START
export enum ExperienceType {
  UNSATISFIED = 'Unsatisfied',
  NEUTRAL = 'Neutral',
  SATISFIED = 'Satisfied',
}

export enum TicketStatusTitle {
  OPEN = 'Open',
  REQUEST_RAISED = 'Request Raised',
  // Remove once BE removes this key
  TICKET_RAISED = 'Ticket Raised',
  QUOTE_REQUESTED = 'Quote Requested',
  QUOTE_SUBMITTED = 'Quote Submitted',
  QUOTE_APPROVED = 'Quote Approved',
  WORK_INITIATED = 'Work Initiated',
  PAYMENT_REQUESTED = 'Payment Requested',
  PAYMENT_DONE = 'Payment Done',
  WORK_COMPLETED = 'Work Completed',
  CLOSED = 'Closed',
}

export enum TakeActionTitle {
  REASSIGN_TICKET = 'Reassign Request',
  REJECT_TICKET = 'Reject Request',
  SUBMIT_QUOTE = 'Submit Quotes',
  REMIND_TO_APPROVE_AND_PAY = 'Remind to Approve and Pay',
  APPROVE_QUOTE = 'Approve Quotes',
  WORK_INITIATED = 'Work Initiated',
  WORK_COMPLETED = 'Work Completed',
  REQUEST_QUOTE = 'Request Quote',
  UPDATE_STATUS = 'Update Status',
  QUOTE_PAYMENT = 'Quote Payment',
}

// ENUM END

export const TOTAL_IMAGES = 10;

export const priorityColors = {
  LOW: theme.colors.lowPriority,
  MEDIUM: theme.colors.mediumPriority,
  HIGH: theme.colors.highPriority,
  ALL: theme.colors.informational,
};

export interface IQuoteGroup {
  groupId: number;
  groupName: string;
  data: IInitialQuote[];
}

export interface IInitialQuote {
  quoteNumber: number;
  title: string;
  price: string;
  document: IDocumentSource | null;
}
