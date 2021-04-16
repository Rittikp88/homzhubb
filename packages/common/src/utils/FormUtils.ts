/* eslint-disable @typescript-eslint/no-explicit-any */
export const DisallowedInputCharacters = {
  // eslint-disable-next-line no-useless-escape
  email: /[^A-Za-z0-9\s._+@\-]/g,
};

class FormUtils {
  public nameRegex = /^[a-zA-Z ]*$/;

  public digitRegex = /^[0-9]*[1-9][0-9]*$/;

  public decimalRegex = /^[0-9]+(\.\d+)?$/;

  public percentageRegex = /^(100(\.00?)?|[1-9]?\d(\.\d\d?)?)$/;

  public passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*?])[0-9a-zA-Z!@#$%^&*?]*$/;

  public emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

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

  public validateNonZeroCase = (value: string): boolean => {
    if (value.length) {
      if (Number(value) > 0) return Boolean(this.decimalRegex.exec(value)?.length);
    }
    return false;
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

  public isValuesTouched = (values: Record<any, string>, optionalFields?: string[]): boolean => {
    const updatedValue = { ...values };
    if (optionalFields) {
      optionalFields.forEach((field: string) => delete updatedValue[field]);
    }

    return Object.values(updatedValue).every((value) => !!value);
  };
}

const formUtils = new FormUtils();
export { formUtils as FormUtils };
