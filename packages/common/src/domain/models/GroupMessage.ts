import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
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

    return userNames.sort().join(',');
  }

  get getDate(): string {
    const currentDate = new Date();
    const lastMessageDate = new Date(this.lastMessage);

    const millisecondDifference = Math.abs(currentDate.getTime() - lastMessageDate.getTime());
    const hoursDifference = millisecondDifference / 36e5;
    const dayDifference = Math.ceil(millisecondDifference / (1000 * 60 * 60 * 24));

    const isFewMomentAgo = hoursDifference < 1;
    const isMoreThanAHour = hoursDifference > 1 && dayDifference <= 1;
    const isLessThanAWeek = dayDifference > 1 && dayDifference <= 7;

    if (isFewMomentAgo) {
      return I18nService.t('assetMore:fewMomentAgo');
    }
    if (isMoreThanAHour) {
      return dayDifference.toString();
    }
    if (isLessThanAWeek) {
      return I18nService.t('assetMore:daysAgo', { day: dayDifference });
    }

    return DateUtils.getDayMonth(lastMessageDate.toString());
  }
}
