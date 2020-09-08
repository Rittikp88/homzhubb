export const AdvancedFilters = {
  searchRadius: [
    {
      value: 1,
      label: 'This area only',
    },
    {
      value: 2,
      label: 'Within 5 km',
    },
    {
      value: 3,
      label: 'Within 0.25 km',
    },
    {
      value: 4,
      label: 'Within 10 km',
    },
    {
      value: 5,
      label: 'Within 0.5 km',
    },
    {
      value: 6,
      label: 'Within 20 km',
    },
    {
      value: 7,
      label: 'Within 1 km',
    },
    {
      value: 8,
      label: 'Within 30 km',
    },
    {
      value: 9,
      label: 'Within 3 km',
    },
    {
      value: 10,
      label: 'Within 40 km',
    },
  ],
  dateAdded: [
    {
      value: 1,
      label: 'Anytime',
    },
    {
      value: 2,
      label: 'Last 3 days',
    },
    {
      value: 3,
      label: 'Last 14 days',
    },
    {
      value: 4,
      label: 'Last 24 hours',
    },
    {
      value: 5,
      label: 'Last 7 days',
    },
    {
      value: 6,
      label: 'Last 28 days',
    },
  ],
  propertyAge: [
    {
      value: 1,
      label: 'Less than 1 year',
    },
    {
      value: 2,
      label: 'Less than 5 years',
    },
    {
      value: 3,
      label: 'Less than 10 years',
    },
    {
      value: 4,
      label: 'Less than 15 years',
    },
    {
      value: 5,
      label: 'Less than 20 years',
    },
    {
      value: 6,
      label: 'More than 20 years',
    },
  ],
  rentFreePeriod: [
    {
      value: 1,
      label: 'At least 15 days',
    },
    {
      value: 2,
      label: 'At least 30 days',
    },
    {
      value: 3,
      label: 'At least 45 days',
    },
    {
      value: 4,
      label: 'at least 60 days',
    },
    {
      value: -1,
      label: 'Any period',
    },
  ],
  furnishing: [
    {
      value: 1,
      label: 'Television',
    },
    {
      value: 2,
      label: 'Iron',
    },
    {
      value: 3,
      label: 'Washing Machine',
    },
    {
      value: 4,
      label: 'Geysers',
    },
    {
      value: 5,
      label: 'Microwave',
    },
    {
      value: 6,
      label: 'Modular Kitchen',
    },
    {
      value: 7,
      label: 'Beds',
    },
    {
      value: 8,
      label: 'Air-Purifier',
    },
    {
      value: 9,
      label: 'Mattress',
    },
    {
      value: 10,
      label: 'Air Conditioner',
    },
  ],
};

export interface IFilterData {
  value: number;
  label: string;
}

export interface IAdvancedFilters {
  searchRadius: IFilterData[];
  dateAdded: IFilterData[];
  propertyAge: IFilterData[];
  rentFreePeriod: IFilterData[];
  furnishing: IFilterData[];
}
