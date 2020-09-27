import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export enum AssetDescriptionDropdownTypes {
  Facing = 'facing',
  FurnishingStatus = 'furnishing_status',
  CarpetUnit = 'carpet_area_unit',
  FlooringType = 'type_of_flooring',
}

// Todo (Sriram: Centralize the duplicated properties)
@JsonObject('FormUnit')
export class FormUnit {
  @JsonProperty('id', Number, true)
  private _id = -1;

  @JsonProperty('name', String, true)
  private _name = '';

  @JsonProperty('label', String)
  private _label = '';

  @JsonProperty('title', String, true)
  private _title = '';

  @JsonProperty('order', Number, true)
  private _order = -1;

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

@JsonObject('AssetDescriptionDropdownValues')
export class AssetDescriptionDropdownValues {
  @JsonProperty('facing', [FormUnit])
  private _facing = [new FormUnit()];

  @JsonProperty('furnishing_status', [FormUnit])
  private _furnishingStatus = [new FormUnit()];

  @JsonProperty('carpet_area_unit', [FormUnit])
  private _carpetAreaUnit = [new FormUnit()];

  @JsonProperty('type_of_flooring', [FormUnit])
  private _typeOfFlooring = [new FormUnit()];

  get facing(): FormUnit[] {
    return this._facing;
  }

  get furnishingStatus(): FormUnit[] {
    return this._furnishingStatus;
  }

  get carpetAreaUnit(): FormUnit[] {
    return this._carpetAreaUnit;
  }

  get typeOfFlooring(): FormUnit[] {
    return this._typeOfFlooring;
  }
}
