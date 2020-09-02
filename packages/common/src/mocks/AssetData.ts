import { theme } from '@homzhub/common/src/styles/theme';
import { images } from '@homzhub/common/src/assets/images';

export interface IAssetData {
  id: number;
  property_name: string;
  address: string;
  type: string;
  color: string;
  images: any;
  contacts?: any;
  isPropertyCompleted: boolean;
}

export const TenanciesAssetData = [
  {
    id: 5,
    project_name: 'House 2',
    unit_number: '103',
    block_number: 'B',
    latitude: 25.6207722,
    longitude: 85.1280892,
    carpet_area: 2500.0,
    carpet_area_unit: 'SQ_FT',
    floor_number: 2,
    total_floors: 3,
    asset_type: {
      id: 5,
      name: 'Studio Apartment',
    },
    spaces: [
      {
        id: 1,
        name: 'Bedroom',
        count: 2,
      },
      {
        id: 2,
        name: 'Bathroom',
        count: 1,
      },
    ],
    asset_group: {
      id: 1,
      name: 'Residential',
    },
    digital_id: '8fad8389-6893-411a-bd4a-4b1575523d4a',
    construction_year: null,
    is_gated: null,
    description: '',
    furnishing: 'SEMI',
    attachments: [
      {
        file_name: 'prof.jpg',
        is_cover_image: true,
        link: 'https://homzhub-bucket.s3.amazonaws.com/asset_images/8e8c48fc-c089-11ea-8247-34e12d38d70eprof.jpg',
        media_type: 'IMAGE',
        media_attributes: {},
      },
    ],
    verification_documents: [],
    verifications: {
      verification_status: 2,
      description:
        '**What is this verification?**\nSed ut perspiciatis unde omnis iste natus error sit voluptatem\naccusantium doloremque laudantium.\n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur\naut odit aut fugit. Neque porro quisquam est,\nqui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,\nsed quia non numquam eius modi tempora incidunt ut labore et dolore\nmagnam aliquam quaerat voluptatem.',
    },
    progress_percentage: 74.0,
    notifications: {
      count: 5,
    },
    serviceTickets: {
      count: 0,
    },
    assetStatusInfo: {
      tag: {},
      leaseTransaction: {},
      leaseTenantInfo: {},
    },
  },
];

export const PortfolioAssetData = [
  {
    id: 1,
    property_name: '2BHK - Godrej Prime',
    address: 'Sindhi Society, Chembur, Mumbai- 400071',
    type: 'OWNER',
    isPropertyCompleted: true,
    color: '#CE9B6C',
    images: [
      {
        file_name: 'House-1b',
        is_cover_image: false,
        link: images.property,
      },
    ],
    contacts: {
      id: 1,
      full_name: 'Anuvrat Somnath',
      email: 'anuvrat.somnath@nineleaps.com',
      country_code: '+91',
      phone_number: '7903470293',
    },
  },
  {
    id: 2,
    property_name: '2BHK - Godrej Prime',
    address: 'Sindhi Society, Chembur, Mumbai- 400071',
    type: 'RENTED',
    isPropertyCompleted: true,
    color: theme.colors.gradientE,
    images: [
      {
        file_name: 'House-1b',
        is_cover_image: false,
        link: images.property,
      },
    ],
    contacts: {
      id: 1,
      full_name: 'Anuvrat Somnath',
      email: 'anuvrat.somnath@nineleaps.com',
      country_code: '+91',
      phone_number: '7903470293',
    },
  },
  {
    id: 3,
    property_name: '2BHK - Godrej Prime',
    address: 'Sindhi Society, Chembur, Mumbai- 400071',
    type: 'VACANT',
    isPropertyCompleted: true,
    color: theme.colors.highPriority,
    images: [
      {
        file_name: 'House-1b',
        is_cover_image: false,
        link: images.property,
      },
    ],
    contacts: {
      id: 1,
      full_name: 'Anuvrat Somnath',
      email: 'anuvrat.somnath@nineleaps.com',
      country_code: '+91',
      phone_number: '7903470293',
    },
  },
  {
    id: 4,
    property_name: '2BHK - Godrej Prime',
    address: 'Sindhi Society, Chembur, Mumbai- 400071',
    type: 'VACANT',
    isPropertyCompleted: false,
    color: theme.colors.highPriority,
    images: [
      {
        file_name: 'House-1b',
        is_cover_image: false,
        link: images.property,
      },
    ],
  },
  {
    id: 5,
    property_name: '2BHK - Godrej Prime',
    address: 'Sindhi Society, Chembur, Mumbai- 400071',
    type: 'FOR SALE',
    isPropertyCompleted: true,
    color: theme.colors.mediumPriority,
    images: [
      {
        file_name: 'House-1b',
        is_cover_image: false,
        link: images.property,
      },
    ],
    contacts: {
      id: 1,
      full_name: 'Anuvrat Somnath',
      email: 'anuvrat.somnath@nineleaps.com',
      country_code: '+91',
      phone_number: '7903470293',
    },
  },
  {
    id: 6,
    property_name: '2BHK - Godrej Prime',
    address: 'Sindhi Society, Chembur, Mumbai- 400071',
    type: 'MAINTAIN',
    isPropertyCompleted: true,
    color: theme.colors.informational,
    images: [
      {
        file_name: 'House-1b',
        is_cover_image: false,
        link: images.property,
      },
    ],
    contacts: {
      id: 1,
      full_name: 'Anuvrat Somnath',
      email: 'anuvrat.somnath@nineleaps.com',
      country_code: '+91',
      phone_number: '7903470293',
    },
  },
];

export const AssetFilter = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Rented',
    value: 'rented',
  },
  {
    label: 'Vacant',
    value: 'vacant',
  },
  {
    label: 'For Sale',
    value: 'sale',
  },
  {
    label: 'Maintain',
    value: 'maintain',
  },
];

export const DocumentsData = [
  {
    id: 1,
    name: 'Quarterly Inspection Report',
    uploaded_on: '02/07/2020',
    uploaded_by: 'HomzHub',
  },
  {
    id: 2,
    name: 'Rent',
    uploaded_on: '02/07/2020',
    uploaded_by: 'HomzHub',
  },
  {
    id: 3,
    name: 'Electricity bill',
    uploaded_on: '02/07/2020',
    uploaded_by: 'HomzHub',
  },
  {
    id: 4,
    name: 'Water charges',
    uploaded_on: '02/07/2020',
    uploaded_by: 'HomzHub',
  },
  {
    id: 5,
    name: 'Maintenance Charges',
    uploaded_on: '02/07/2020',
    uploaded_by: 'HomzHub',
  },
];
