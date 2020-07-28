import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { SetLocationForm } from '@homzhub/mobile/src/components/molecules/SetLocationForm';

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
