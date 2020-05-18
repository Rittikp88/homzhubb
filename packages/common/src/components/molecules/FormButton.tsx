import React from 'react';
import { FormikProps, FormikValues } from 'formik';
import { Button, IButtonProps } from '@homzhub/common/src/components/atoms/Button';

export interface IFormButtonProps extends IButtonProps {
  isSubmitting?: boolean;
  formProps: FormikProps<FormikValues>;
}

export const FormButton = (props: IFormButtonProps): React.ReactElement => {
  const { isSubmitting = false, formProps, containerStyle, ...buttonProps } = props;
  const isDisabled: boolean = formProps ? !(formProps.isValid && formProps.dirty) : isSubmitting;

  return <Button disabled={isDisabled} {...buttonProps} containerStyle={containerStyle} />;
};
