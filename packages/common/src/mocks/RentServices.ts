import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';

export const RentServicesData = [
  {
    id: 1,
    name: TypeOfPlan.FIND_TENANT,
    label: 'I want to find tenants',
    icon: 'home-search',
  },
  {
    id: 2,
    name: TypeOfPlan.SELL_PROPERTY,
    label: 'I want to sell my property',
    icon: 'home-calculus',
  },
  {
    id: 3,
    name: TypeOfPlan.TENANT_FOUND,
    label: 'I already have found a tenant',
    icon: 'home-person',
  },
];
