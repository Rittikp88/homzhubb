import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Image } from '@homzhub/common/src/domain/models/Image';

export interface IAsset {
  project_name: string;
  unit_number: string;
  block_number: string;
  latitude: string;
  longitude: string;
  carpet_area: string;
  carpet_area_unit: string;
  floor_number: number;
  total_floors: number;
  asset_type: number;
}

@JsonObject('Data')
class Data {
  @JsonProperty('id', String)
  private _id = '';

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('count', Number, true)
  private _count = 0;

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get count(): number {
    return this._count;
  }
}

@JsonObject('Asset')
export class Asset {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('project_name', String)
  private _projectName = '';

  @JsonProperty('unit_number', String)
  private _unitNumber = '';

  @JsonProperty('block_number', String)
  private _blockNumber = '';

  @JsonProperty('latitude', String)
  private _latitude = '';

  @JsonProperty('longitude', String)
  private _longitude = '';

  @JsonProperty('carpet_area_unit', String)
  private _carpetAreaUnit = '';

  @JsonProperty('carpet_area', String)
  private _carpetArea = '';

  @JsonProperty('floor_number', Number)
  private _floorNumber = '';

  @JsonProperty('total_floors', Number)
  private _totalFloors = '';

  @JsonProperty('images', [Image], true)
  private _images: Image[] = [];

  @JsonProperty('spaces', [Data], true)
  private _spaces: Data[] = [];

  @JsonProperty('asset_type', Data, true)
  private _assetType: Data = new Data();

  @JsonProperty('asset_group', Data, true)
  private _assetGroup: Data = new Data();

  get projectName(): string {
    return this._projectName;
  }

  get unitNumber(): string {
    return this._unitNumber;
  }

  get blockNumber(): string {
    return this._blockNumber;
  }

  get latitude(): number {
    return Number(this._latitude);
  }

  get longitude(): number {
    return Number(this._longitude);
  }

  get carpetAreaUnit(): string {
    return this._carpetAreaUnit;
  }

  get carpetArea(): string {
    return this._carpetArea;
  }

  get floorNumber(): string {
    return this._floorNumber;
  }

  get totalFloors(): string {
    return this._totalFloors;
  }

  get id(): number {
    return this._id;
  }

  get images(): Image[] {
    return this._images;
  }

  get spaces(): Data[] {
    return this._spaces;
  }

  get assetType(): Data {
    return this._assetType;
  }

  get assetGroup(): Data {
    return this._assetGroup;
  }
}
