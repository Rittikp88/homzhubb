import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface IAttachment {
  id?: number;
  name?: string;
  file_name?: string;
  link?: string;
  is_cover_image?: boolean;
  media_type?: string;
}

@JsonObject('Attachment')
export class Attachment {
  @JsonProperty('id', Number, true)
  private _id = 0;

  @JsonProperty('file_name', String, true)
  private _fileName = '';

  @JsonProperty('name', String, true)
  private _name = '';

  @JsonProperty('link', String, true)
  private _link = '';

  @JsonProperty('is_cover_image', Boolean, true)
  private _isCoverImage = false;

  get id(): number {
    return this._id;
  }

  get fileName(): string {
    return this._fileName;
  }

  get name(): string {
    return this._name;
  }

  get link(): string {
    return this._link;
  }

  get isCoverImage(): boolean {
    return this._isCoverImage;
  }
}
