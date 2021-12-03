import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Asset, IAsset } from '@homzhub/common/src/domain/models/Asset';
import { VisitActions } from '@homzhub/common/src/domain/models/AssetVisit';
import { IUnit } from '@homzhub/common/src/domain/models/Unit';
import { IUser, User } from '@homzhub/common/src/domain/models/User';
import { VisitStatus, VisitType } from '@homzhub/common/src/domain/repositories/interfaces';

export interface IFFMVisit {
  id: number;
  visit_type: string;
  lead_type: IUnit;
  start_date: string;
  end_date: string;
  status: VisitStatus;
  users: IUser[];
  asset: IAsset;
  actions: string[];
  created_at: string;
  can_submit_feedback: boolean;
  prospect_feedback: any; // TODO: (Shikha) - Update type
  status_updated_by: IUser | null;
}

@JsonObject('FFMVisit')
export class FFMVisit {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('visit_type', String)
  private _visitType = '';

  @JsonProperty('start_date', String)
  private _startDate = '';

  @JsonProperty('end_date', String)
  private _endDate = '';

  @JsonProperty('status', String)
  private _status = '';

  @JsonProperty('users', [User])
  private _users = [];

  @JsonProperty('created_at', String)
  private _createdAt = '';

  @JsonProperty('updated_at', String, true)
  private _updatedAt = '';

  @JsonProperty('can_submit_feedback', Boolean)
  private _canSubmitFeedback = false;

  @JsonProperty('prospect_feedback', Boolean, true)
  private _prospectFeedback = null;

  @JsonProperty('status_updated_by', User, true)
  private _statusUpdatedBy = null;

  @JsonProperty('actions', [String])
  private _actions = [];

  @JsonProperty('asset', Asset)
  private _asset = new Asset();

  @JsonProperty('comments', String, true)
  private _comments = '';

  get id(): number {
    return this._id;
  }

  get visitType(): VisitType {
    return this._visitType as VisitType;
  }

  get startDate(): string {
    return this._startDate;
  }

  get endDate(): string {
    return this._endDate;
  }

  get status(): string {
    return this._status;
  }

  get users(): User[] {
    return this._users;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  get updatedAt(): string {
    return this._updatedAt;
  }

  get canSubmitFeedback(): boolean {
    return this._canSubmitFeedback;
  }

  get prospectFeedback(): null {
    return this._prospectFeedback;
  }

  get statusUpdatedBy(): User | null {
    return this._statusUpdatedBy;
  }

  get actions(): VisitActions[] {
    return this._actions as VisitActions[];
  }

  get asset(): Asset {
    return this._asset;
  }

  get comments(): string {
    return this._comments;
  }
}
