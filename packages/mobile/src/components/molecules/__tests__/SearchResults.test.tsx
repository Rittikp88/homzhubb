import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { SearchResults } from '@homzhub/mobile/src/components/molecules/SearchResults';
import { autocompleteMock } from '@homzhub/common/src/mocks/GooglePlacesMocks';

let props: any;
let wrapper: ShallowWrapper;

describe('SearchResults', () => {
  const createTestProps = (testProps: any): object => ({
    results: autocompleteMock,
    onResultPress: jest.fn(),
    listTitleStyle: {},
    ...testProps,
  });
  props = createTestProps({});

  it('should match snapshot', () => {
    wrapper = shallow(<SearchResults {...props} t={(key: string): string => key} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
