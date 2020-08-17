import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Coordinate } from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { IAmenity, Amenity } from '@homzhub/common/src/domain/models/Amenity';
import { Attachment, IAttachment } from '@homzhub/common/src/domain/models/Attachment';
import { AssetHighlight, IAssetHighlight } from '@homzhub/common/src/domain/models/AssetHighlight';
import { AssetFeature, IAssetFeature } from '@homzhub/common/src/domain/models/AssetFeature';
import { LeaseTerms } from '@homzhub/common/src/domain/models/LeaseTerms';
import { SaleTerms } from '@homzhub/common/src/domain/models/SaleTerms';
import { IUser, User } from '@homzhub/common/src/domain/models/User';
import { IVerifications, Verification } from '@homzhub/common/src/domain/models/Verification';

export interface IAsset {
  id: number;
  project_name: string;
  unit_number: string;
  posted_on: string;
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
  contacts?: IUser;
  verifications: IVerifications;
}

export interface IData {
  id: number;
  name: string;
  count?: number;
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

  @JsonProperty('latitude', Number)
  private _latitude = 0;

  @JsonProperty('longitude', Number)
  private _longitude = 0;

  @JsonProperty('carpet_area_unit', String, true)
  private _carpetAreaUnit: string | null = null;

  @JsonProperty('carpet_area', Number, true)
  private _carpetArea: number | null = null;

  @JsonProperty('posted_on', String, true)
  private _postedOn = '';

  @JsonProperty('description', String, true)
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

  @JsonProperty('lease_listing', LeaseTerms, true)
  private _leaseTerm: LeaseTerms | null = null;

  @JsonProperty('sale_listing', SaleTerms, true)
  private _saleTerm: SaleTerms | null = null;

  @JsonProperty('contacts', User, true)
  private _contacts: User = new User();

  @JsonProperty('verifications', Verification, true)
  private _verifications: Verification = new Verification();

  @JsonProperty('is_favorite', Boolean, true)
  private _isFavorite = false;

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
    return this._latitude;
  }

  get longitude(): number {
    return this._longitude;
  }

  get carpetAreaUnit(): string | null {
    return this._carpetAreaUnit;
  }

  get carpetArea(): number | null {
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

  get leaseTerm(): LeaseTerms | null {
    return this._leaseTerm;
  }

  get saleTerm(): SaleTerms | null {
    return this._saleTerm;
  }

  get contacts(): User {
    return this._contacts;
  }

  get verifications(): Verification {
    return this._verifications;
  }

  get isFavorite(): boolean {
    return this._isFavorite;
  }

  get assetLocation(): Coordinate {
    return {
      longitude: this.longitude,
      latitude: this.latitude,
    };
  }
}
