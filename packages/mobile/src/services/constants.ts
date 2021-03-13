// Enums related to dynamic linking - starts

export enum DynamicLinkTypes {
  AssetDescription = 'ASSET_DESCRIPTION',
  ResetPassword = 'RESET_PASSWORD',
  PrimaryEmailVerification = 'PRIMARY_EMAIL_VERIFICATION',
  WorkEmailVerification = 'WORK_EMAIL_VERIFICATION',
  Referral = 'REFERRAL',
  PropertyVisitReview = 'PROPERTY_VISIT_REVIEW',
  TenantInvitation = 'TENANT_INVITATION',
  ServiceTicket = 'SERVICE_TICKET',
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
  ReferralCode = 'referralCode',
  VisitId = 'visitId',
  InviteId = 'inviteId',
  TicketId = 'ticketId',
}

// Enums related to dynamic linking - ends

export enum NotificationTypes {
  Chat = 'CHAT',
  ServiceTicket = 'SERVICE_TICKET',
}
