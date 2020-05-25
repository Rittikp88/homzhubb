export interface ISignUpPayload {
  full_name: string;
  email: string;
  country_code: string;
  phone_number: string;
  password: string;
}

export interface IEmailLoginPayload {
  action: string;
  payload: {
    email: string;
    password: string;
  };
}

export interface IMobileLoginPayload {
  action: string;
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
