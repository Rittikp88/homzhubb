// @ts-nocheck
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Notifications } from '@homzhub/mobile/src/screens/Asset/Dashboard/Notifications';

describe('Asset Notifications Screen', () => {
  let component: ShallowWrapper;

  beforeEach(() => {
    component = shallow(<Notifications t={(key: string): string => key} />);
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });
});
