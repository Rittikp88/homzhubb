import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface IAttachment {
  id?: number;
  name?: string;
  file_name?: string;
  link?: string;
  is_cover_image?: boolean;
  media_type?: string;
  media_attributes: IMediaAttributes;
}

export interface IMediaAttributes {
  title: string;
  duration: string;
  video_id: string;
  thumbnail: string;
  thumbnail_hd: string;
  thumbnail_sd: string;
}

@JsonObject('MediaAttributes')
export class MediaAttributes {
  @JsonProperty('title', String, true)
  private _title = '';

  @JsonProperty('duration', String, true)
  private _duration = '';

  @JsonProperty('video_id', String, true)
  private _videoId = '';

  @JsonProperty('thumbnail', String, true)
  private _thumbnail = '';

  @JsonProperty('thumbnail_hd', String, true)
  private _thumbnailHD = '';

  @JsonProperty('thumbnail_sd', String, true)
  private _thumbnailSD = '';

  get title(): string {
    return this._title;
  }

  get duration(): string {
    return this._duration;
  }

  get videoId(): string {
    return this._videoId;
  }

  get thumbnail(): string {
    return this._thumbnail;
  }

  get thumbnailHD(): string {
    return this._thumbnailHD;
  }

  get thumbnailSD(): string {
    return this._thumbnailSD;
  }
}

// TODO: Ask backend to not send the object if not media_attributes present
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

  @JsonProperty('media_type', String, true)
  private _mediaType = 'IMAGE';

  @JsonProperty('is_cover_image', Boolean, true)
  private _isCoverImage = false;

  @JsonProperty('media_attributes', MediaAttributes, true)
  private _mediaAttributes: MediaAttributes = new MediaAttributes();

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

  get mediaType(): string {
    return this._mediaType;
  }

  get isCoverImage(): boolean {
    return this._isCoverImage;
  }

  get mediaAttributes(): MediaAttributes {
    return this._mediaAttributes;
  }
}
