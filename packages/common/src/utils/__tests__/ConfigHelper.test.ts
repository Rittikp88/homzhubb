import { ConfigHelper } from '../ConfigHelper';

jest.mock('config.json', () => ({
  'GOOGLE-CLIENT-ID': 'TestID',
  API_BASE_URL: 'https://testbaseurl.com',
  API_PREFIX: 'Prefix',
}));

describe('Config Helper', () => {
  it('should return API base url', () => {
    const baseURL = ConfigHelper.getBaseUrl();
    expect(baseURL).toStrictEqual('https://testbaseurl.com');
  });
});
