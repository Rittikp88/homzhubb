import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { LeasePeriod } from '@homzhub/common/src/domain/models/LeaseTransaction';
import { User } from '@homzhub/common/src/domain/models/User';

export interface IList {
  id: number;
  label: string;
  isSelected: boolean;
}

@JsonObject('TenantInfo')
export class TenantInfo {
  @JsonProperty('id', Number, true)
  private _id = 0;

  @JsonProperty('is_invite_accepted', Boolean, true)
  private _isInviteAccepted = true;

  @JsonProperty('lease_tenant_id', Number, true)
  private _leaseTenantId = 0;

  @JsonProperty('lease_unit_id', Number, true)
  private _leaseUnitId = 0;

  @JsonProperty('lease_transaction', LeasePeriod, true)
  private _leaseTransaction: LeasePeriod | null = null;

  @JsonProperty('tenant_user', User, true)
  private _tenantUser: User = new User();

  @JsonProperty('user', User, true)
  private _user: User = new User();

  get isInviteAccepted(): boolean {
    return this._isInviteAccepted;
  }

  get leaseTenantId(): number {
    return this._leaseTenantId;
  }

  get user(): User {
    return this._user;
  }

  get id(): number {
    return this._id;
  }

  get leaseUnitId(): number {
    return this._leaseUnitId;
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
