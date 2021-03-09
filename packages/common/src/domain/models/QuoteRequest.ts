import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { QuoteGroup } from '@homzhub/common/src/domain/models/QuoteGroup';

@JsonObject('QuoteRequest')
export class QuoteRequest {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('ticket', Number)
  private _ticket = 0;

  @JsonProperty('ticket_activity', Number)
  private _ticketActivity = 0;

  @JsonProperty('emails', [String])
  private _emails = [];

  @JsonProperty('quote_submit_group', [QuoteGroup])
  private _quoteSubmitGroup = [];

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

  get quoteSubmitGroup(): QuoteGroup[] {
    return this._quoteSubmitGroup;
  }
}
