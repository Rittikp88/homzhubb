import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { AssetAdvertisementData, AssetMetricsData, MarketTrendsData } from '@homzhub/common/src/mocks/AssetMetrics';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('DashboardRepository', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should get Market Trends', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => MarketTrendsData);
    const response = await DashboardRepository.getMarketTrends(2);
    expect(response).toMatchSnapshot();
  });

  it('should get Asset Metrics', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => AssetMetricsData);
    const response = await DashboardRepository.getAssetMetrics();
    expect(response).toMatchSnapshot();
  });

  it('should get advertisements', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => AssetAdvertisementData);
    const response = await DashboardRepository.getAdvertisements();
    expect(response).toMatchSnapshot();
  });
});
