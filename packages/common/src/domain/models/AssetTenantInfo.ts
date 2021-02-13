import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { User } from '@homzhub/common/src/domain/models/User';

@JsonObject('AssetTenantInfo')
export class AssetTenantInfo {
  @JsonProperty('is_invite_accepted', Boolean, true)
  private _isInviteAccepted = true;

  @JsonProperty('lease_tenant_id', Number, true)
  private _leaseTenantId = 1;

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
}
