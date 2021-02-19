import React from 'react';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Image } from '@homzhub/common/src/components/atoms/Image';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';

interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isAssetOwner: boolean;
}
// TODO: (Shivam: 19/2/21: use model)
interface IChatData {
  id: number;
  name: string;
  users: IUser[];
  lastMessageAt: string;
  unreadCount: number;
}

interface IProps {
  chatData: IChatData;
}

const GroupChat = (props: IProps): React.ReactElement => {
  const {
    chatData: { name, users, lastMessageAt, unreadCount },
  } = props;
  const userNames = getAlphabeticalSortedUserNames(users);
  const date = getDate(lastMessageAt);

  return (
    <>
      <Image source={{ uri: '' }} />
      <>
        <Text>{name}</Text>
        <Text>{date}</Text>
      </>
      <>
        <Text>{userNames}</Text>
        <Text>{unreadCount}</Text>
      </>
    </>
  );
};

// TODO: (shivam: 19/2/21: move logic to model)
const getAlphabeticalSortedUserNames = (users: IUser[]): string => {
  const userNames: string[] = [];
  users.forEach((user: IUser) => {
    const { firstName, lastName } = user;
    const name = `${firstName} ${lastName}`;

    userNames.push(name);
  });

  return userNames.sort().join(',');
};

// TODO: (shivam: 19/2/21: move logic to model)
const getDate = (date: string): string => {
  const currentDate = new Date();
  const lastMessageDate = new Date(date);

  const millisecondDifference = Math.abs(currentDate.getTime() - lastMessageDate.getTime());
  const hoursDifference = millisecondDifference / 36e5;
  const dayDifference = Math.ceil(millisecondDifference / (1000 * 60 * 60 * 24));

  const isFewMomentAgo = hoursDifference < 1;
  const isMoreThanAHour = hoursDifference > 1 && dayDifference <= 1;
  const isLessThanAWeek = dayDifference > 1 && dayDifference <= 7;

  if (isFewMomentAgo) {
    return ' a few moments ago';
  }
  if (isMoreThanAHour) {
    return dayDifference.toString();
  }
  if (isLessThanAWeek) {
    return `${dayDifference} day ago`;
  }

  return DateUtils.getDayMonth(lastMessageDate.toString());
};

export default React.memo(GroupChat);
