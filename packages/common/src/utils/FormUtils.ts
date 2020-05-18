/* eslint-disable @typescript-eslint/no-explicit-any */
export const DisallowedInputCharacters = {
  // eslint-disable-next-line no-useless-escape
  email: /[^A-Za-z0-9\s._+@\-]/g,
};

class FormUtils {
  public nameRegex = /^[a-zA-Z]*$/;

  public passwordRegex = /^(?=.*\d).[a-zA-Z0-9]*$/;

  public validate = (getValidationSchema: any): any => {
    return (values: any[]): any => {
      const validationSchema = getValidationSchema(values);
      try {
        validationSchema.validateSync(values, { abortEarly: false });
        return {};
      } catch (error) {
        return this.getErrorsFromValidationError(error);
      }
    };
  };

  public getErrorsFromValidationError = (validationError: any): any => {
    return validationError.inner.reduce((errors: any[], error: any) => {
      let errorMessage = '';
      if (error.errors && error.errors.length > 0) {
        // eslint-disable-next-line prefer-destructuring
        errorMessage = error.errors[0];
      }
      return {
        ...errors,
        [error.path]: errorMessage,
      };
    }, {});
  };
}

const formUtils = new FormUtils();
export { formUtils as FormUtils };
