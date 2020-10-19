import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { LeasePeriod } from '@homzhub/common/src/domain/models/LeaseTransaction';
import { User } from '@homzhub/common/src/domain/models/User';

export interface IList {
  id: number;
  label: string;
  isSelected: boolean;
}

@JsonObject('TenantHistory')
export class TenantHistory {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('lease_listing_id', Number, true)
  private _leaseListingId = 0;

  @JsonProperty('lease_transaction', LeasePeriod)
  private _leaseTransaction: LeasePeriod | null = null;

  @JsonProperty('tenant_user', User)
  private _tenantUser: User | null = null;

  get id(): number {
    return this._id;
  }

  get leaseListingId(): number {
    return this._leaseListingId;
  }

  get leaseTransaction(): LeasePeriod | null {
    return this._leaseTransaction;
  }

  get tenantUser(): User | null {
    return this._tenantUser;
  }
}

@JsonObject('TenantPreference')
export class TenantPreference {
  @JsonProperty('id', Number)
  private _id = 1;

  @JsonProperty('name', String)
  private _name = 'Family';

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }
}
