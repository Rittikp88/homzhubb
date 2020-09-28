import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';

export interface ITypeUnit {
  id: number;
  name: string;
}

export interface IAssetGroup extends ITypeUnit {
  space_types: SpaceType[];
  asset_types: ITypeUnit[];
}

export enum SpaceFieldTypes {
  Counter = 'COUNTER',
  CheckBox = 'CHECKBOX',
  TextBox = 'TEXTBOX',
}

export interface ISpaceCount {
  space_type: number;
  count: number;
  description?: string;
}

@JsonObject('TypeUnit')
export class TypeUnit {
  @JsonProperty('id', Number)
  private _id = -1;

  @JsonProperty('name', String)
  private _name = '';

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }
}

@JsonObject('SpaceType')
export class SpaceType extends TypeUnit {
  @JsonProperty('field_type', String)
  private _fieldType = '';

  @JsonProperty('is_primary', Boolean)
  private _isPrimary = false;

  @JsonProperty('is_mandatory', Boolean)
  private _isMandatory = false;

  @JsonProperty('value', Number, true)
  private _value = -1;

  @JsonProperty('attachment', Attachment)
  private _attachment = new Attachment();

  @JsonProperty('count', Number, true)
  private _count = -1;

  get fieldType(): string {
    return this._fieldType;
  }

  get isPrimary(): boolean {
    return this._isPrimary;
  }

  get isMandatory(): boolean {
    return this._isMandatory;
  }

  get attachment(): Attachment {
    return this._attachment;
  }

  get value(): number {
    return this._value;
  }

  set value(value: number) {
    this._value = value;
  }

  get count(): number {
    return this._count;
  }

  get spaceList(): ISpaceCount {
    return {
      space_type: this.id,
      count: this.count,
    };
  }
}

@JsonObject('AssetGroup')
export class AssetGroup {
  @JsonProperty('id', Number)
  private _id = -1;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('asset_types', [TypeUnit])
  private _assetTypes: TypeUnit[] = [];

  @JsonProperty('space_types', [SpaceType])
  private _spaceTypes: SpaceType[] = [];

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get assetTypes(): TypeUnit[] {
    return this._assetTypes;
  }

  get spaceTypes(): SpaceType[] {
    return this._spaceTypes;
  }
}
