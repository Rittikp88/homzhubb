// Add all languages you wish to support here
export enum SupportedLanguages {
  English = 'en-US',
  Marathi = 'mr-IN',
}
const whitelist = Object.values(SupportedLanguages);

/**
 * Add translation files here, one per language
 * key must be from among the above enum `supportedLanguages`
 */
const resources = {
  [SupportedLanguages.English]: require('@homzhub/common/src/assets/languages/en.json'),
  [SupportedLanguages.Marathi]: require('@homzhub/common/src/assets/languages/mr.json'),
};

// Add namespaces here
enum namespacesKey {
  common = 'common',
  auth = 'auth',
  property = 'property',
  propertySearch = 'propertySearch',
  assetDescription = 'assetDescription',
  assetDashboard = 'assetDashboard',
  assetPortfolio = 'assetPortfolio',
  assetFinancial = 'assetFinancial',
  assetMore = 'assetMore',
  moreSettings = 'moreSettings',
  moreProfile = 'moreProfile',
}
const namespaces = Object.values(namespacesKey);
const defaultNamespace = namespacesKey.common;
const fallback = SupportedLanguages.English;

export const LocaleConstants = {
  whitelist,
  defaultNamespace,
  namespaces,
  fallback,
  resources,
  namespacesKey,
};
