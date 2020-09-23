import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Attachment, IAttachment } from '@homzhub/common/src/domain/models/Attachment';

interface ICategory {
  id: number;
  name: string;
}

export interface IAmenity {
  id: number;
  name: string;
  category: ICategory;
  attachment: IAttachment;
}

@JsonObject('Amenity')
export class Amenity {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('attachment', Attachment)
  private _attachment = new Attachment();

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get attachment(): Attachment {
    return this._attachment;
  }
}

@JsonObject('AssetAmenity')
export class AssetAmenity {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('amenities', [Amenity])
  private _amenities: Amenity[] = [];

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get amenities(): Amenity[] {
    return this._amenities;
  }
}

@JsonObject('AssetGroupAmenity')
export class AssetGroupAmenity {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('category', [AssetAmenity])
  private _category: AssetAmenity[] = [];

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get category(): AssetAmenity[] {
    return this._category;
  }
}
