import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface ICoins {
  total_earned: number;
  total_remaining: number;
  total_used: number;
}

@JsonObject('Coins')
export class Coins {
  @JsonProperty('total_earned', Number)
  private _totalEarned = 0;

  @JsonProperty('total_remaining', Number)
  private _totalRemaining = 0;

  @JsonProperty('total_used', Number)
  private _totalUsed = 0;

  get totalEarned(): number {
    return this._totalEarned;
  }

  get totalRemaining(): number {
    return this._totalRemaining;
  }

  get totalUsed(): number {
    return this._totalUsed;
  }
}
