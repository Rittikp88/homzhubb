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
}