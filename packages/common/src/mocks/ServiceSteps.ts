enum ServiceStepTypes {
  LEASE_DETAILS = 'LEASE_DETAILS',
  PROPERTY_IMAGES = 'PROPERTY_IMAGES',
  PROPERTY_VERIFICATIONS = 'PROPERTY_VERIFICATIONS',
  PAYMENT_TOKEN_AMOUNT = 'PAYMENT_TOKEN_AMOUNT',
}
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
