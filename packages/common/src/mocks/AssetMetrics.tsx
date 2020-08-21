export const AssetMetricsData = {
  user_service_plan: {
    id: 1,
    name: 'HOMZHUB_PRO',
    label: 'HomzHub PRO',
  },
  asset_metrics: {
    assets: {
      count: 6,
    },
    miscellaneous: [
      {
        name: 'OCCUPIED',
        label: 'Occupied',
        count: 5,
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
        count: 5,
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
        count: 5,
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
        count: 5,
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
      count: 5,
    },
    tickets: {
      count: 5,
    },
    dues: {
      count: 5,
    },
  },
};

export const AssetSubscriptionPlanData = [
  {
    id: 1,
    name: 'Rental management',
  },
  {
    id: 2,
    name: 'Chat with tenants',
  },
  {
    id: 3,
    name: 'Manage Leads',
  },
  {
    id: 4,
    name: 'Tenant Onboarding and Offboarding checklist',
  },
  {
    id: 5,
    name: 'Rent Reciepts',
  },
  {
    id: 6,
    name: 'Lead reviews and ratings',
  },
  {
    id: 7,
    name: 'Client success manager',
  },
];

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

export const AssetPropertyTypeData = [
  {
    id: 1,
    header: 'Residential',
    value: 5,
  },
  {
    id: 2,
    header: 'Commercial',
    value: 3,
  },
  {
    id: 3,
    header: 'Corporate',
    value: 2,
  },
];
