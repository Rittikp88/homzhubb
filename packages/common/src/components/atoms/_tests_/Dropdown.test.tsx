import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Dropdown, IProps } from '@homzhub/common/src/components/atoms/Dropdown';
import { CountryWithCode } from '@homzhub/common/src/mocks/CountryWithCode';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('Dropdown', () => {
  const wrapper: ShallowWrapper<IProps, {}, Dropdown> = shallow(
    <Dropdown value="+91" onDonePress={jest.fn()} data={CountryWithCode} />
  );
  const instance = wrapper.instance();

  it('should match snapshot', () => {
    wrapper.setProps({ placeholder: 'Select' });
    instance.onValueChange('Select');
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot when data is empty', () => {
    wrapper.setProps({ data: [] });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for disabled', () => {
    wrapper.setProps({ disable: true });
    instance.onValueChange('');
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call onClose and onOpen function', () => {
    instance.onCancel();
    expect(instance.state.dropdownVisible).toBe(false);
    instance.openDropdown();
    expect(instance.state.dropdownVisible).toBe(true);
  });
});
