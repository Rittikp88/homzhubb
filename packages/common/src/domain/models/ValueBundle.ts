import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Attachment, IAttachment } from '@homzhub/common/src/domain/models/Attachment';
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

  @JsonProperty('value_bundle_items', [Unit], true)
  private _valueBundleItems = [new Unit()];

  get attachment(): Attachment {
    return this._attachment;
  }

  get valueBundleItems(): Unit[] {
    return this._valueBundleItems;
  }
}
