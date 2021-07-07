import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Amount } from '@homzhub/common/src/domain/models/Amount';
import { DueItem } from '@homzhub/common/src/domain/models/DueItem';

@JsonObject('Dues')
export class Dues {
  @JsonProperty('total', Amount)
  private _total = new Amount();

  @JsonProperty('line_items', [DueItem])
  private _dueItems = [];

  get total(): Amount {
    return this._total;
  }

  get dueItems(): DueItem[] {
    return this._dueItems;
  }
}
