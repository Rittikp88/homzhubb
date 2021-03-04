import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const translationKey = LocaleConstants.namespacesKey.serviceTickets;

export const initialQuotes = [
  {
    title: `${translationKey}:quote1`,
    price: '',
    document: '',
  },
  {
    title: `${translationKey}:quote2`,
    price: '',
    document: '',
  },
  {
    title: `${translationKey}:quote3`,
    price: '',
    document: '',
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
