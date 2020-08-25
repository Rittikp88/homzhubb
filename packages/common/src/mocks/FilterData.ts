export const FilterData = {
  currency: [
    {
      currency_code: 'INR',
      currency_symbol: '₹',
    },
  ],
  asset_group_list: [
    {
      id: 1,
      name: 'RESIDENTIAL',
      title: 'Residential',
    },
    {
      id: 2,
      name: 'COMMERCIAL',
      title: 'Commercial',
    },
  ],
  filters: {
    asset_group: {
      id: 2,
      name: 'COMMERCIAL',
      asset_types: [
        {
          id: 7,
          name: 'Commercial Office Space',
        },
        {
          id: 8,
          name: 'Office in IT park/SEZ',
        },
        {
          id: 9,
          name: 'Commercial Showroom',
        },
        {
          id: 10,
          name: 'Warehouse / Godown',
        },
      ],
      space_types: [
        {
          id: 2,
          name: 'Bathroom',
        },
      ],
      title: 'Commercial',
    },
    transaction_type: [
      {
        title: 'Rent',
        label: 'RENT',
        min_price: 0,
        max_price: 5000000,
      },
      {
        title: 'Buy',
        label: 'BUY',
        min_price: 0,
        max_price: 1000000000,
      },
    ],
    carpet_area: [
      {
        carpet_area_unit: 'SQ_FT',
        min_area: 121.0,
        max_area: 12345.0,
      },
    ],
  },
};

export const SearchFilter = {
  search_latitude: 1,
  search_longitude: 1,
  asset_transaction_type: 1,
  asset_type: [1],
  min_price: 1,
  max_price: 1,
  min_area: 1,
  max_area: 1,
  area_unit: '',
  furnishing_status: '',
  room_count: [1],
  bath_count: 1,
  is_verified: false,
  asset_group: 1,
  search_address: '',
  limit: 1,
  offset: 1,
};