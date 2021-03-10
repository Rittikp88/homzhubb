import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { QuoteGroup } from '@homzhub/common/src/domain/models/QuoteGroup';
import { QuoteCategory } from '@homzhub/common/src/domain/models/QuoteCategory';
import { Quote } from '@homzhub/common/src/domain/models/Quote';

@JsonObject('TicketActivityQuote')
export class TicketActivityQuote extends Quote {
  @JsonProperty('quote_request_category', QuoteCategory, true)
  private _quoteRequestCategory = new QuoteCategory();

  @JsonProperty('quote_submit_group', QuoteGroup, true)
  private _quoteSubmitGroup = new QuoteGroup();

  get quoteRequestCategory(): QuoteCategory {
    return this._quoteRequestCategory;
  }

  get quoteSubmitGroup(): QuoteGroup {
    return this._quoteSubmitGroup;
  }
}
