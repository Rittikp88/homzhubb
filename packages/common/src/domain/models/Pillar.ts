import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface IPillar {
  id: number;
  name: string;
  max_rating: number;
  rating: number;
}

export enum PillarTypes {
  LISTING_REVIEW = 'LISTING_REVIEW',
}
@JsonObject('PillarName')
export class PillarName {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }
}

@JsonObject('Pillar')
export class Pillar {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String, true)
  private _name = '';

  @JsonProperty('max_rating', Number)
  private _maxRating = 0;

  @JsonProperty('rating', Number, true)
  private _rating = 0;

  @JsonProperty('pillar', PillarName, true)
  private _pillar: PillarName | null = null;

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get maxRating(): number {
    return this._maxRating;
  }

  get rating(): number {
    return this._rating;
  }

  set rating(newRating: number) {
    this._rating = newRating;
  }

  get pillarName(): PillarName | null {
    return this._pillar;
  }
}
