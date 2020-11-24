import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { FormikProps } from 'formik';
import { Counter } from '@homzhub/common/src/components/atoms/Counter';

interface IOwnProps {
  name: string;
  label: string;
  formProps: FormikProps<any>;
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
    <Counter
      {...counterProps}
      defaultValue={values[name]}
      name={{ title: label, titleStyle: styles.textStyle }}
      onValueChange={onValueChange}
    />
  );
};

const styles = StyleSheet.create({
  textStyle: {
    marginLeft: 0,
  },
});
