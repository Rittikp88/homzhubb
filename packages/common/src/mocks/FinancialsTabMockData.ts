import { images } from '@homzhub/common/src/assets/images';

export const cashFlowData = [
  {
    name: 'Income 2020',
    label: 'Income 2020',
    count: 300000,
    currency_symbol: 'USD',
    color_gradient: {
      angle: 180,
      location: [0, 1],
      hex_color_a: '#61D773',
      hex_color_b: '#94EF90',
    },
  },
  {
    name: 'Expense 2020',
    label: 'Expense 2020',
    count: 1000000,
    currency_symbol: 'USD',
    color_gradient: {
      angle: 180,
      location: [0, 1],
      hex_color_a: '#FDB113',
      hex_color_b: '#FFDB8F',
    },
  },
];

export const propertyDues = {
  details: [
    {
      propertyName: 'Eaton Garth Manor',
      address: 'Sindhi Society, Chembur, Mumbai- 400071',
      dueCategory: 'Plumbing fees',
      price: 20000,
      currency_symbol: 'USD',
    },
    {
      propertyName: 'Eaton Garth Manor',
      address: 'Sindhi Society, Chembur, Mumbai- 400071',
      dueCategory: 'Plumbing fees',
      price: 30000,
      currency_symbol: 'USD',
    },
    {
      propertyName: 'Eaton Garth Manor',
      address: 'Sindhi Society, Chembur, Mumbai- 400071',
      dueCategory: 'Plumbing fees',
      price: 20000,
      currency_symbol: 'USD',
    },
  ],
  totalDue: 70000,
  currency_symbol: 'USD',
};

export const countries = [
  { label: images.flag, value: 'India' },
  { label: images.flag, value: 'India' },
];

export const propertyFilters = [
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Annually', value: 'Annually' },
];
