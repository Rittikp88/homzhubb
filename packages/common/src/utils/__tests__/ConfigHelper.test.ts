import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';

jest.mock('config.json', () => ({
  API_BASE_URL: 'https://testbaseurl.com',
  OTP_LENGTH: 6,
}));

describe('Config Helper', () => {
  it('should return API base url', () => {
    const baseURL = ConfigHelper.getBaseUrl();
    expect(baseURL).toStrictEqual('https://testbaseurl.com');
  });

  it('should return otp length', () => {
    const otpLength = ConfigHelper.getOtpLength();
    expect(otpLength).toStrictEqual(6);
  });
});
