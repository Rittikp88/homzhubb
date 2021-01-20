import { IFilter } from '@homzhub/common/src/domain/models/Search';
import { ISearchEvent, ListingType } from '@homzhub/common/src/services/Analytics/interfaces';

class AnalyticsHelper {
  public getSearchTrackData = (filter: IFilter): ISearchEvent => {
    const {
      asset_transaction_type,
      search_address,
      asset_group,
      max_price,
      min_price,
      bath_count,
      room_count,
      min_area,
      max_area,
    } = filter;

    const minPrice = min_price && min_price > 0 ? min_price : 0;
    const maxPrice = max_price && max_price > 0 ? max_price : 0;
    const minArea = min_area && min_area > 0 ? min_area : 0;
    const maxArea = max_area && max_area > 0 ? max_area : 0;

    return {
      search_string: search_address ?? '',
      listing_type: asset_transaction_type === 0 ? ListingType.RENT : ListingType.SELL,
      asset_group_type: asset_group === 1 ? 'Residential' : 'Commercial',
      ...((minPrice > 0 || maxPrice > 0) && { price_range: `${minPrice} - ${maxPrice}` }),
      ...((minArea > 0 || maxArea > 0) && { price_range: `${minArea} - ${maxArea}` }),
      ...(bath_count && bath_count > 0 && { bathroom: bath_count }),
      ...(room_count && room_count[0] > 0 && { bathroom: room_count[0] }),
    };
  };
}

const analyticsHelper = new AnalyticsHelper();
export { analyticsHelper as AnalyticsHelper };