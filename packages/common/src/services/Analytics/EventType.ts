export enum EventType {
  SignupSuccess = 'successful_signup',
  SignupFailure = 'unsuccessful_signup',
  LoginSuccess = 'successful_login',
  LoginFailure = 'unsuccessful_login',
  AddPropertyInitiation = 'add_property_initiation',
  AddPropertySuccess = 'successfully_property_added',
  AddPropertyFailure = 'property_creation_unsuccessful',
  ContactOwner = 'contact_owner',
  SearchPropertyOpen = 'search_property_open',
  SearchSuccess = 'successful_search',
  SearchFailure = 'unsuccessful_search',
  ZeroSearchResult = 'zero_search_result',
  AddListingSuccess = 'successfully_listing_added',
  AddListingFailure = 'listing_creation_unsuccessful',
  VisitCreatedSuccess = 'successfully_visit_created',
  VisitCreatedFailure = 'visit_creation_unsuccessful',
  VisitRescheduleSuccess = 'successfully_reschedule_visit',
  VisitRescheduleFailure = 'reschedule_visit_unsuccessful',
  ClickSimilarProperty = 'click_similar_property',
  PropertyShare = 'property_share',
  Refer = 'refer',
  NewMessage = 'new_message',
  NewServiceTicket = 'new_service_ticket',
  ClosedServiceTicket = 'closed_service_ticket',
  NewOffer = 'new_offer',
  PropertyShortList = 'property_shortlist',
  VASPageVisits = 'vas_page_visit',
  ValueAddedType = 'value_added_buy',
  TenantInviteSent = 'tenant_invite_sent',
  TenantInviteAccepted = 'tenant_invite_accepted',
  TenantInviteResent = 'tenant_invite_resent',
  // Errors
  Exception = 'exception',
}
