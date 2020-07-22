import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

@JsonObject('Image')
export class Image {
  @JsonProperty('file_name', String)
  private _fileName = '';

  @JsonProperty('link', String)
  private _link = '';

  @JsonProperty('is_cover_image', Boolean)
  private _isCoverImage = false;

  get fileName(): string {
    return this._fileName;
  }

  get link(): string {
    return this._link;
  }

  get isCoverImage(): boolean {
    return this._isCoverImage;
  }
}
