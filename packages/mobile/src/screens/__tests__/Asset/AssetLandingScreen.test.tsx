import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AssetLandingScreen } from '@homzhub/mobile/src/screens/Asset/AssetLandingScreen';

const mock = jest.fn();

describe.skip('Landing Screen Component', () => {
  let component: any;
  let props: any;

  beforeEach(() => {
    props = {
      user: {
        full_name: 'John Doe',
        email: 'johndoe@gmail.com',
        country_code: 'IN',
        phone_number: '9876543210',
        access_token: 'accesstoken',
        refresh_token: 'refreshtoken',
      },
      logout: mock,
      navigation: {
        navigate: mock,
      },
    };
    component = shallow(<AssetLandingScreen {...props} t={(key: string): string => key} />);
  });

  it('should render landing screen', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should navigate to Add Property Screen', () => {
    component.find('[testID="btnAddProperty"]').prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });
});
