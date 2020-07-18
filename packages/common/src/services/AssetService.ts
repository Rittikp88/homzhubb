class AssetService {
  // TODO: Return type to be added
  public constructAssetSearchPayload = (filter: any): any => {
    const {
      // search_latitude,
      // search_longitude,
      asset_transaction_type,
      asset_type,
      // min_price,
      // max_price,
      // room_count,
      // bath_count,
      asset_group,
    } = filter;
    return {
      asset_group,
      txn_type: asset_transaction_type === 0 ? 'RENT' : 'BUY',
      price__gt: 1000,
      price__lt: 100000,
      // latitude: search_latitude,
      // longitude: search_longitude,
      asset_type__in: asset_type.toString(),
      bedroom: 1,
      bathroom: 1,
    };
  };
}

const assetService = new AssetService();
export { assetService as AssetService };
