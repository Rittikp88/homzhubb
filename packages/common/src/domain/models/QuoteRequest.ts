import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { QuoteCategory } from '@homzhub/common/src/domain/models/QuoteCategory';
import { QuoteGroup } from '@homzhub/common/src/domain/models/QuoteGroup';

@JsonObject('QuoteRequest')
export class QuoteRequest {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('ticket', Number)
  private _ticket = 0;

  @JsonProperty('ticket_activity', Number, true)
  private _ticketActivity = 0;

  @JsonProperty('emails', [String])
  private _emails = [];

  @JsonProperty('quote_submit_groups', [QuoteGroup], true)
  private _quoteSubmitGroups = [];

  @JsonProperty('quote_request_categories', [QuoteCategory], true)
  private _quoteRequestCategories = [];

  get id(): number {
    return this._id;
  }

  get ticket(): number {
    return this._ticket;
  }

  get ticketActivity(): number {
    return this._ticketActivity;
  }

  get emails(): string[] {
    return this._emails;
  }

  get quoteSubmitGroups(): QuoteGroup[] {
    return this._quoteSubmitGroups;
  }

  get quoteRequestCategories(): QuoteCategory[] {
    return this._quoteRequestCategories;
  }
}
