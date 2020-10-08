import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';

export interface IServiceBundleItems {
  id: number;
  name: string;
  title: string;
  category: string;
  description: string;
  position: number;
  item_label: string;
}

@JsonObject('ServiceBundleItems')
export class ServiceBundleItems {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('display_order', Number)
  private _displayOrder = -1;

  @JsonProperty('label', String)
  private _label = '';

  @JsonProperty('attachment', Attachment)
  private _attachment = new Attachment();

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get displayOrder(): number {
    return this._displayOrder;
  }

  get label(): string {
    return this._label;
  }

  get attachment(): Attachment {
    return this._attachment;
  }
}
