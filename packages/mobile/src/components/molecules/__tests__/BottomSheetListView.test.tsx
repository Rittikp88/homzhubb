import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { CountryWithCode } from '@homzhub/common/src/mocks/countryWithCode';
import { BottomSheetListView } from '@homzhub/mobile/src/components/molecules/BottomSheetListView';

jest.mock('@react-native-community/google-signin', () => {});
jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');

const createTestProps = (testProps: any): object => ({
  data: CountryWithCode,
  selectedValue: 'abc',
  listTitle: 'Title',
  isBottomSheetVisible: true,
  onCloseDropDown: jest.fn(),
  onSelectItem: jest.fn(),
  ...testProps,
});
let props: any;

describe('BottomSheetListView', () => {
  beforeAll(() => jest.spyOn(React, 'useEffect').mockImplementation((f) => f));
  it('should render snapshot', () => {
    props = createTestProps({});
    const wrapper = mount(<BottomSheetListView {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
