// Enums related to dynamic linking - starts

export enum DynamicLinkTypes {
  AssetDescription = 'AssetDescription',
  ResetPassword = 'RESET_PASSWORD',
  PrimaryEmailVerification = 'PRIMARY_EMAIL_VERIFICATION',
  WorkEmailVerification = 'WORK_EMAIL_VERIFICATION',
}

export enum RouteTypes {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}

export enum DynamicLinkParamKeys {
  Type = 'type',
  RouteType = 'routeType',
  VerificationId = 'verificationId',
  PropertyTermId = 'propertyTermId',
}

// Enums related to dynamic linking - ends
