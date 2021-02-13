import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { AssetTenantInfo } from '@homzhub/common/src/domain/models/AssetTenantInfo';
import { LabelColor, LeaseTransaction } from '@homzhub/common/src/domain/models/LeaseTransaction';
import { User } from '@homzhub/common/src/domain/models/User';

export enum ActionType {
  CANCEL = 'CANCEL LISTING',
  ACTION = 'TAKE ACTIONS',
  TERMINATE = 'TERMINATE',
}

@JsonObject('AssetStatusInfo')
export class AssetStatusInfo {
  @JsonProperty('tag', LabelColor, true)
  private _tag: LabelColor = new LabelColor();

  @JsonProperty('lease_tenant_info', AssetTenantInfo, true)
  private _leaseTenantInfo: AssetTenantInfo = new AssetTenantInfo();

  @JsonProperty('lease_owner_info', User, true)
  private _leaseOwnerInfo: User = new User();

  @JsonProperty('lease_transaction', LeaseTransaction, true)
  private _leaseTransaction: LeaseTransaction = new LeaseTransaction();

  @JsonProperty('lease_listing_id', Number, true)
  private readonly _leaseListingId: number | null = null;

  @JsonProperty('sale_listing_id', Number, true)
  private readonly _saleListingId: number | null = null;

  @JsonProperty('lease_unit_id', Number, true)
  private readonly _leaseUnitId: number | null = null;

  @JsonProperty('sale_unit_id', Number, true)
  private readonly _saleUnitId: number | null = null;

  @JsonProperty('action', LabelColor, true)
  private _action: LabelColor | null = null;

  @JsonProperty('status', String, true)
  private _status = '';

  constructor(
    lease_listing: number | null,
    sale_listing: number | null,
    lease_unit: number | null,
    sale_unit: number | null
  ) {
    this._leaseUnitId = lease_unit;
    this._saleUnitId = sale_unit;
    this._leaseListingId = lease_listing;
    this._saleListingId = sale_listing;
  }

  get tag(): LabelColor {
    return this._tag;
  }

  get leaseTenantInfo(): AssetTenantInfo {
    return this._leaseTenantInfo;
  }

  get leaseOwnerInfo(): User {
    return this._leaseOwnerInfo;
  }

  get leaseTransaction(): LeaseTransaction {
    return this._leaseTransaction;
  }

  get leaseListingId(): number | null {
    return this._leaseListingId;
  }

  get saleListingId(): number | null {
    return this._saleListingId;
  }

  get action(): LabelColor | null {
    return this._action;
  }

  get leaseUnitId(): number | null {
    return this._leaseUnitId;
  }

  get saleUnitId(): number | null {
    return this._saleUnitId;
  }

  get isListingPresent(): boolean {
    return !!((this.leaseListingId && this.leaseListingId > 0) || (this.saleListingId && this.saleListingId > 0));
  }

  get status(): string {
    return this._status;
  }
}
