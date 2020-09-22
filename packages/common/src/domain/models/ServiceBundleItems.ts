import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

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

  @JsonProperty('title', String)
  private _title = '';

  @JsonProperty('category', String)
  private _category = '';

  @JsonProperty('description', String)
  private _description = '';

  @JsonProperty('position', Number)
  private _position = 0;

  @JsonProperty('item_label', String)
  private _itemLabel = '';

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get title(): string {
    return this._title;
  }

  get category(): string {
    return this._category;
  }

  get description(): string {
    return this._description;
  }

  get position(): number {
    return this._position;
  }

  get itemLabel(): string {
    return this._itemLabel;
  }
}
