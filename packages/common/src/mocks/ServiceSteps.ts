import { ServiceStepTypes } from '@homzhub/common/src/domain/models/Service';

export const ServiceSteps = {
  PROPERTY_VERIFICATIONS: false,
  PAYMENT_TOKEN_AMOUNT: false,
  steps: [
    {
      id: 1,
      name: ServiceStepTypes.LEASE_DETAILS,
      title: 'Enter the Lease details',
      label: 'Label 1',
    },
    {
      id: 3,
      name: ServiceStepTypes.PROPERTY_VERIFICATIONS,
      title: 'Complete property verification',
      label: 'Label 3',
    },
    {
      id: 4,
      name: ServiceStepTypes.PAYMENT_TOKEN_AMOUNT,
      title: 'Payment of token amount',
      label: 'Label 4',
    },
  ],
};

export const ServiceStepsWithVerification = {
  PROPERTY_VERIFICATIONS: true,
  PAYMENT_TOKEN_AMOUNT: true,
  steps: [
    {
      id: 1,
      name: ServiceStepTypes.LEASE_DETAILS,
      title: 'Enter the Lease details',
      label: 'Label 1',
    },
    {
      id: 3,
      name: ServiceStepTypes.PROPERTY_VERIFICATIONS,
      title: 'Complete property verification',
      label: 'Label 3',
    },
    {
      id: 4,
      name: ServiceStepTypes.PAYMENT_TOKEN_AMOUNT,
      title: 'Payment of token amount',
      label: 'Label 4',
    },
  ],
};
