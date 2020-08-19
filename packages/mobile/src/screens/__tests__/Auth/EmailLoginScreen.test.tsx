import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { EmailLoginScreen, mapDispatchToProps } from '@homzhub/mobile/src/screens/Auth/EmailLoginScreen';
import { LoginTypes } from '@homzhub/common/src/domain/repositories/interfaces';
import { UserActionTypes } from '@homzhub/common/src/modules/user/actions';

const mock = jest.fn();

describe('Email Login Screen', () => {
  let component: ShallowWrapper;
  let props: any;

  beforeEach(() => {
    props = {
      navigation: {
        navigate: mock,
        goBack: mock,
      },
      login: mock,
    };
    component = shallow(
      <EmailLoginScreen
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

  it('should render email login screen', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should navigate on icon press', () => {
    // @ts-ignore
    component.find('[testID="headerIconPress"]').prop('onIconPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should navigate to forgot password', () => {
    // @ts-ignore
    component.find('[testID="loginForm"]').prop('handleForgotPassword')();
    expect(mock).toHaveBeenCalled();
  });

  it('should handle login success', () => {
    const values = {
      email: 'johndoe@gmail.com',
      password: 'password',
      country_code: '+91',
      phone_number: '9876543210',
    };
    // @ts-ignore
    component.find('[testID="loginForm"]').prop('onLoginSuccess')(values);
    expect(mock).toHaveBeenCalled();
  });

  it('should handle mapDispatchToProps', () => {
    const dispatch = jest.fn();
    const payload = {
      action: LoginTypes.EMAIL,
      payload: {
        email: 'johndoe@gmail.com',
        password: 'Johndoe123!',
      },
    };
    // @ts-ignore
    mapDispatchToProps(dispatch).login(payload);
    expect(dispatch.mock.calls[0][0]).toStrictEqual({
      type: UserActionTypes.AUTH.LOGIN,
      payload,
    });
  });
});
