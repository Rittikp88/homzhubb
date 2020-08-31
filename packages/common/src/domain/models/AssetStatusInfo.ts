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

  get tag(): LabelColor {
    return this._tag;
  }

  get leaseTenantInfo(): User {
    return this._leaseTenantInfo;
  }

  get leaseTransaction(): LeaseTransaction {
    return this._leaseTransaction;
  }
}
