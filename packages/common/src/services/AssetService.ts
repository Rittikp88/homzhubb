import { remove, cloneDeep, groupBy } from 'lodash';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { IFormData, LeaseFormKeys } from '@homzhub/mobile/src/components/molecules/LeaseTermForm';
import { IVisitByKey } from '@homzhub/common/src/domain/models/AssetVisit';
import { IFilter } from '@homzhub/common/src/domain/models/Search';
import { VisitAssetDetail } from '@homzhub/common/src/domain/models/VisitAssetDetail';
import { PaidByTypes } from '@homzhub/common/src/constants/Terms';
import { IPropertySearchPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { AssetGroupTypes } from '@homzhub/common/src/constants/AssetGroup';

// CONSTANTS
const SEARCH_RADIUS_KILO_METRE = [50, 5, 0.25, 10, 0.5, 20, 1, 30, 3, 40];
const DATE_ADDED = [
  null,
  DateUtils.getDate(1),
  DateUtils.getDate(3),
  DateUtils.getDate(7),
  DateUtils.getDate(14),
  DateUtils.getDate(28),
];

class AssetService {
  public constructAssetSearchPayload = (filter: IFilter): IPropertySearchPayload => {
    const {
      search_latitude,
      search_longitude,
      asset_type,
      min_price,
      max_price,
      room_count,
      bath_count,
      asset_group,
      limit,
      offset,
      min_area,
      max_area,
      area_unit,
      currency_code,
      sort_by,
      miscellaneous: {
        show_verified,
        agent_listed,
        search_radius,
        date_added,
        // property_age,
        rent_free_period,
        // expected_move_in_date,
        facing,
        furnishing,
        propertyAmenity,
      },
    } = filter;
    const bedroomCount = cloneDeep(room_count);
    remove(bedroomCount, (count: number) => count === -1);
    const finalPayload = {
      asset_group,
      price__gte: min_price,
      price__lte: max_price,
      latitude: search_latitude,
      longitude: search_longitude,
      limit,
      offset,
      currency_code,
      ...(sort_by && { sort_by }),
      bathroom__gte: bath_count,
      // move_in_date__gte: expected_move_in_date,
      ...(furnishing.length > 0 ? { furnishing__in: furnishing.toString() } : {}),
      ...(facing.length > 0 ? { facing__in: facing.toString() } : {}),
      ...(propertyAmenity.length > 0 ? { amenities__in: propertyAmenity.toString() } : {}),
      ...(rent_free_period !== -1 ? { rent_free_period } : {}),
      ...(show_verified ? { is_verified: show_verified } : {}),
      ...(agent_listed ? { agent_listed } : {}),
      // ...{ age__gte: PROPERTY_AGE[property_age - 1] },
      ...(search_radius === -1
        ? { search_radius: SEARCH_RADIUS_KILO_METRE[0] }
        : { search_radius: SEARCH_RADIUS_KILO_METRE[search_radius - 1] }),
      ...(date_added !== -1 ? { date_added__gte: DATE_ADDED[date_added - 1] } : {}),
    };
    if (asset_type.length > 0) {
      Object.assign(finalPayload, { asset_type__in: asset_type.toString() });
    }
    if (bedroomCount.includes(5)) {
      Object.assign(finalPayload, { bedroom__gte: 5 });
      remove(bedroomCount, (count: number) => count === 5);
    }
    if (bedroomCount.length > 0) {
      Object.assign(finalPayload, { bedroom__in: bedroomCount.toString() });
    }
    if (asset_group === 2) {
      // Apply only for Commercial Properties
      Object.assign(finalPayload, {
        carpet_area__lte: Number(max_area),
        carpet_area__gte: Number(min_area),
        carpet_area_unit: area_unit,
      });
    }
    return finalPayload;
  };

  public extractLeaseParams = (values: IFormData, assetGroupType: AssetGroupTypes): any => {
    const params: any = {
      expected_monthly_rent: parseInt(values[LeaseFormKeys.monthlyRent], 10),
      security_deposit: parseFloat(values[LeaseFormKeys.securityDeposit]),
      annual_rent_increment_percentage: parseFloat(values[LeaseFormKeys.annualIncrement]),
      available_from_date: values[LeaseFormKeys.availableFrom],
      minimum_lease_period: values[LeaseFormKeys.minimumLeasePeriod],
      maximum_lease_period: values[LeaseFormKeys.maximumLeasePeriod],
      utility_paid_by: values[LeaseFormKeys.utilityBy],
      maintenance_paid_by: values[LeaseFormKeys.maintenanceBy],
      maintenance_amount: parseInt(values[LeaseFormKeys.maintenanceAmount], 10),
      maintenance_payment_schedule: values[LeaseFormKeys.maintenanceSchedule],
      maintenance_unit: values[LeaseFormKeys.maintenanceUnit],
      description: values[LeaseFormKeys.description],
      rent_free_period: parseInt(values[LeaseFormKeys.rentFreePeriod], 10) || null,
    };

    if (!values[LeaseFormKeys.showMore]) {
      params.annual_rent_increment_percentage = null;
    }

    if (values[LeaseFormKeys.maintenanceBy] === PaidByTypes.OWNER) {
      params.maintenance_amount = null;
      params.maintenance_payment_schedule = null;
      params.maintenance_unit = null;
    } else if (assetGroupType === AssetGroupTypes.COM) {
      params.maintenance_payment_schedule = null;
    } else if (assetGroupType === AssetGroupTypes.RES) {
      params.maintenance_unit = null;
    }

    return params;
  };

  public getVisitAssetByCountry = async (): Promise<IVisitByKey[]> => {
    try {
      const response = await AssetRepository.getAllVisitAsset();
      const groupData = groupBy(response, (results) => {
        return results.country.iso2Code;
      });

      return Object.keys(groupData).map((code) => {
        const results: VisitAssetDetail[] = groupData[code];
        return {
          key: code,
          results,
        };
      });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      return [];
    }
  };
}

const assetService = new AssetService();
export { assetService as AssetService };
