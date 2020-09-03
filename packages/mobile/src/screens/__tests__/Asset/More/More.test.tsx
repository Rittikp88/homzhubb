import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { More } from '@homzhub/mobile/src/screens/Asset/More';

describe('More Screen', () => {
  let component: ShallowWrapper;

  beforeEach(() => {
    component = shallow(<More />);
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });
});
