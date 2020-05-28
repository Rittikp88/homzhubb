import { colors } from './colors';

const formStyles = {
  placeholderColor: colors.disabled,
  formErrorColor: colors.error,
  formLabel: {
    marginTop: 16,
    marginBottom: 6,
    color: colors.darkTint3,
  },
  input: {
    fontSize: 14,
    height: 48,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.disabled,
    textAlign: 'left',
    borderRadius: 4,
    color: colors.dark,
  },
  inputPassword: {
    paddingEnd: 36,
  },
  inputPrefix: {
    paddingStart: 100,
  },
  formError: {
    textAlign: 'center',
    width: '100%',
    color: colors.error,
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 5,
  },
  fieldError: {
    borderColor: colors.error,
  },
  fieldFocus: {
    borderColor: colors.primaryColor,
  },
  iosDropdown: {
    height: 48,
    borderWidth: 1,
    paddingHorizontal: 16,
    borderColor: colors.disabled,
    borderRadius: 2,
    // textAlign: I18nService.select({rtl: 'right', ltr: 'left'}),
    backgroundColor: 'transparent',
    margin: 0,
  },
  androidDropdown: {
    height: 46,
    // textAlign: I18nService.select({rtl: 'right', ltr: 'left'}),
  },
};

export { formStyles as form };