// @ts-nocheck
import React from 'react';
import renderer from 'react-test-renderer';
import { FormTextInput, IFormTextInputProps } from '@homzhub/common/src/components/molecules/FormTextInput';

describe('Test cases for FormTextInput', () => {
  const formValues = {
    values: {
      name: 'test',
    },
    touched: {
      name: 'test',
    },
  };

  const mockFunction = jest.fn();

  const testProps = (Props: IFormTextInputProps): IFormTextInputProps => ({
    ...Props,
    name: 'test',
    children: null,
    formProps: formValues,
    onValueChange: mockFunction,
  });

  let props: IFormTextInputProps;
  it('should render snapshot', () => {
    props = testProps({});
    const tree = renderer.create(<FormTextInput {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render snapshot when input type is email', () => {
    props = testProps({
      inputType: 'email',
    });

    const tree = renderer.create(<FormTextInput {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render snapshot when input type is phone', () => {
    props = testProps({
      inputType: 'phone',
      inputPrefixText: '+91',
    });

    const tree = renderer.create(<FormTextInput {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render snapshot when inputPrefixText is not there', () => {
    props = testProps({
      inputType: 'phone',
    });

    const tree = renderer.create(<FormTextInput {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render snapshot when input type is number', () => {
    props = testProps({
      inputType: 'number',
    });

    const tree = renderer.create(<FormTextInput {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render snapshot when input type is password', () => {
    props = testProps({
      inputType: 'password',
    });

    const tree = renderer.create(<FormTextInput {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render snapshot when password revealer is hide', () => {
    props = testProps({
      inputType: 'password',
      hidePasswordRevealer: true,
    });

    const tree = renderer.create(<FormTextInput {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
