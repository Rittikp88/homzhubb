import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { FormikProps, FormikValues } from 'formik';
import { Counter } from '@homzhub/common/src/components/atoms/Counter';

interface IOwnProps {
  name: string;
  label: string;
  formProps: FormikProps<FormikValues>;
  onChange?: (count: number, id?: number) => void;
  maxCount?: number;
  minCount?: number;
  containerStyles?: StyleProp<ViewStyle>;
  testID?: string;
}

export const FormCounter = (props: IOwnProps): React.ReactElement => {
  const {
    formProps: { setFieldValue, values },
    name,
    label,
    onChange,
    ...counterProps
  } = props;

  const onValueChange = (count: number, id?: number): void => {
    setFieldValue(name, count);

    if (onChange) {
      onChange(count, id);
    }
  };

  return (
    <Counter {...counterProps} defaultValue={values[name]} name={{ title: label }} onValueChange={onValueChange} />
  );
};
