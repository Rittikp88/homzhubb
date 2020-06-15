import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import SetLocationForm from '@homzhub/mobile/src/components/molecules/SetLocationForm';

jest.mock('@react-native-community/google-signin', () => {});
jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');

const createTestProps = (testProps: any): object => ({
  formData: {
    projectName: 'Test Project',
    unitNo: '#12',
    blockNo: '2',
  },
  onSubmit: jest.fn(),
  ...testProps,
});
let props: any;

describe('BottomSheetListView', () => {
  it('should render snapshot', () => {
    props = createTestProps({});
    const wrapper = mount(<SetLocationForm {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
