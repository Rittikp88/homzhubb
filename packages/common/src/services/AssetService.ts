import { remove, cloneDeep } from 'lodash';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { IPropertySearchPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { IFilter } from '@homzhub/common/src/domain/models/Search';

// TODO: Use Property age Array when api is able to accept values
// const PROPERTY_AGE = [
//   DateUtils.getYear(1),
//   DateUtils.getYear(5),
//   DateUtils.getYear(10),
//   DateUtils.getYear(15),
//   DateUtils.getYear(20),
//   DateUtils.getYear(30),
// ];

// TODO: Use Metre Array when api is able to accept values in metres
// const SEARCH_RADIUS_METRE = [50000, 5000, 250, 10000, 500, 20000, 1000, 30000, 3000, 40000];
const SEARCH_RADIUS_KILO_METRE = [50, 5, 0.25, 10, 0.5, 20, 1, 30, 3, 40];

const DATE_ADDED = [
  -1,
  DateUtils.getDate(3),
  DateUtils.getDate(14),
  DateUtils.getDate(1),
  DateUtils.getDate(7),
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
      price__gt: min_price,
      price__lt: max_price,
      latitude: search_latitude,
      longitude: search_longitude,
      limit,
      offset,
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
        carpet_area__lt: Number(max_area),
        carpet_area__gt: Number(min_area),
        carpet_area_unit: area_unit,
      });
    }
    return finalPayload;
  };
}

const assetService = new AssetService();
export { assetService as AssetService };
