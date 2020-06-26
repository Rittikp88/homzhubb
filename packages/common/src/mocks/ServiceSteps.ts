import { ServiceStepTypes } from '@homzhub/common/src/domain/models/Service';

export const ServiceSteps = [
  {
    id: 1,
    name: ServiceStepTypes.LEASE_DETAILS,
    title: 'Enter the Lease details',
  },
  {
    id: 2,
    name: ServiceStepTypes.PROPERTY_IMAGES,
    title: 'Add Property Images',
  },
  {
    id: 3,
    name: ServiceStepTypes.PROPERTY_VERIFICATIONS,
    title: 'Complete property verification',
  },
  {
    id: 4,
    name: ServiceStepTypes.PAYMENT_TOKEN_AMOUNT,
    title: 'Payment of token amount',
  },
];
