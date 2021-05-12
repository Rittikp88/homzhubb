import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Attachment, IAttachment } from '@homzhub/common/src/domain/models/Attachment';
import { ServiceBundleItems } from '@homzhub/common/src/domain/models/ServiceBundleItems';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';

export interface IValueBundle {
  attachment: IAttachment;
  valueBundleItems: IUnit;
  id: number;
  name: string;
  label: string;
}

@JsonObject('ValueBundle')
export class ValueBundle extends Unit {
  @JsonProperty('attachment', Attachment, true)
  private _attachment = new Attachment();

  @JsonProperty('value_bundle_items', [ServiceBundleItems], true)
  private _valueBundleItems = [new ServiceBundleItems()];

  @JsonProperty('display_order', Number, true)
  private _displayOrder = -1;

  get attachment(): Attachment {
    return this._attachment;
  }

  get valueBundleItems(): ServiceBundleItems[] {
    return this._valueBundleItems;
  }

  get displayOrder(): number {
    return this._displayOrder;
  }
}
