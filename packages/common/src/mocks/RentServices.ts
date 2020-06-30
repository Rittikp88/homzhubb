import { TypeOfSale } from '@homzhub/common/src/domain/models/Property';

export const RentServicesData = [
  {
    id: 1,
    name: TypeOfSale.FIND_TENANT,
    label: 'I want to find tenants',
    icon: 'home-search',
  },
  {
    id: 2,
    name: TypeOfSale.SELL_PROPERTY,
    label: 'I want to sell my property',
    icon: 'home-calculus',
  },
  {
    id: 3,
    name: TypeOfSale.TENANT_FOUND,
    label: 'I already have found a tenant',
    icon: 'home-person',
  },
];
