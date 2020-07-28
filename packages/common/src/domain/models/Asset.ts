import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { IAmenity, Amenity } from '@homzhub/common/src/domain/models/Amenity';
import { Attachment, IAttachment } from '@homzhub/common/src/domain/models/Attachment';
import { AssetHighlight, IAssetHighlight } from '@homzhub/common/src/domain/models/AssetHighlight';
import { AssetFeature, IAssetFeature } from '@homzhub/common/src/domain/models/AssetFeature';
import { LeaseTerms } from '@homzhub/common/src/domain/models/LeaseTerms';
import { SaleTerms } from '@homzhub/common/src/domain/models/SaleTerms';

export interface IAsset {
  project_name: string;
  unit_number: string;
  posted_on: string;
  available_from: string;
  description: string;
  block_number: string;
  latitude: string;
  longitude: string;
  carpet_area: string;
  carpet_area_unit: string;
  floor_number: number;
  total_floors: number;
  asset_type: IData;
  asset_group: IData;
  spaces: IData[];
  amenities: IAmenity[];
  attachments: IAttachment[];
  highlights: IAssetHighlight[];
  features: IAssetFeature[];
}

export interface IData {
  id: number;
  name: string;
  count: number;
}

@JsonObject('Data')
class Data {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('count', Number, true)
  private _count = 0;

  get id(): number {
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

  @JsonProperty('posted_on', String)
  private _postedOn = '';

  @JsonProperty('available_from', String)
  private _availableFrom = '';

  @JsonProperty('description', String)
  private _description = '';

  @JsonProperty('floor_number', Number)
  private _floorNumber = 0;

  @JsonProperty('total_floors', Number)
  private _totalFloors = 0;

  @JsonProperty('attachments', [Attachment], true)
  private _attachments: Attachment[] = [];

  @JsonProperty('highlights', [AssetHighlight], true)
  private _highlights: AssetHighlight[] = [];

  @JsonProperty('features', [AssetFeature], true)
  private _features: AssetFeature[] = [];

  @JsonProperty('spaces', [Data], true)
  private _spaces: Data[] = [];

  @JsonProperty('amenities', [Amenity], true)
  private _amenities: Amenity[] = [];

  @JsonProperty('asset_type', Data, true)
  private _assetType: Data = new Data();

  @JsonProperty('asset_group', Data, true)
  private _assetGroup: Data = new Data();

  @JsonProperty('lease_term', LeaseTerms, true)
  private _leaseTerm: LeaseTerms = new LeaseTerms();

  @JsonProperty('sale_term', SaleTerms, true)
  private _saleTerm: SaleTerms = new SaleTerms();

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

  get floorNumber(): number {
    return this._floorNumber;
  }

  get totalFloors(): number {
    return this._totalFloors;
  }

  get id(): number {
    return this._id;
  }

  get attachments(): Attachment[] {
    return this._attachments;
  }

  get postedOn(): string {
    return this._postedOn;
  }

  get availableFrom(): string {
    return this._availableFrom;
  }

  get description(): string {
    return this._description;
  }

  get highlights(): AssetHighlight[] {
    return this._highlights;
  }

  get features(): AssetFeature[] {
    return this._features;
  }

  get spaces(): Data[] {
    return this._spaces;
  }

  get amenities(): Amenity[] {
    return this._amenities;
  }

  get assetType(): Data {
    return this._assetType;
  }

  get assetGroup(): Data {
    return this._assetGroup;
  }

  get leaseTerm(): LeaseTerms {
    return this._leaseTerm;
  }

  get saleTerm(): SaleTerms {
    return this._saleTerm;
  }
}
