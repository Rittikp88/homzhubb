import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface IUnit {
  id: number;
  order: number;
  name?: string;
  label: string;
  title?: string;
}

@JsonObject('Unit')
export class Unit {
  @JsonProperty('id', Number, true)
  private _id = -1;

  @JsonProperty('order', Number, true)
  private _order = -1;

  @JsonProperty('name', String, true)
  private _name = '';

  @JsonProperty('label', String, true)
  private _label = '';

  @JsonProperty('title', String, true)
  private _title = '';

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get label(): string {
    return this._label;
  }

  get title(): string {
    return this._title;
  }

  get order(): number {
    return this._order;
  }
}
