import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

@JsonObject('Onboarding')
export class Onboarding {
  @JsonProperty('title', String)
  private _title = '';

  @JsonProperty('description', String)
  private _description = '';

  @JsonProperty('image_url', String)
  private _image_url = '';

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get image_url(): string {
    return this._image_url;
  }
}
