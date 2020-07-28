import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Attachment, IAttachment } from '@homzhub/common/src/domain/models/Attachment';

export interface IAmenity {
  id: number;
  name: string;
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
