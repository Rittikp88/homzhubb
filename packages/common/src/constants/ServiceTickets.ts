import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { IDocumentSource } from '@homzhub/common/src/services/AttachmentService/interfaces';

export enum TicketActionType {
  SUBMIT_QUOTE = 'QUOTES_READY',
  APPROVE_QUOTE = 'QUOTES_APPROVED',
  WORK_COMPLETED = 'CLOSED',
}

export enum ExperienceType {
  UNSATISFIED = 'Unsatisfied',
  NEUTRAL = 'Neutral',
  SATISFIED = 'Satisfied',
}

const translationKey = LocaleConstants.namespacesKey.serviceTickets;

export const TOTAL_IMAGES = 10;

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

export const initialExperienceData = [
  {
    icon: icons.sadFace,
    title: ExperienceType.UNSATISFIED,
    type: ExperienceType.UNSATISFIED,
    color: theme.colors.darkTint9,
  },
  {
    icon: icons.neutralFace,
    title: ExperienceType.NEUTRAL,
    type: ExperienceType.NEUTRAL,
    color: theme.colors.darkTint9,
  },
  {
    icon: icons.happyFace,
    title: ExperienceType.SATISFIED,
    type: ExperienceType.SATISFIED,
    color: theme.colors.darkTint9,
  },
];

export const ticketActions = [
  { label: 'Submit Quote', value: TicketActionType.SUBMIT_QUOTE },
  { label: 'Approve Quote', value: TicketActionType.APPROVE_QUOTE },
  { label: 'Work Completed', value: TicketActionType.WORK_COMPLETED },
];

export const sampleDetails = [
  {
    type: `${translationKey}:createdOn`,
    value: '22 Sep, 2020 - 20:20',
  },
  {
    type: `${translationKey}:updatedOn`,
    value: '23 Sep, 2020 - 20:20',
  },
  {
    type: `${translationKey}:ticketRaised`,
    value: 'Ticket Raised',
  },
  {
    type: `${translationKey}:assignedTo`,
    value: 'Homzhub',
  },
  {
    type: `${translationKey}:timeElapsed`,
    value: '7 Days',
  },
  {
    type: `${translationKey}:ticketNo`,
    value: '#1234567890',
  },
];

export const mockTicket = {
  date: '23, Nov 2020',
  title: 'Sample Ticket Title',
  activity: {
    stage1: {
      role: 'Owner',
      avatar:
        'https://hmzhbdev.s3.ap-south-1.amazonaws.com/asset_images/c1a1aac4-5108-11eb-8e84-0242ac110004IMG_0002.JPG',
      status: `${translationKey}:ticketRaised`,
      description: `${translationKey}:ticketRaisedDescription`,
      time: '11:00 AM',
      timeLine: [`${translationKey}:ticketRaisedToOwner`, `${translationKey}:awaitingOwnerAction`],
    },
  },
};

