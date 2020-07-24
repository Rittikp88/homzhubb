import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface IAssetReview {
  id: number;
  rating: number;
  experience_area: string;
}

@JsonObject('AssetReview')
export class AssetReview {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('rating', Number)
  private _rating = 0;

  @JsonProperty('experience_area', String)
  private _experienceArea = '';

  get id(): number {
    return this._id;
  }

  get rating(): number {
    return this._rating;
  }

  get experienceArea(): string {
    return this._experienceArea;
  }
}
