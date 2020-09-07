import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Links } from '@homzhub/common/src/domain/models/PaginationLinks';

@JsonObject('Notifications')
export class Notifications {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('notification_type', String)
  private _notificationType = '';

  @JsonProperty('title', String)
  private _title = '';

  @JsonProperty('message', String)
  private _message = '';

  @JsonProperty('link', String)
  private _link = '';

  @JsonProperty('created_at', String)
  private _createdAt = '';

  @JsonProperty('is_read', Boolean)
  private _isRead = false;

  get id(): number {
    return this._id;
  }

  get notificationType(): string {
    return this._notificationType;
  }

  get title(): string {
    return this._title;
  }

  get message(): string {
    return this._message;
  }

  get link(): string {
    return this._link;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  get isRead(): boolean {
    return this._isRead;
  }
}

@JsonObject('AssetNotifications')
export class AssetNotifications {
  @JsonProperty('count', Number)
  private _count = 0;

  @JsonProperty('unread_count', Number)
  private _unreadCount = 0;

  @JsonProperty('links', Links)
  private _links: Links = new Links();

  @JsonProperty('results', [Notifications])
  private _results: Notifications[] = [];

  get count(): number {
    return this._count;
  }

  get unreadCount(): number {
    return this._unreadCount;
  }

  get links(): Links {
    return this._links;
  }

  get results(): Notifications[] {
    return this._results;
  }
}
