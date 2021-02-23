import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { User } from '@homzhub/common/src/domain/models/User';

@JsonObject('GroupMessage')
export class GroupMessage {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('users', [User])
  private _users = [];

  @JsonProperty('last_message_at', String, true)
  private _lastMessage = '';

  @JsonProperty('unread_count', Number)
  private _unreadCount = 0;

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get users(): User[] {
    return this._users;
  }

  get lastMessage(): string {
    return this._lastMessage;
  }

  get unreadCount(): number {
    return this._unreadCount;
  }

  get getAlphabeticalSortedUserNames(): string {
    const userNames: string[] = [];
    this.users.forEach((user: User) => {
      const { firstName, lastName } = user;
      const name = `${firstName} ${lastName}`;

      userNames.push(name);
    });

    return userNames.sort().join(', ');
  }

  get getDate(): string {
    return DateUtils.getDateDifferenceMessage(this.lastMessage);
  }
}