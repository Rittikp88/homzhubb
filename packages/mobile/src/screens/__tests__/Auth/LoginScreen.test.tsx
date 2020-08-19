import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { LoginScreen, mapDispatchToProps } from '@homzhub/mobile/src/screens/Auth/LoginScreen';
import { UserActionTypes } from '@homzhub/common/src/modules/user/actions';
import { SocialMediaData } from '@homzhub/common/src/mocks/socialMedia';

const mock = jest.fn();

describe('Login Screen', () => {
  let component: ShallowWrapper;
  let props: any;
  let instance: any;

  beforeEach(() => {
    props = {
      navigation: {
        navigate: mock,
        goBack: mock,
      },
      loginSuccess: mock,
    };
    component = shallow(
      <LoginScreen
        {...props}
        t={(key: string): string => key}
        route={{
          params: {
            onCallback: mock,
          },
        }}
      />
    );
    instance = component.instance();
  });

  it('should render login screen', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should navigate go back', () => {
    // @ts-ignore
    component.find('[testID="headerEvents"]').prop('onIconPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should navigate to signup screen', () => {
    // @ts-ignore
    component.find('[testID="headerEvents"]').prop('onLinkPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should navigate to email login', () => {
    // @ts-ignore
    component.find('[testID="socialEmailLogin"]').prop('onEmailLogin')();
    expect(mock).toHaveBeenCalled();
  });

  it('should login on otp press', () => {
    const values = {
      email: 'john@gmail.com',
      password: 'password',
      country_code: '_91',
      phone_number: '9876543210',
    };
    // @ts-ignore
    component.find('[testID="loginForm"]').prop('onLoginSuccess')(values);
    expect(mock).toHaveBeenCalled();
  });

  it('should call the mapDispatchToProps', () => {
    const dispatch = jest.fn();
    const data = {
      full_name: 'John doe',
      email: 'john@gmail.com',
      country_code: '_91',
      phone_number: '9876543210',
      access_token: 'access_token',
      refresh_token: 'refresh_token',
    };
    mapDispatchToProps(dispatch).loginSuccess(data);
    expect(dispatch.mock.calls[0][0]).toStrictEqual({
      type: UserActionTypes.AUTH.LOGIN_SUCCESS,
      payload: data,
    });
  });

  it('should fetch the social media data', async () => {
    jest.spyOn(CommonRepository, 'getSocialMedia').mockImplementation(() => Promise.resolve(SocialMediaData));
    await instance.componentDidMount();
    const response = await CommonRepository.getSocialMedia();
    component.setState({ socialMediaProviders: response });
    expect(component.state('socialMediaProviders')).toStrictEqual(SocialMediaData);
  });
});
