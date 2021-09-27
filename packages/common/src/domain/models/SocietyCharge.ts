import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { IMaintenance, Maintenance } from '@homzhub/common/src/domain/models/Maintenance';
import { IUser, User } from '@homzhub/common/src/domain/models/User';

export interface ISocietyCharge {
  maintenance: IMaintenance;
  users: IUser[];
}

@JsonObject('SocietyCharge')
export class SocietyCharge {
  @JsonProperty('maintenance', Maintenance)
  private _maintenance = new Maintenance();

  @JsonProperty('users', [User])
  private _users = [];

  get maintenance(): Maintenance {
    return this._maintenance;
  }

  get users(): User[] {
    return this._users;
  }
}
