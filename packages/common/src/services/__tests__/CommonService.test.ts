import { CommonService } from '@homzhub/common/src/services/CommonService';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { countryCodes } from '@homzhub/common/src/mocks/CommonRepositoryMocks';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe.skip('CommonService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return country with country code', async () => {
    // @ts-ignore
    jest.spyOn(CommonRepository, 'getCountryCodes').mockImplementation(() => Promise.resolve(countryCodes));
    const response = await CommonService.getCountryWithCode();
    expect(response).toMatchSnapshot();
  });
});
