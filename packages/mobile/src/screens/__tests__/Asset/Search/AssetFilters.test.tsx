import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { SearchFilter } from '@homzhub/common/src/mocks/FilterData';
import { AssetFilters } from '@homzhub/mobile/src/screens/Asset/Search/AssetFilters';

describe('Asset filter', () => {
  let component: ShallowWrapper;
  let props: any;
  const mock = jest.fn();

  beforeEach(() => {
    props = {
      filters: SearchFilter,
      setInitialState: mock,
      setFilter: mock,
      navigation: {
        goBack: mock,
      },
    };
  });

  it('should render snapshot', () => {
    component = shallow(<AssetFilters {...props} t={(key: string): string => key} />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
