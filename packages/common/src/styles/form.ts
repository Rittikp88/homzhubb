import { colors } from './colors';

const formStyles = {
  placeholderColor: colors.disabled,
  formErrorColor: colors.error,
  formLabel: {
    marginBottom: 6,
  },
  input: {
    fontSize: 14,
    height: 48,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.disabled,
    textAlign: 'left',
    borderRadius: 2,
    color: colors.dark,
  },
  inputText: {
    fontSize: 14,
    height: 48,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.blue,
    textAlign: 'left',
    borderRadius: 2,
    color: colors.dark,
  },
  inputPassword: {
    paddingEnd: 36,
  },
  inputPrefix: {
    paddingStart: 72,
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
};

export { formStyles as form };
