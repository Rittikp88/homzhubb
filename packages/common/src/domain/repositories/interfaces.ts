export enum LoginTypes {
  OTP = 'OTP_LOGIN',
  EMAIL = 'EMAIL_LOGIN',
}

export interface ISignUpPayload {
  full_name: string;
  email: string;
  country_code: string;
  phone_number: string;
  password: string;
}

export interface IEmailLoginPayload {
  action: LoginTypes.EMAIL;
  payload: {
    email: string;
    password: string;
  };
}

export interface ISocialLoginPayload {
  action: string;
  payload: {
    provider: string;
    id_token: string;
  };
}

export interface IOtpLoginPayload {
  action: LoginTypes.OTP;
  payload: {
    country_code: string;
    phone_number: string;
    otp: string;
  };
}

export interface ILoginFormData {
  email: string;
  password: string;
  country_code: string;
  phone_number: string;
}

export interface IForgotPasswordPayload {
  action: string;
  payload: {
    email?: string;
    token?: string | number;
    password?: string;
  };
}
