import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Documents } from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/Documents';

describe('Documents Screen', () => {
  let component: ShallowWrapper;
  let props: any;

  beforeEach(() => {
    props = {
      getAssetDocument: jest.fn(),
    };
    component = shallow(<Documents {...props} />);
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });
});
