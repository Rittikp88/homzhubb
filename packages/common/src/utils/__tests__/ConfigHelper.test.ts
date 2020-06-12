import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';

jest.mock('config.json', () => ({
  API_BASE_URL: 'https://testbaseurl.com',
  PLACES_API_BASE_URL: 'https://testbaseurl.com',
  PLACES_API_KEY: 'test',
  OTP_LENGTH: 6,
  RAZOR_API_KEY: 'razorpay',
  storage_secret: 'secret',
}));

describe('Config Helper', () => {
  it('should return API base url', () => {
    const baseURL = ConfigHelper.getBaseUrl();
    expect(baseURL).toStrictEqual('https://testbaseurl.com');
  });

  it('should return places API base url', () => {
    const baseURL = ConfigHelper.getPlacesBaseUrl();
    expect(baseURL).toStrictEqual('https://testbaseurl.com');
  });

  it('should return otp length', () => {
    const otpLength = ConfigHelper.getOtpLength();
    expect(otpLength).toStrictEqual(6);
  });

  it('should return places API key', () => {
    const placesAPIKey = ConfigHelper.getPlacesApiKey();
    expect(placesAPIKey).toStrictEqual('test');
  });

  it('should return storage secret key', () => {
    const storageSecretKey = ConfigHelper.getStorageSecret();
    expect(storageSecretKey).toStrictEqual('secret');
  });

  it('should return razorpay api key', () => {
    const razorpayApiKey = ConfigHelper.getRazorApiKey();
    expect(razorpayApiKey).toStrictEqual('razorpay');
  });
});
