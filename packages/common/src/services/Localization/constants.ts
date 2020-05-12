// Add all languages you wish to support here
export enum supportedLanguages {
  English = 'en',
}
const whitelist = Object.values(supportedLanguages);

/**
 * Add translation files here, one per language
 * key must be from among the above enum `supportedLanguages`
 */
const resources = {
  en: require('@homzhub/common/src/assets/languages/en.json'),
};

// Add namespaces here
enum namespacesKey {
  common = 'common',
}
const namespaces = Object.values(namespacesKey);
const defaultNamespace = namespacesKey.common;

const fallback = 'en';

export const LocaleConstants = {
  whitelist,
  defaultNamespace,
  namespaces,
  fallback,
  resources,
};
