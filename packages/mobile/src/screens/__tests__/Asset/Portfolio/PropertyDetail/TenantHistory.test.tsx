import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { TenantHistoryScreen } from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/TenantHistoryScreen';

describe('Tenant History Screen', () => {
  let component: ShallowWrapper;
  let props: any;

  beforeEach(() => {
    props = {
      assetId: 1,
      tenantHistory: [],
      getTenantHistory: jest.fn(),
      navigation: {
        navigate: jest.fn(),
      },
    };
    component = shallow(<TenantHistoryScreen {...props} t={(key: string): string => key} />);
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });
});
