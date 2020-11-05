import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { SignUpScreen } from '@homzhub/mobile/src/screens/Auth/SignUpScreen';

const mock = jest.fn();

describe('SignUp Screen', () => {
  let component: any;
  let props: any;
  beforeEach(() => {
    props = {
      loginSuccess: mock,
      navigation: {
        navigate: mock,
        goBack: mock,
      },
    };
    component = shallow(
      <SignUpScreen
        {...props}
        t={(key: string): string => key}
        route={{
          params: {
            onCallback: mock,
          },
        }}
      />
    );
  });

  it('should render signup screen', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should navigate back', () => {
    component.find('[testID="headerEvents"]').prop('onIconPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should navigate to login screen', () => {
    component.find('[testID="headerEvents"]').prop('onLinkPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should handle signup form submit', () => {
    const formData = {
      full_name: 'John doe',
      email: 'john@gmail.com',
      country_code: '+91',
      phone_number: '9876543210',
      password: 'password',
    };
    component.setState({ isNewUser: true });
    component.find('[testID="signupForm"]').prop('onSubmitFormSuccess')(formData);
    expect(mock).toHaveBeenCalled();
  });
});
