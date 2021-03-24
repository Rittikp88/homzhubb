import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';
import { IUser, User } from '@homzhub/common/src/domain/models/User';

export interface IProspectProfile {
  id: number;
  occupants: number;
  tenantType: IUnit;
  user: IUser;
}

@JsonObject('ProspectProfile')
export class ProspectProfile {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('number_of_occupants', Number)
  private _occupants = 0;

  @JsonProperty('user', User)
  private _user = new User();

  @JsonProperty('tenant_type', Unit)
  private _tenantType = new Unit();

  get id(): number {
    return this._id;
  }

  get user(): User {
    return this._user;
  }

  get occupants(): number {
    return this._occupants;
  }

  get tenantType(): Unit {
    return this._tenantType;
  }
}
