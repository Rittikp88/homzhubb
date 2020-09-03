// @ts-nocheck
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { NotificationTab } from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/NotificationTab';

describe('Asset Notifications Screen', () => {
  let component: ShallowWrapper;

  beforeEach(() => {
    component = shallow(<NotificationTab t={(key: string): string => key} />);
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });
});
