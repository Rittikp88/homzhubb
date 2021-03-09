import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { User } from '@homzhub/common/src/domain/models/User';

@JsonObject('Comment')
export class Comment {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('comment', String)
  private _comment = '';

  @JsonProperty('commented_by', User)
  private _commentedBy = new User();

  @JsonProperty('posted_at', String)
  private _postedAt = '';

  @JsonProperty('modified_at', String)
  private _modifiedAt = '';

  @JsonProperty('can_edit', String)
  private _canEdit = '';

  @JsonProperty('can_delete', String)
  private _canDelete = '';

  get id(): number {
    return this._id;
  }

  get comment(): string {
    return this._comment;
  }

  get commentedBy(): User {
    return this._commentedBy;
  }

  get postedAt(): string {
    return this._postedAt;
  }

  get modifiedAt(): string {
    return this._modifiedAt;
  }

  get canEdit(): string {
    return this._canEdit;
  }

  get canDelete(): string {
    return this._canDelete;
  }
}
