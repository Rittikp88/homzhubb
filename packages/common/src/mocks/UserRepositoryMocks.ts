import { LoginTypes } from '../domain/repositories/interfaces';

export const loginData = {
  access_token: 'access_token',
  refresh_token: 'refresh_token',
  user: {
    full_name: 'Rishabh Modi',
    email: 'r@gmail.com',
    country_code: 'IN',
    phone_number: '99999999',
  },
};

export const socialLogin = {
  is_new_user: false,
  ...loginData,
};

export const socialLoginNoUser = {
  is_new_user: false,
  access_token: 'access_token',
  refresh_token: 'refresh_token',
  user: null,
};

export const otpSent = {
  otp_sent: true,
};

export const otpVerify = {
  otp_verify: true,
};

export const emailExists = {
  is_exists: true,
};

export const userData = {
  access_token: 'access_token',
  refresh_token: 'refresh_token',
  full_name: 'Rishabh Modi',
  email: 'r@gmail.com',
  country_code: 'IN',
  phone_number: '99999999',
};

export const loginPayload = {
  action: LoginTypes.EMAIL,
  payload: {
    email: 'test@yopmail.com',
    password: 'Test@123',
  },
};
