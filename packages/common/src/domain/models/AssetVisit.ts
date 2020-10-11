import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { IUser, User, UserRole } from '@homzhub/common/src/domain/models/User';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';
import { VisitStatus, VisitType } from '@homzhub/common/src/domain/repositories/interfaces';

export enum VisitActions {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  CANCEL = 'CANCEL',
}

export enum VisitStatusType {
  UPCOMING = 'upcoming',
  MISSED = 'missed',
  COMPLETED = 'completed',
}

export interface ISlotItem {
  id: number;
  from: number;
  to: number;
  icon: string;
  formatted: string;
}

export interface IVisitActions {
  title: string;
  color: string;
  icon?: string;
  action?: (id: number) => void;
}

export interface IVisitByKey {
  key: string;
  results: AssetVisit[];
  totalVisits: number;
}

interface IVisitAssetDetail {
  id: number;
  project_name: string;
  address: string;
}

export interface IAssetVisit {
  id: number;
  visit_type: string;
  lead_type: IUnit;
  start_date: string;
  end_date: string;
  comments: string;
  sale_listing: number | null;
  lease_listing: number | null;
  status: VisitStatus;
  user: IUser;
  role: UserRole;
  asset: IVisitAssetDetail;
  actions: string[];
  created_at: string;
}

@JsonObject('UpcomingSlot')
export class UpcomingSlot {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('visit_type', String)
  private _visit_type = '';

  @JsonProperty('start_date', String)
  private _start_date = '';

  @JsonProperty('end_date', String)
  private _end_date = '';

  get id(): number {
    return this._id;
  }

  get visit_type(): string {
    return this._visit_type;
  }

  get start_date(): string {
    return this._start_date;
  }

  get end_date(): string {
    return this._end_date;
  }
}

@JsonObject('VisitAssetDetail')
export class VisitAssetDetail {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('project_name', String)
  private _projectName = '';

  @JsonProperty('address', String)
  private _address = '';

  get id(): number {
    return this._id;
  }

  get projectName(): string {
    return this._projectName;
  }

  get address(): string {
    return this._address;
  }
}

@JsonObject('AssetVisit')
export class AssetVisit {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('visit_type', String)
  private _visitType = '';

  @JsonProperty('start_date', String)
  private _startDate = '';

  @JsonProperty('end_date', String)
  private _endDate = '';

  @JsonProperty('lead_type', Unit, true)
  private _leadType = new Unit();

  @JsonProperty('comments', String)
  private _comments = '';

  @JsonProperty('sale_listing', Number, true)
  private _saleListing = -1;

  @JsonProperty('lease_listing', Number, true)
  private _leaseListing = -1;

  @JsonProperty('status', String)
  private _status = '';

  @JsonProperty('user', User)
  private _user = new User();

  @JsonProperty('role', String)
  private _role = '';

  @JsonProperty('created_at', String)
  private _createdAt = '';

  @JsonProperty('actions', [String])
  private _actions = [];

  @JsonProperty('asset', VisitAssetDetail)
  private _asset = new VisitAssetDetail();

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

  get leadType(): Unit {
    return this._leadType;
  }

  get comments(): string {
    return this._comments;
  }

  get saleListing(): number {
    return this._saleListing;
  }

  get leaseListing(): number {
    return this._leaseListing;
  }

  get status(): string {
    return this._status;
  }

  get user(): User {
    return this._user;
  }

  get role(): UserRole {
    return this._role as UserRole;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  get actions(): VisitActions[] {
    return this._actions as VisitActions[];
  }

  get asset(): VisitAssetDetail {
    return this._asset;
  }
}
