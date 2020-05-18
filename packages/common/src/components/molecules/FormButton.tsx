import React from 'react';
import { FormikProps, FormikValues } from 'formik';
import { Button, IButtonProps } from '@homzhub/common/src/components/atoms/Button';

export interface IFormButtonProps extends IButtonProps {
  isSubmitting?: boolean;
  formProps: FormikProps<FormikValues>;
}

export const FormButton = (props: IFormButtonProps): React.ReactElement => {
  const { isSubmitting = false, containerStyle, ...buttonProps } = props;

  return <Button disabled={isSubmitting} {...buttonProps} containerStyle={containerStyle} />;
};
