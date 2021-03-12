import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

@JsonObject('TicketAction')
export class TicketAction {
  @JsonProperty('can_submit_quote', Boolean)
  private _canSubmitQuote = false;

  @JsonProperty('can_approve_quote', Boolean)
  private _canApproveQuote = false;

  @JsonProperty('can_close_ticket', Boolean)
  private _canCloseTicket = false;

  get canSubmitQuote(): boolean {
    return this._canSubmitQuote;
  }

  get canApproveQuote(): boolean {
    return this._canApproveQuote;
  }

  get canCloseTicket(): boolean {
    return this._canCloseTicket;
  }
}
