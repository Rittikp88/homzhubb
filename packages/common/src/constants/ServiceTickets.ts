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
  TICKET_RAISED = 'Ticket Raised',
  QUOTE_REQUESTED = 'Quotes Requested',
  QUOTE_SUBMITTED = 'Quotes Submitted',
  QUOTE_APPROVED = 'Quotes Approved',
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
    type: `${translationKey}:status`,
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

// TODO: (Praharsh) - API contract (Remove after API integration)
export const mockTicketContract = {
  id: 1,
  title: 'My Kitchen ceiling',
  description: 'Description',
  ticket_number: 'HOM-202103101-10000',
  ticket_category: 0,
  category: {
    id: 2,
    name: 'Renovation and Rectification',
  },
  sub_category: {
    id: 14,
    name: 'Others',
  },
  others_field_description: '',
  priority: 'LOW', // "LOW|MEDIUM|HIGH"
  status: 'OPEN', // "OPEN|QUOTES_READY|QUOTES_ACCEPTED|CLOSED"
  asset: {
    id: 1,
    project_name: 'Prestige',
  },
  lease_transaction: null,
  assigned_to: {
    id: 1,
    full_name: 'Abhijeet Anand ****',
    first_name: 'Abhijeet Anand',
    last_name: '****',
    profile_picture: 'https://homzhub-bucket.s3.amazonaws.com/assest_documents/selfie_id.jpeg',
    rating: 4,
  },
  raised_by: {
    id: 3,
    full_name: 'Anuvrat ****',
    first_name: 'Anuvrat',
    last_name: '****',
    profile_picture: 'https://homzhub-bucket.s3.amazonaws.com/assest_documents/selfie_id.jpeg',
    rating: 4,
  },
  created_at: '2021-02-22 05:30:00',
  updated_at: '2021-02-22 05:30:00',
  ticket_attachments: [
    {
      id: 355,
      file_name: '71cf4034-8b19-461d-9e96-3c001ad53a5d.jpg',
      link:
        'https://hmzhbdev.s3.ap-south-1.amazonaws.com/asset_images/e272a216-6090-11eb-909e-0242ac11000471cf4034-8b19-461d-9e96-3c001ad53a5d.jpg',
      mime_type: 'image/jpeg',
      media_type: 'IMAGE',
      media_attributes: {},
    },
    {
      id: 355,
      file_name: '71cf4034-8b19-461d-9e96-3c001ad53a5d.jpg',
      link:
        'https://hmzhbdev.s3.ap-south-1.amazonaws.com/asset_images/e272a216-6090-11eb-909e-0242ac11000471cf4034-8b19-461d-9e96-3c001ad53a5d.jpg',
      mime_type: 'image/jpeg',
      media_type: 'IMAGE',
      media_attributes: {},
    },
  ],
  activities: [
    {
      id: 1,
      activity_type: {
        id: 67,
        order: 1,
        label: 'Ticket Raised',
        code: 'TICKET_RAISED',
      },
      created_at: '2021-02-22 05:30:00',
      updated_at: '2021-02-22 05:30:00',
      user: {
        id: 3,
        full_name: 'Anuvrat ****',
        first_name: 'Anuvrat',
        last_name: '****',
        profile_picture: 'https://homzhub-bucket.s3.amazonaws.com/assest_documents/selfie_id.jpeg',
        rating: 4,
      },
      role: 'TENANT',
      comment: 'Some comment',
      data: {
        assigned_to: {
          id: 1,
          full_name: 'Abhijeet Anand ****',
          first_name: 'Abhijeet Anand',
          last_name: '****',
          profile_picture: 'https://homzhub-bucket.s3.amazonaws.com/assest_documents/selfie_id.jpeg',
          rating: 4,
        },
      },
    },
    {
      id: 2,
      activity_type: {
        id: 67,
        order: 1,
        label: 'Quotes Submitted',
        code: 'QUOTES_SUBMITTED',
      },
      created_at: '2021-02-22 05:30:00',
      updated_at: '2021-02-22 05:30:00',
      user: {
        id: 2,
        full_name: 'Hari ****',
        first_name: 'Hari',
        last_name: '****',
        profile_picture: 'https://homzhub-bucket.s3.amazonaws.com/assest_documents/selfie_id.jpeg',
        rating: 4,
      },
      role: 'OWNER',
      comment: 'Some comment submit group',
      data: {
        quote_request_category: [
          {
            id: 1,
            name: 'Painting',
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
            name: 'Sepage',
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
    },
    {
      id: 3,
      activity_type: {
        id: 67,
        order: 1,
        label: 'Quotes Approved',
        code: 'QUOTES_APPROVED',
      },
      created_at: '2021-02-22 05:30:00',
      updated_at: '2021-02-22 05:30:00',
      user: {
        id: 1,
        full_name: 'Abhijeet Anand ****',
        first_name: 'Abhijeet Anand',
        last_name: '****',
        profile_picture: 'https://homzhub-bucket.s3.amazonaws.com/assest_documents/selfie_id.jpeg',
        rating: 4,
      },
      role: 'OWNER',
      comment: 'Some comment aprroved group',
      data: {
        quotes: [
          {
            id: 5,
            quote_number: 1,
            total_amount: 1000,
            status: 'NEW|APPROVED',
            quote_request_category: {
              id: 1,
              name: 'Painting',
            },
            quote_submit_group: {
              id: 1,
              user: {
                id: 5,
                full_name: 'Brooklyn ****',
                first_name: 'Brooklyn',
                last_name: '****',
                profile_picture: 'https://homzhub-bucket.s3.amazonaws.com/assest_documents/selfie_id.jpeg',
                rating: 4,
              },
            },
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
            quote_number: 1,
            total_amount: 1000,
            status: 'NEW|APPROVED',
            quote_request_category: {
              id: 1,
              name: 'Sepage',
            },
            quote_submit_group: {
              id: 1,
              user: {
                id: 5,
                full_name: 'Brooklyn ****',
                first_name: 'Brooklyn',
                last_name: '****',
                profile_picture: 'https://homzhub-bucket.s3.amazonaws.com/assest_documents/selfie_id.jpeg',
                rating: 4,
              },
            },
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
        ],
      },
    },
    {
      id: 5,
      activity_type: {
        id: 67,
        order: 1,
        label: 'Work Completed',
        code: 'WORK_COMPLETED',
      },
      created_at: '2021-02-22 05:30:00',
      updated_at: '2021-02-22 05:30:00',
      user: {
        id: 1,
        full_name: 'Abhijeet Anand ****',
        first_name: 'Abhijeet Anand',
        last_name: '****',
        profile_picture: 'https://homzhub-bucket.s3.amazonaws.com/assest_documents/selfie_id.jpeg',
        rating: 4,
      },
      role: 'OWNER',
      comment: 'Some comment',
      data: {
        attachments: [
          {
            id: 355,
            file_name: '71cf4034-8b19-461d-9e96-3c001ad53a5d.jpg',
            link:
              'https://hmzhbdev.s3.ap-south-1.amazonaws.com/asset_images/e272a216-6090-11eb-909e-0242ac11000471cf4034-8b19-461d-9e96-3c001ad53a5d.jpg',
            mime_type: 'image/jpeg',
            media_type: 'IMAGE',
            media_attributes: {},
          },
          {
            id: 356,
            file_name: '71cf4034-8b19-461d-9e96-3c001ad53a5d.jpg',
            link:
              'https://hmzhbdev.s3.ap-south-1.amazonaws.com/asset_images/e272a216-6090-11eb-909e-0242ac11000471cf4034-8b19-461d-9e96-3c001ad53a5d.jpg',
            mime_type: 'image/jpeg',
            media_type: 'IMAGE',
            media_attributes: {},
          },
        ],
      },
    },
  ],
};
