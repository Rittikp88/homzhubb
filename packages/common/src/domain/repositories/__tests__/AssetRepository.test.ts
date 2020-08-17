import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { assetGroups, leaseTermDetail, saleTerm } from '@homzhub/common/src/mocks/PropertyDetails';
import { FurnishingType, PaidByTypes, ScheduleTypes } from '@homzhub/common/src/domain/models/LeaseTerms';
import { PropertyVerificationTypes } from '@homzhub/common/src/mocks/PropertyVerification';
import { mockAsset } from '@homzhub/common/src/mocks/AssetDescription';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('AssetRepository', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should fetch a asset data', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => assetGroups);
    const response = await AssetRepository.getDetails();
    expect(response).toMatchSnapshot();
  });

  it('should add a new asset in DB and return the corresponding property ID', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'post').mockImplementation(() => ({ id: 5 }));
    const response = await AssetRepository.createAsset({
      project_name: 'My House',
      unit_number: '6',
      block_number: 'C1',
      latitude: '1',
      longitude: '1',
    });
    expect(response).toStrictEqual({ id: 5 });
  });

  it('should update an existing asset in DB', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'patch').mockImplementation(() => true);
    const response = await AssetRepository.updateAsset(7, {
      total_floors: 5,
      asset_type: 5,
    });
    expect(response).toBeTruthy();
  });

  [
    { apiName: 'updateAsset', method: 'get' },
    { apiName: 'createAsset', method: 'get' },
    { apiName: 'getRentServices', method: 'get' },
    { apiName: 'getDetails', method: 'get' },
  ].forEach((api: { method: string; apiName: string }) => {
    it(`should throw an error in case of ${api.apiName} API failure`, async () => {
      // @ts-ignore
      jest.spyOn(BootstrapAppService.clientInstance, `${api.method}`).mockImplementation(() => {
        throw new Error('Test Error');
      });
      try {
        // @ts-ignore
        await AssetRepository[api.apiName]();
      } catch (e) {
        expect(e).toBeTruthy();
      }
    });
  });

  it('should fetch a asset detail', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => mockAsset);
    const response = await AssetRepository.getAssetById(1);
    expect(response).toMatchSnapshot();
  });

  it('should fetch a lease term', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => leaseTermDetail);
    const response = await AssetRepository.getLeaseTerms(1);
    expect(response).toMatchSnapshot();
  });

  it('should create lease term in DB and return the corresponding property ID', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'post').mockImplementation(() => ({ id: 5 }));
    const response = await AssetRepository.createLeaseTerms(1, {
      currency_code: '+91',
      expected_monthly_rent: 1200,
      security_deposit: 15000,
      annual_rent_increment_percentage: 5,
      minimum_lease_period: 2,
      furnishing: FurnishingType.SEMI,
      available_from_date: '2020-09-12',
      maintenance_paid_by: PaidByTypes.OWNER,
      utility_paid_by: PaidByTypes.OWNER,
      maintenance_amount: 1,
      maintenance_payment_schedule: ScheduleTypes.MONTHLY,
    });
    expect(response).toStrictEqual({ id: 5 });
  });

  it('should update lease term in DB and return the corresponding property ID', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'put').mockImplementation(() => ({ id: 5 }));
    const response = await AssetRepository.updateLeaseTerms(1, 1, {
      currency_code: '+91',
      expected_monthly_rent: 1200,
      security_deposit: 15000,
      annual_rent_increment_percentage: 5,
      minimum_lease_period: 2,
      furnishing: FurnishingType.SEMI,
      available_from_date: '2020-09-12',
      maintenance_paid_by: PaidByTypes.OWNER,
      utility_paid_by: PaidByTypes.OWNER,
      maintenance_amount: 1,
      maintenance_payment_schedule: ScheduleTypes.MONTHLY,
    });
    expect(response).toStrictEqual({ id: 5 });
  });

  it('should fetch a sale term', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => saleTerm);
    const response = await AssetRepository.getSaleTerms(1);
    expect(response).toMatchSnapshot();
  });

  it('should create sale term in DB and return the corresponding property ID', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'put').mockImplementation(() => ({ id: 5 }));
    const response = await AssetRepository.createSaleTerms(1, {
      currency_code: '+91',
      expected_price: 1200,
      expected_booking_amount: 500,
      construction_year: 1,
      available_from_date: '2020-09-12',
      maintenance_amount: 200,
      maintenance_payment_schedule: ScheduleTypes.MONTHLY,
    });
    expect(response).toStrictEqual({ id: 5 });
  });

  it('should update sale term in DB and return the corresponding property ID', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'put').mockImplementation(() => ({ id: 5 }));
    const response = await AssetRepository.updateSaleTerms(1, 1, {
      currency_code: '+91',
      expected_price: 12000,
      expected_booking_amount: 5000,
      construction_year: 1,
      available_from_date: '2020-10-12',
      maintenance_amount: 2000,
      maintenance_payment_schedule: ScheduleTypes.MONTHLY,
    });
    expect(response).toStrictEqual({ id: 5 });
  });

  it('Should fetch existing verification document types', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => PropertyVerificationTypes);
    const response = await AssetRepository.getExistingVerificationDocuments(1);
    expect(response).toMatchSnapshot();
  });

  it('Should fetch verification document types', async () => {
    // @ts-ignore
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => PropertyVerificationTypes);
    const response = await AssetRepository.getVerificationDocumentTypes();
    expect(response).toMatchSnapshot();
  });
});
