import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Quote } from '@homzhub/common/src/domain/models/Quote';
import { User } from '@homzhub/common/src/domain/models/User';

@JsonObject('QuoteGroup')
export class QuoteGroup {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('user', User)
  private _user = new User();

  @JsonProperty('role', String)
  private _role = '';

  @JsonProperty('comment', String)
  private _comment = '';

  @JsonProperty('quotes', [Quote])
  private _quotes = [];

  get id(): number {
    return this._id;
  }

  get user(): User {
    return this._user;
  }

  get role(): string {
    return this._role;
  }

  get comment(): string {
    return this._comment;
  }

  get quotes(): Quote[] {
    return this._quotes;
  }
}
