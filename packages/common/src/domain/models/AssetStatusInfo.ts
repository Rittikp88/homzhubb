import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { LabelColor, LeaseTransaction } from '@homzhub/common/src/domain/models/LeaseTransaction';
import { User } from '@homzhub/common/src/domain/models/User';

@JsonObject('AssetStatusInfo')
export class AssetStatusInfo {
  @JsonProperty('tag', LabelColor, true)
  private _tag: LabelColor = new LabelColor();

  @JsonProperty('lease_tenant_info', User, true)
  private _leaseTenantInfo: User = new User();

  @JsonProperty('lease_transaction', LeaseTransaction, true)
  private _leaseTransaction: LeaseTransaction = new LeaseTransaction();

  @JsonProperty('lease_listing_id', Number, true)
  private _leaseListingId: number | null = null;

  @JsonProperty('sale_listing_id', Number, true)
  private _saleListingId: number | null = null;

  get tag(): LabelColor {
    return this._tag;
  }

  get leaseTenantInfo(): User {
    return this._leaseTenantInfo;
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
}
