import { ConfigHelper } from '../ConfigHelper';

jest.mock('config.json', () => ({
  API_BASE_URL: 'https://testbaseurl.com',
}));

describe('Config Helper', () => {
  it('should return API base url', () => {
    const baseURL = ConfigHelper.getBaseUrl();
    expect(baseURL).toStrictEqual('https://testbaseurl.com');
  });
});
