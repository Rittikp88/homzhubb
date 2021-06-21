import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
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
  SUBMIT_QUOTE = 'Submit Quotes',
  APPROVE_QUOTE = 'Approve Quotes',
  WORK_COMPLETED = 'Work Completed',
}

// ENUM END

const translationKey = LocaleConstants.namespacesKey.serviceTickets;

export const TOTAL_IMAGES = 10;

export const priorityColors = {
  LOW: theme.colors.lowPriority,
  MEDIUM: theme.colors.mediumPriority,
  HIGH: theme.colors.highPriority,
  ALL: theme.colors.informational,
};

export interface IInitialQuote {
  quoteNumber: number;
  title: string;
  price: string;
  document: IDocumentSource | null;
}

export const initialQuotes: IInitialQuote[] = [
  {
    quoteNumber: 1,
    title: `${translationKey}:quote1`,
    price: '',
    document: null,
  },
  {
    quoteNumber: 2,
    title: `${translationKey}:quote2`,
    price: '',
    document: null,
  },
  {
    quoteNumber: 3,
    title: `${translationKey}:quote3`,
    price: '',
    document: null,
  },
];

export interface IExperienceData {
  icon: string;
  title: ExperienceType;
  type: ExperienceType;
  color: string;
  rating: number;
}

export const initialExperienceData: IExperienceData[] = [
  {
    icon: icons.sadFace,
    title: ExperienceType.UNSATISFIED,
    type: ExperienceType.UNSATISFIED,
    color: theme.colors.darkTint9,
    rating: 1,
  },
  {
    icon: icons.neutralFace,
    title: ExperienceType.NEUTRAL,
    type: ExperienceType.NEUTRAL,
    color: theme.colors.darkTint9,
    rating: 3,
  },
  {
    icon: icons.happyFace,
    title: ExperienceType.SATISFIED,
    type: ExperienceType.SATISFIED,
    color: theme.colors.darkTint9,
    rating: 5,
  },
];
