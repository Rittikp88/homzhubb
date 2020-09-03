import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AddRecordForm } from '@homzhub/mobile/src/components/organisms/AddRecordForm';

let props: any;
let wrapper: ShallowWrapper;

describe('AddRecordForm', () => {
  const createTestProps = (testProps: any): object => ({
    properties: [],
    ledgerCategories: [],
    clear: false,
    onFormClear: jest.fn(),
    shouldLoad: jest.fn(),
    ...testProps,
  });

  props = createTestProps({});

  it('should match snapshot', () => {
    wrapper = shallow(<AddRecordForm {...props} t={(key: string): string => key} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
