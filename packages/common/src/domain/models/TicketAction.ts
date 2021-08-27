import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

@JsonObject('TicketAction')
export class TicketAction {
  // Todo (Praharsh) : Check with BE and change if needed.
  @JsonProperty('can_reassign_ticket', Boolean, true)
  private _canReassignTicket = true;

  @JsonProperty('can_submit_quote', Boolean)
  private _canSubmitQuote = false;

  @JsonProperty('can_approve_quote', Boolean)
  private _canApproveQuote = false;

  // Todo (Praharsh) : Check with BE and change if needed.
  @JsonProperty('can_update_work_progress', Boolean, true)
  private _canUpdateWorkProgress = true;

  @JsonProperty('can_close_ticket', Boolean)
  private _canCloseTicket = false;

  get canReassignTicket(): boolean {
    return this._canReassignTicket;
  }

  get canSubmitQuote(): boolean {
    return this._canSubmitQuote;
  }

  get canApproveQuote(): boolean {
    return this._canApproveQuote;
  }

  get canUpdateWorkProgress(): boolean {
    return this._canUpdateWorkProgress;
  }

  get canCloseTicket(): boolean {
    return this._canCloseTicket;
  }
}
