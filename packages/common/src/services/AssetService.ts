import { IFilter } from '@homzhub/common/src/domain/models/Search';
import { IPropertySearchPayload } from '@homzhub/common/src/domain/repositories/interfaces';

class AssetService {
  public constructAssetSearchPayload = (filter: IFilter): IPropertySearchPayload => {
    const {
      search_latitude,
      search_longitude,
      asset_transaction_type,
      asset_type,
      min_price,
      max_price,
      // room_count,
      // bath_count,
      asset_group,
    } = filter;
    const finalPayload = {
      asset_group,
      txn_type: asset_transaction_type === 0 ? 'RENT' : 'BUY',
      price__gt: min_price,
      price__lt: max_price,
      latitude: search_latitude,
      longitude: search_longitude,
    };
    if (asset_type.length > 0) {
      Object.assign(finalPayload, { asset_type__in: asset_type.toString() });
    }
    return finalPayload;
  };
}

const assetService = new AssetService();
export { assetService as AssetService };
