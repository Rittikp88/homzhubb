import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { TicketCategory } from '@homzhub/common/src/domain/models/TicketCategory';
import { User } from '@homzhub/common/src/domain/models/User';
import { VisitAssetDetail } from '@homzhub/common/src/domain/models/VisitAssetDetail';

// ENUM
export enum TicketStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export enum TicketPriority {
  ALL = 'ALL',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}
// ENUM

export interface ITicket {
  id: number;
  ticket_category: TicketCategory;
  assigned_to: User;
  closed_by: User;
  asset: VisitAssetDetail;
  title: string;
  description?: string;
  status: string;
  priority: string;
  created_at: string;
  closed_at: string;
  updated_at: string;
  category: TicketCategory;
  sub_category: TicketCategory;
  others_field_description: string;
}

@JsonObject('Ticket')
export class Ticket {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('ticket_number', String, true)
  private _ticketNumber = '';

  @JsonProperty('ticket_category', TicketCategory, true)
  private _ticketCategory = new TicketCategory();

  @JsonProperty('sub_category', TicketCategory, true)
  private _subCategory = new TicketCategory();

  @JsonProperty('category', TicketCategory, true)
  private _category = new TicketCategory();

  @JsonProperty('others_field_description', String, true)
  private _othersFieldDescription = '';

  @JsonProperty('assigned_to', User, true)
  private _assignedTo = new User();

  @JsonProperty('closed_by', User, true)
  private _closedBy = new User();

  @JsonProperty('asset', VisitAssetDetail, true)
  private _asset = new VisitAssetDetail();

  @JsonProperty('title', String)
  private _title = '';

  @JsonProperty('description', String)
  private _description = '';

  @JsonProperty('status', String)
  private _status = '';

  @JsonProperty('priority', String)
  private _priority = '';

  @JsonProperty('created_at', String, true)
  private _createdAt = '';

  @JsonProperty('closed_at', String, true)
  private _closedAt = '';

  @JsonProperty('updated_at', String, true)
  private _updatedAt = '';

  get id(): number {
    return this._id;
  }

  get ticketNumber(): string {
    return this._ticketNumber;
  }

  get ticketCategory(): TicketCategory {
    return this._ticketCategory;
  }

  get subCategory(): TicketCategory {
    return this._subCategory;
  }

  get category(): TicketCategory {
    return this._category;
  }

  get othersFieldDescription(): string {
    return this._othersFieldDescription;
  }

  get assignedTo(): User {
    return this._assignedTo;
  }

  get closedBy(): User {
    return this._closedBy;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get status(): TicketStatus {
    return this._status as TicketStatus;
  }

  get priority(): TicketPriority {
    return this._priority as TicketPriority;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  get location(): string {
    return `${this.asset.projectName}-${this.asset.address}`;
  }

  get closedAt(): string {
    return this._closedAt;
  }

  get updatedAt(): string {
    return this._updatedAt;
  }

  get asset(): VisitAssetDetail {
    return this._asset;
  }
}