// TODO: (Shikha) - Remove after API integration
export const quotesPreview = [
  {
    id: 1,
    name: 'Painting',
    quote_submit_group: [
      {
        id: 1,
        user: {
          id: 1,
          first_name: 'Abhijeet',
          email: 'abhijeet.shah@nineleaps.com',
        },
        role: 'OWNER',
        comment: 'Some comment submit group',
        quotes: [
          {
            id: 1,
            quote_number: 1,
            total_amount: 1000,
            status: 'NEW|APPROVED',
            currency: {
              currency_name: 'Indian Rupee',
              currency_code: 'INR',
              currency_symbol: '₹',
            },
            attachment: {
              id: 355,
              file_name: '71cf4034-8b19-461d-9e96-3c001ad53a5d.jpg',
              link:
                'https://hmzhbdev.s3.ap-south-1.amazonaws.com/asset_images/e272a216-6090-11eb-909e-0242ac11000471cf4034-8b19-461d-9e96-3c001ad53a5d.jpg',
              mime_type: 'image/jpeg',
              media_type: 'IMAGE',
              media_attributes: {},
            },
          },
          {
            id: 2,
            quote_number: 2,
            total_amount: 1500,
            status: 'NEW|APPROVED',
            currency: {
              currency_name: 'Indian Rupee',
              currency_code: 'INR',
              currency_symbol: '₹',
            },
            attachment: {
              id: 356,
              file_name: '71cf4034-8b19-461d-9e96-3c001ad53a5d.jpg',
              link:
                'https://hmzhbdev.s3.ap-south-1.amazonaws.com/asset_images/e272a216-6090-11eb-909e-0242ac11000471cf4034-8b19-461d-9e96-3c001ad53a5d.jpg',
              mime_type: 'image/jpeg',
              media_type: 'IMAGE',
              media_attributes: {},
            },
          },
        ],
      },
      {
        id: 2,
        user: {
          id: 2,
          first_name: 'Hari',
          email: 'hari@nineleaps.com',
        },
        role: 'OWNER',
        comment: 'Some comment submit group',
        quotes: [
          {
            id: 3,
            quote_number: 1,
            total_amount: 1000,
            status: 'NEW|APPROVED',
            currency: {
              currency_name: 'Indian Rupee',
              currency_code: 'INR',
              currency_symbol: '₹',
            },
            attachment: {
              id: 355,
              file_name: '71cf4034-8b19-461d-9e96-3c001ad53a5d.jpg',
              link:
                'https://hmzhbdev.s3.ap-south-1.amazonaws.com/asset_images/e272a216-6090-11eb-909e-0242ac11000471cf4034-8b19-461d-9e96-3c001ad53a5d.jpg',
              mime_type: 'image/jpeg',
              media_type: 'IMAGE',
              media_attributes: {},
            },
          },
          {
            id: 4,
            quote_number: 2,
            total_amount: 1500,
            status: 'NEW|APPROVED',
            currency: {
              currency_name: 'Indian Rupee',
              currency_code: 'INR',
              currency_symbol: '₹',
            },
            attachment: {
              id: 356,
              file_name: '71cf4034-8b19-461d-9e96-3c001ad53a5d.jpg',
              link:
                'https://hmzhbdev.s3.ap-south-1.amazonaws.com/asset_images/e272a216-6090-11eb-909e-0242ac11000471cf4034-8b19-461d-9e96-3c001ad53a5d.jpg',
              mime_type: 'image/jpeg',
              media_type: 'IMAGE',
              media_attributes: {},
            },
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Carpentry',
    quote_submit_group: [
      {
        id: 3,
        user: {
          id: 1,
          first_name: 'Abhijeet',
          email: 'abhijeet.shah@nineleaps.com',
        },
        role: 'OWNER',
        comment: 'Some comment submit group',
        quotes: [
          {
            id: 5,
            quote_number: 1,
            total_amount: 1000,
            status: 'NEW|APPROVED',
            currency: {
              currency_name: 'Indian Rupee',
              currency_code: 'INR',
              currency_symbol: '₹',
            },
            attachment: {
              id: 355,
              file_name: '71cf4034-8b19-461d-9e96-3c001ad53a5d.jpg',
              link:
                'https://hmzhbdev.s3.ap-south-1.amazonaws.com/asset_images/e272a216-6090-11eb-909e-0242ac11000471cf4034-8b19-461d-9e96-3c001ad53a5d.jpg',
              mime_type: 'image/jpeg',
              media_type: 'IMAGE',
              media_attributes: {},
            },
          },
          {
            id: 6,
            quote_number: 2,
            total_amount: 1500,
            status: 'NEW|APPROVED',
            currency: {
              currency_name: 'Indian Rupee',
              currency_code: 'INR',
              currency_symbol: '₹',
            },
            attachment: {
              id: 356,
              file_name: '71cf4034-8b19-461d-9e96-3c001ad53a5d.jpg',
              link:
                'https://hmzhbdev.s3.ap-south-1.amazonaws.com/asset_images/e272a216-6090-11eb-909e-0242ac11000471cf4034-8b19-461d-9e96-3c001ad53a5d.jpg',
              mime_type: 'image/jpeg',
              media_type: 'IMAGE',
              media_attributes: {},
            },
          },
        ],
      },
      {
        id: 4,
        user: {
          id: 2,
          first_name: 'Hari',
          email: 'hari@nineleaps.com',
        },
        role: 'OWNER',
        comment: 'Some comment submit group',
        quotes: [
          {
            id: 7,
            quote_number: 1,
            total_amount: 1000,
            status: 'NEW|APPROVED',
            currency: {
              currency_name: 'Indian Rupee',
              currency_code: 'INR',
              currency_symbol: '₹',
            },
            attachment: {
              id: 355,
              file_name: '71cf4034-8b19-461d-9e96-3c001ad53a5d.jpg',
              link:
                'https://hmzhbdev.s3.ap-south-1.amazonaws.com/asset_images/e272a216-6090-11eb-909e-0242ac11000471cf4034-8b19-461d-9e96-3c001ad53a5d.jpg',
              mime_type: 'image/jpeg',
              media_type: 'IMAGE',
              media_attributes: {},
            },
          },
          {
            id: 8,
            quote_number: 2,
            total_amount: 1500,
            status: 'NEW|APPROVED',
            currency: {
              currency_name: 'Indian Rupee',
              currency_code: 'INR',
              currency_symbol: '₹',
            },
            attachment: {
              id: 356,
              file_name: '71cf4034-8b19-461d-9e96-3c001ad53a5d.jpg',
              link:
                'https://hmzhbdev.s3.ap-south-1.amazonaws.com/asset_images/e272a216-6090-11eb-909e-0242ac11000471cf4034-8b19-461d-9e96-3c001ad53a5d.jpg',
              mime_type: 'image/jpeg',
              media_type: 'IMAGE',
              media_attributes: {},
            },
          },
        ],
      },
    ],
  },
];

// TODO: (Naveen) - Remove after API integration
export const ticketList = [
  {
    id: 1,
    ticket_number: 'RB1234',
    ticket_category: {
      id: 1,
      name: 'Leakage',
      parent_ticket_category: {
        id: 1,
        name: 'Kitchen',
      },
    },
    title: 'My kitchen ceiling is leaking',
    description: 'Foobar JohnDoe',
    assigned_to: {
      id: 1,
      first_name: 'Foobar',
      last_name: 'JohnDoe',
      profile_link: 'https://link.com',
    },
    asset: {
      id: 1,
      project_name: '2BHK - 209, Mahindra Bloomdale, Nagpur',
    },
    status: 'OPEN',
    priority: 'HIGH',
    created_at: '2021-01-20T11:20:00Z',
    closed_at: '2021-01-20T11:20:00Z',
    updated_at: '2021-01-20T11:20:00Z',
  },
  {
    id: 1,
    ticket_number: 'RB1234',
    ticket_category: {
      id: 1,
      name: 'Leakage',
      parent_ticket_category: {
        id: 1,
        name: 'Kitchen',
      },
    },
    title: 'My kitchen ceiling is leaking',
    description: 'Foobar JohnDoe',
    assigned_to: {
      id: 1,
      first_name: 'Foobar',
      last_name: 'JohnDoe',
      profile_link: 'https://link.com',
    },
    closed_by: {
      id: 1,
      first_name: 'Foobar',
      last_name: 'JohnDoe',
      profile_link: 'https://link.com',
    },
    asset: {
      id: 1,
      project_name: '2BHK - 209, Mahindra Bloomdale, Nagpur',
    },
    status: 'CLOSED',
    priority: 'HIGH',
    created_at: '2021-01-20T11:20:00Z',
    closed_at: '2021-01-20T11:20:00Z',
    updated_at: '2021-01-20T11:20:00Z',
  },
];
