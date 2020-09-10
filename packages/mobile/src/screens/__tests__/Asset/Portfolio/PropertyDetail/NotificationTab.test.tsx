import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { NotificationTab } from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/NotificationTab';

describe('Asset Notifications Screen', () => {
  let component: ShallowWrapper;
  let props: any;

  beforeEach(() => {
    props = {
      propertyData: [],
      navigation: {
        goBack: jest.fn(),
      },
    };
    component = shallow(<NotificationTab {...props} t={(key: string): string => key} />);
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });
});
