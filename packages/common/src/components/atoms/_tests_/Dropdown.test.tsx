import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Dropdown, IProps } from '@homzhub/common/src/components/atoms/Dropdown';
import { CountryWithCode } from '../../../mocks/countryWithCode';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('Dropdown', () => {
  const wrapper: ShallowWrapper<IProps, {}, Dropdown> = shallow(
    <Dropdown value="+91" onDonePress={jest.fn()} data={CountryWithCode} />
  );

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for disabled', () => {
    wrapper.setProps({ disable: true });
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
