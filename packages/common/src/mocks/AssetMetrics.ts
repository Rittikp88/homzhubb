import { theme } from '@homzhub/common/src/styles/theme';

export const AssetMetricsData = {
  user_service_plan: {
    id: 1,
    name: 'HOMZHUB_PRO',
    label: 'HomzHub PRO',
  },
  asset_metrics: {
    assets: {
      count: 10,
    },
    miscellaneous: [
      {
        name: 'OCCUPIED',
        label: 'Occupied',
        count: 3,
        colorGradient: {
          angle: 180,
          location: [0, 1],
          hexColorA: '#61D773',
          hexColorB: '#94EF90',
        },
      },
      {
        name: 'VACANT',
        label: 'Vacant',
        count: 2,
        colorGradient: {
          angle: 180,
          location: [0, 1],
          hexColorA: '#FDB113',
          hexColorB: '#FFDB8F',
        },
      },
      {
        name: 'RENEWAL',
        label: 'Renewal',
        count: 1,
        colorGradient: {
          angle: 180,
          location: [0, 1],
          hexColorA: '#D9AB65',
          hexColorB: '#ECCFB4',
        },
      },
      {
        name: 'SELL',
        label: 'Sell',
        count: 4,
        colorGradient: {
          angle: 180,
          location: [0, 1],
          hexColorA: '#FD8313',
          hexColorB: '#FFD2A9',
        },
      },
    ],
  },
  updates: {
    notifications: {
      count: 2,
    },
    tickets: {
      count: 3,
    },
    dues: {
      count: 2,
    },
  },
};

export const AssetSubscriptionPlanData = {
  user_service_plan: {
    id: 1,
    name: 'HOMZHUB_PRO',
    label: 'HomzHub Pro',
    service_bundle_items: [
      {
        id: 1,
        name: 'WEBSITE_LISTING',
        title: 'Website Listing',
        category: 'Professional Service',
        description: 'Lorem Ipsum Dummy Text.',
        position: 1,
        item_label: 'Valid for 30 days',
      },
      {
        id: 9,
        name: 'DIGITAL_ADVERTISEMENTS',
        title: 'Digital Advertisements',
        category: 'Professional Service',
        description: 'Lorem Ipsum Dummy Text.',
        position: 2,
        item_label: 'Option to boost',
      },
    ],
  },
  recommended_plan: {
    id: 2,
    name: 'HOMZHUB_ELITE',
    label: 'HomzHub Elite',
    service_bundle_items: [
      {
        id: 3,
        name: 'WEBSITE_LISTING',
        title: 'Website Listing',
        category: 'Professional Service',
        description: 'Lorem Ipsum Dummy Text.',
        position: 1,
        item_label: 'Valid for 30 days',
      },
      {
        id: 5,
        name: 'SOCIAL_MEDIA',
        title: 'Social Media',
        category: 'Professional Service',
        description: 'Lorem Ipsum Dummy Text.',
        position: 2,
        item_label: '',
      },
      {
        id: 8,
        name: 'EMAIL',
        title: 'Email',
        category: 'Professional Service',
        description: 'Lorem Ipsum Dummy Text.',
        position: 3,
        item_label: '',
      },
    ],
  },
};

export const MarketTrendsData = [
  {
    id: 1,
    header: 'How is the real estate market recovering?',
    date: '02/07/2020',
  },
  {
    id: 2,
    header: 'Highlights if COVID-19 Impact on the Housing Market',
    date: '03/07/2020',
  },
  {
    id: 3,
    header: 'Blast in Beirut in Lebanon',
    date: '04/07/2020',
  },
  {
    id: 4,
    header: 'Black Lives Matter',
    date: '05/07/2020',
  },
];

export const AssetAdvertisementData = [
  {
    id: 1,
    image_url: 'https://www.bookadsnow.com/images/mobile/Newspaper-banner_3.jpg',
  },
  {
    id: 2,
    image_url:
      'https://is1-3.housingcdn.com/4f2250e8/6ec86b0c4555a4f83e0ea77c552db2a0/v0/fs/vessella_meadows-narsingi-hyderabad-vessella_group.jpg',
  },
  {
    id: 3,
    image_url:
      'https://www.icicibank.com/managed-assets/images/blog/big/how-is-tax-on-sale-of-inherited-property-calculated.jpg',
  },
];

export const AssetPropertyTypeData = {
  user_service_plan: {
    id: 1,
    name: 'HOMZHUB_PRO',
    label: 'HomzHub PRO',
  },
  asset_metrics: {
    assets: {
      count: 10,
    },
    miscellaneous: [
      {
        name: 'Residential',
        label: 'Residential',
        count: 3,
        color_gradient: {
          angle: 180,
          location: [0, 1],
          hex_color_a: theme.colors.gradientK,
          hex_color_b: theme.colors.white,
        },
      },
      {
        name: 'Commercial',
        label: 'Commercial',
        count: 2,
        color_gradient: {
          angle: 180,
          location: [0, 1],
          hex_color_a: theme.colors.gradientK,
          hex_color_b: theme.colors.white,
        },
      },
      {
        name: 'Corporate',
        label: 'Corporate',
        count: 1,
        color_gradient: {
          angle: 180,
          location: [0, 1],
          hex_color_a: theme.colors.gradientK,
          hex_color_b: theme.colors.white,
        },
      },
    ],
  },
  updates: {
    notifications: {
      count: 2,
    },
    tickets: {
      count: 3,
    },
    dues: {
      count: 2,
    },
  },
};
