import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export enum NotificationType {
  SYSTEM_NOTIFICATION = 'SYSTEM_NOTIFICATION',
  SITE_VISIT = 'SITE_VISIT',
  PROPERTY_DETAIL = 'PROPERTY_DETAIL',
  PROPERTY_PREVIEW = 'PROPERTY_PREVIEW',
  REVIEW_AND_RATING = 'REVIEW_AND_RATING',
  SERVICE_TICKET = 'SERVICE_TICKET',
}

@JsonObject('DeeplinkMetaData')
export class DeeplinkMetaData {
  @JsonProperty('asset_id', Number, true)
  private _assetId = -1;

  @JsonProperty('lease_listing_id', Number, true)
  private _leaseListingId = -1;

  @JsonProperty('sale_listing_id', Number, true)
  private _saleListingId = -1;

  @JsonProperty('object_id', Number, true)
  private _objectId = -1;

  @JsonProperty('type', String, true)
  private _type = '';

  get assetId(): number {
    return this._assetId;
  }

  get leaseListingId(): number {
    return this._leaseListingId;
  }

  get saleListingId(): number {
    return this._saleListingId;
  }

  get objectId(): number {
    return this._objectId;
  }

  get type(): NotificationType {
    return this._type as NotificationType;
  }
}
