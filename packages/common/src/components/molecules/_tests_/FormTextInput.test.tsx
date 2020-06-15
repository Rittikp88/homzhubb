// @ts-nocheck
import React from 'react';
import { shallow } from 'enzyme';
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
    props = testProps({
      inputType: 'name',
    });
    const wrapper = shallow(<FormTextInput {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render snapshot when input type is email', () => {
    props = testProps({
      inputType: 'email',
      isOptional: true,
      helpText: 'Help',
    });

    const wrapper = shallow(<FormTextInput {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render snapshot when input type is phone', () => {
    props = testProps({
      inputType: 'phone',
      inputPrefixText: '+91',
    });

    const tree = renderer.create(<FormTextInput {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render snapshot and call handleChange when inputPrefixText is not there', () => {
    props = testProps({
      inputType: 'phone',
    });

    const wrapper = shallow(<FormTextInput {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render snapshot and call handleChange when input type is number', () => {
    props = testProps({
      inputType: 'number',
    });

    const wrapper = shallow(<FormTextInput {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render snapshot when input type is password', () => {
    props = testProps({
      inputType: 'password',
      onValueChange: jest.fn(),
    });

    const wrapper = shallow(<FormTextInput {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render snapshot when password revealer is hide', () => {
    props = testProps({
      inputType: 'password',
      hidePasswordRevealer: true,
    });

    const tree = renderer.create(<FormTextInput {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should test showPassword state', () => {
    props = testProps({});
    const wrapper = shallow(<FormTextInput {...props} />);
    const instance = wrapper.instance();
    expect(instance.state.showPassword).toBe(false);
    instance.toggleShowPassword();
    expect(instance.state.showPassword).toBe(true);
  });

  it('should test isFocused state', () => {
    props = testProps({});
    const wrapper = shallow(<FormTextInput {...props} />);
    const instance = wrapper.instance();
    instance.focus();
    instance.handleBlur();
    expect(instance.state.isFocused).toBe(false);
    instance.handleFocus();
    expect(instance.state.isFocused).toBe(true);
  });
});
