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
        color_gradient: {
          angle: 180,
          location: [0, 1],
          hex_color_a: '#61D773',
          hex_color_b: '#94EF90',
        },
      },
      {
        name: 'VACANT',
        label: 'Vacant',
        count: 2,
        color_gradient: {
          angle: 180,
          location: [0, 1],
          hex_color_a: '#FDB113',
          hex_color_b: '#FFDB8F',
        },
      },
      {
        name: 'RENEWAL',
        label: 'Renewal',
        count: 1,
        color_gradient: {
          angle: 180,
          location: [0, 1],
          hex_color_a: '#D9AB65',
          hex_color_b: '#ECCFB4',
        },
      },
      {
        name: 'SELL',
        label: 'Sell',
        count: 4,
        color_gradient: {
          angle: 180,
          location: [0, 1],
          hex_color_a: '#FD8313',
          hex_color_b: '#FFD2A9',
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

export const MarketTrendsData = {
  count: 3,
  links: {
    next: 'http://dev.homzhub.com/api/v1/market-trends/?limit=2&offset=2',
    previous: null,
  },
  results: [
    {
      id: 1,
      title: 'Top 5 Real Estate Trends for 2020',
      link:
        'http://bwsmartcities.businessworld.in/article/Green-Homes-Still-Waiting-for-Green-Shoots-of-Revival/11-02-2020-183924',
      posted_at: '2020-07-01T04:03:07.256216Z',
    },
    {
      id: 2,
      title: '5 emerging trends that may reshape real estate sector in 2020',
      link:
        'https://www.financialexpress.com/money/5-emerging-trends-that-may-reshape-real-estate-sector-in-2020/1788394/',
      posted_at: '2020-07-01T04:03:07.256216Z',
    },
  ],
};

export const AssetAdvertisementData = {
  count: 1,
  links: {
    next: null,
    previous: null,
  },
  results: [
    {
      id: 1,
      link: 'https://www.google.com',
      attachment: {
        id: 14,
        file_name: 'DjangoBackendLLD (1).jpg',
        media_type: 'IMAGE',
        link: 'https://www.bookadsnow.com/images/mobile/Newspaper-banner_3.jpg',
        media_attributes: {},
      },
    },
    {
      id: 2,
      link: 'https://www.google.com',
      attachment: {
        id: 14,
        file_name: 'DjangoBackendLLD (1).jpg',
        media_type: 'IMAGE',
        link:
          'https://is1-3.housingcdn.com/4f2250e8/6ec86b0c4555a4f83e0ea77c552db2a0/v0/fs/vessella_meadows-narsingi-hyderabad-vessella_group.jpg',
        media_attributes: {},
      },
    },
    {
      id: 3,
      link: 'https://www.google.com',
      attachment: {
        id: 14,
        file_name: 'DjangoBackendLLD (1).jpg',
        media_type: 'IMAGE',
        link:
          'https://www.icicibank.com/managed-assets/images/blog/big/how-is-tax-on-sale-of-inherited-property-calculated.jpg',
        media_attributes: {},
      },
    },
  ],
};

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
