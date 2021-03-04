import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { QuoteGroup } from '@homzhub/common/src/domain/models/QuoteGroup';

@JsonObject('QuoteCategory')
export class QuoteCategory {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('quote_submit_group', [QuoteGroup])
  private _quoteSubmitGroup = [];

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get quoteSubmitGroup(): QuoteGroup[] {
    return this._quoteSubmitGroup;
  }
}
