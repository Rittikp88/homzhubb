// @ts-nocheck
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Dashboard } from '@homzhub/mobile/src/screens/Asset/Dashboard';

describe.skip('Dashboard Screen', () => {
  let component: ShallowWrapper;

  beforeEach(() => {
    component = shallow(<Dashboard t={(key: string): string => key} />);
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });
});
