import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Pillar } from '@homzhub/common/src/domain/models/Pillar';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { TicketActivity } from '@homzhub/common/src/domain/models/TicketActivity';
import { TicketCategory } from '@homzhub/common/src/domain/models/TicketCategory';
import { User } from '@homzhub/common/src/domain/models/User';
import { VisitAssetDetail } from '@homzhub/common/src/domain/models/VisitAssetDetail';
import { ExperienceType } from '@homzhub/common/src/constants/ServiceTickets';

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
  review: Pillar;
}

@JsonObject('Ticket')
export class Ticket {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('ticket_number', String, true)
  private _ticketNumber = '';

  @JsonProperty('ticket_category', Number, true)
  private _ticketCategory = 0;

  @JsonProperty('raised_by', User, true)
  private _raisedBy = new User();

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

  @JsonProperty('closed_on', String, true)
  private _closedAt = '';

  @JsonProperty('updated_at', String, true)
  private _updatedAt = '';

  @JsonProperty('ticket_attachments', [Attachment], true)
  private _ticketAttachments = [] as Attachment[];

  @JsonProperty('lease_transaction', Number, true)
  private _leaseTransaction = null;

  @JsonProperty('activities', [TicketActivity], true)
  private _activities = [];

  @JsonProperty('quote_request_id', Number, true)
  private _quoteRequestId = 0;

  @JsonProperty('review', Pillar, true)
  private _review = new Pillar();

  get id(): number {
    return this._id;
  }

  get ticketNumber(): string {
    return this._ticketNumber;
  }

  get ticketCategory(): number {
    return this._ticketCategory;
  }

  get subCategory(): TicketCategory {
    return this._subCategory;
  }

  get category(): TicketCategory {
    return this._category;
  }

  get raisedBy(): User {
    return this._raisedBy;
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

  get ticketAttachments(): Attachment[] {
    return this._ticketAttachments;
  }

  get othersFieldDescription(): string {
    return this._othersFieldDescription;
  }

  get leaseTransaction(): number | null {
    return this._leaseTransaction;
  }

  get activities(): TicketActivity[] {
    return this._activities;
  }

  get quoteRequestId(): number {
    return this._quoteRequestId;
  }

  get review(): Pillar {
    return this._review;
  }

  get experienceType(): ExperienceType | string {
    if (this.review && this.review.rating) {
      const { rating } = this.review;

      switch (rating) {
        case 1:
          return ExperienceType.UNSATISFIED;
        case 3:
          return ExperienceType.NEUTRAL;
        case 5:
          return ExperienceType.SATISFIED;
        default:
          return ExperienceType.NEUTRAL;
      }
    }
    return '';
  }
}
