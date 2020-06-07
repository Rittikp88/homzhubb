import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { FormDropdown } from '@homzhub/common/src/components/molecules/FormDropdown';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('Test cases for FormDropdown', () => {
  const formValues = {
    values: {
      name: 'test',
    },
    touched: {
      name: 'test',
    },
  };
  // @ts-ignore
  const wrapper: ShallowWrapper = shallow(<FormDropdown name="dropdown" formProps={formValues} />);

  it('should render snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});