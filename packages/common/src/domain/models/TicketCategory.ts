import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Unit } from '@homzhub/common/src/domain/models/Unit';

@JsonObject('TicketCategory')
export class TicketCategory {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('sub_categories', [Unit])
  private _subCategories = [];

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get subCategories(): Unit[] {
    return this._subCategories;
  }
}
