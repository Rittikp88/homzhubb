import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { ITenantInfo, TenantInfo } from '@homzhub/common/src/domain/models/TenantInfo';
import { Unit } from '@homzhub/common/src/domain/models/Unit';

interface IOnGoingTransaction {
  id: number;
  lease_unit: number;
  lease_tenants: ITenantInfo[];
}

@JsonObject('OnGoingTransaction')
export class OnGoingTransaction {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('lease_unit', Unit)
  private _leaseUnit = new Unit();

  @JsonProperty('lease_tenants', [TenantInfo])
  private _leaseTenants = [];

  get id(): number {
    return this._id;
  }

  get leaseUnit(): Unit {
    return this._leaseUnit;
  }

  get leaseTenants(): TenantInfo[] {
    return this._leaseTenants;
  }
}
