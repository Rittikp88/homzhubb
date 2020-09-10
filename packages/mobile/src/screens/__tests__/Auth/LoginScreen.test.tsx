import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { UserActionTypes } from '@homzhub/common/src/modules/user/actions';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { SocialMediaData } from '@homzhub/common/src/mocks/SocialMedia';
import { LoginScreen, mapDispatchToProps } from '@homzhub/mobile/src/screens/Auth/LoginScreen';
import { SocialMediaProvider } from '@homzhub/common/src/domain/models/SocialMediaProvider';

const mock = jest.fn();

describe('Login Screen', () => {
  let component: any;
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
    component.find('[testID="headerEvents"]').prop('onIconPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should navigate to signup screen', () => {
    component.find('[testID="headerEvents"]').prop('onLinkPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should navigate to email login', () => {
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
    const data = ObjectMapper.deserializeArray(SocialMediaProvider, SocialMediaData);
    jest.spyOn(CommonRepository, 'getSocialMedia').mockImplementation(() => Promise.resolve(data));
    await instance.componentDidMount();
    const response = await CommonRepository.getSocialMedia();
    component.setState({ socialMediaProviders: response });
    expect(component.state('socialMediaProviders')).toStrictEqual(data);
  });
});
