import { theme } from '@homzhub/common/src/styles/theme';
import { images } from '@homzhub/common/src/assets/images';

export interface IAssetData {
  id: number;
  property_name: string;
  address: string;
  type: string;
  color: string;
  images: any;
  contacts: any;
}

export const TenanciesAssetData = [
  {
    id: 1,
    property_name: '2BHK - Godrej Prime',
    address: 'Sindhi Society, Chembur, Mumbai- 400071',
    type: 'OWNER',
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
    type: 'OWNER',
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
];

export const PortfolioAssetData = [
  {
    id: 1,
    property_name: '2BHK - Godrej Prime',
    address: 'Sindhi Society, Chembur, Mumbai- 400071',
    type: 'OWNER',
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
    type: 'FOR SALE',
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
    id: 5,
    property_name: '2BHK - Godrej Prime',
    address: 'Sindhi Society, Chembur, Mumbai- 400071',
    type: 'MAINTAIN',
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
