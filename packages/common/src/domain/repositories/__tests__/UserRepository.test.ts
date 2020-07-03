import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { LoginTypes, OtpActionTypes, OtpTypes } from '@homzhub/common/src/domain/repositories/interfaces';
import { emailExists, loginData, otpSent, otpVerify, socialLogin } from '@homzhub/common/src/mocks/UserRepositoryMocks';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('UserRepository', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call signUp API', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'post').mockImplementation(() => true);
    const response = await UserRepository.signUp({
      full_name: 'Test User',
      email: 'xxx@y.com',
      country_code: 'IN',
      phone_number: '123',
      password: 'PassWord',
    });
    expect(response).toBeTruthy();
  });

  it('should call social signUp API', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'post').mockImplementation(() => true);
    const response = await UserRepository.socialSignUp({
      otp: '123',
      user_details: {
        full_name: 'Test User',
        email: 'xxx@y.com',
        country_code: 'IN',
        phone_number: '123',
        password: 'PassWord',
      },
    });
    expect(response).toBeTruthy();
  });

  it('should call login API for email and return response', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'post').mockImplementation(() => loginData);
    const response = await UserRepository.login({
      action: LoginTypes.EMAIL,
      payload: {
        email: 'test',
        password: 'password',
      },
    });
    expect(response).toMatchSnapshot();
  });

  it('should call login API for OTP and return response', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'post').mockImplementation(() => loginData);
    const response = await UserRepository.login({
      action: LoginTypes.OTP,
      payload: {
        phone_number: '9000000000',
        country_code: 'IN',
        otp: '123456',
      },
    });
    expect(response).toMatchSnapshot();
  });

  it('should call socialLogin and return response', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'post').mockImplementation(() => socialLogin);
    const response = await UserRepository.socialLogin({
      action: LoginTypes.SOCIAL_MEDIA,
      payload: {
        provider: 'GOOGLE',
        id_token: 'tokenTest',
      },
    });
    expect(response).toMatchSnapshot();
  });

  it('should call otp API for fetch', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'post').mockImplementation(() => otpSent);
    const response = await UserRepository.Otp({
      action: OtpActionTypes.SEND,
      payload: {
        media: [OtpTypes.PHONE],
        destination_details: [
          {
            country_code: 'IN',
            phone_number: '90000000000',
          },
        ],
      },
    });
    expect(response).toMatchSnapshot();
  });

  it('should call otp API for verify', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'post').mockImplementation(() => otpVerify);
    const response = await UserRepository.Otp({
      action: OtpActionTypes.VERIFY,
      payload: {
        otp: '1233344',
        media: [OtpTypes.PHONE],
        destination_details: [
          {
            country_code: 'IN',
            phone_number: '90000000000',
          },
        ],
      },
    });
    expect(response).toMatchSnapshot();
  });

  it('should call resetPassword API for setPassword', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'put').mockImplementation(() => true);
    const response = await UserRepository.resetPassword({
      action: 'SET_PASSWORD',
      payload: {
        token: 'Zm9vYmFyQGZvb2Jhci5jb20=',
        password: 'test1234',
      },
    });
    expect(response).toBeTruthy();
  });

  it('should call resetPassword API for send email', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'put').mockImplementation(() => true);
    const response = await UserRepository.resetPassword({
      action: 'SEND_EMAIL',
      payload: {
        email: 'foobar@foobar.com',
      },
    });
    expect(response).toBeTruthy();
  });

  it('should check if email exists', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => emailExists);
    const response = await UserRepository.emailExists('test@example.com');
    expect(response).toMatchSnapshot();
  });

  it('should check if phone exists', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => emailExists);
    const response = await UserRepository.phoneExists('90000000000');
    expect(response).toMatchSnapshot();
  });
});
