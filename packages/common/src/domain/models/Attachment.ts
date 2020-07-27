import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface IAttachment {
  id: number;
  name: string;
  link: string;
  attachment_type: string;
  mime_type: string;
  is_cover_image: boolean;
}

@JsonObject('Attachment')
export class Attachment {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('link', String)
  private _link = '';

  @JsonProperty('attachment_type', String)
  private _attachmentType = '';

  @JsonProperty('mime_type', String)
  private _mime_type = '';

  @JsonProperty('is_cover_image', Boolean)
  private _isCoverImage = false;

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get link(): string {
    return this._link;
  }

  get attachmentType(): string {
    return this._attachmentType;
  }

  get mime_type(): string {
    return this._mime_type;
  }

  get isCoverImage(): boolean {
    return this._isCoverImage;
  }
}
