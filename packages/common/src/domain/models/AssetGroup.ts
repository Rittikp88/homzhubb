import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface ITypeUnit {
  id: number;
  name: string;
}

export interface IAssetGroup extends ITypeUnit {
  space_types: ITypeUnit[];
  asset_types: ITypeUnit[];
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

@JsonObject('AssetGroup')
export class AssetGroup {
  @JsonProperty('id', Number)
  private _id = -1;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('asset_types', [TypeUnit])
  private _assetTypes: TypeUnit[] = [];

  @JsonProperty('space_types', [TypeUnit])
  private _spaceTypes: TypeUnit[] = [];

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get assetTypes(): TypeUnit[] {
    return this._assetTypes;
  }

  get spaceTypes(): TypeUnit[] {
    return this._spaceTypes;
  }
}
