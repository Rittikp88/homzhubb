import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { Unit } from '@homzhub/common/src/domain/models/Unit';

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
