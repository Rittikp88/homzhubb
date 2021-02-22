import React from 'react';
import { Image, Text, View } from 'react-native';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { Message } from '@homzhub/common/src/domain/models/Message';

interface IProps {
  details: Message[];
}

// TODO: Move inline styles and fix lint issues

const MessageCard = (props: IProps): React.ReactElement => {
  const { details } = props;
  const {
    user: { name, id, profilePicture },
    createdAt,
  } = details[0];

  // TODO: take value from user
  const isAssetOwner = id === 2;

  const messageView = (): React.ReactElement | null => {
    // eslint-disable-next-line react/prop-types
    const messages = details.filter((item) => item.message);
    if (messages.length < 1) return null;
    return (
      <>
        <View style={{ flexDirection: isAssetOwner ? 'row-reverse' : 'row' }}>
          {!isAssetOwner && (
            <Avatar isOnlyAvatar fullName={name} image={profilePicture} containerStyle={{ alignSelf: 'flex-end' }} />
          )}
          {messages.map((item, index) => {
            return (
              <View key={index} style={{ flex: 1 }}>
                <View
                  style={{
                    backgroundColor: isAssetOwner ? theme.colors.darkTint5 : theme.colors.background,
                    marginLeft: 8,
                    marginTop: 4,
                    padding: 10,
                    borderRadius: 4,
                    alignSelf: isAssetOwner ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Text style={{ color: isAssetOwner ? theme.colors.white : theme.colors.darkTint3 }}>
                    {item.message}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
        {dateView()}
      </>
    );
  };
  const attachmentView = (): React.ReactElement | null => {
    // eslint-disable-next-line react/prop-types
    const attachments = details.filter((item) => item.attachments.length > 0);
    if (attachments.length < 1) return null;
    return (
      <>
        <View style={{ flexDirection: isAssetOwner ? 'row-reverse' : 'row' }}>
          {!isAssetOwner && <Avatar isOnlyAvatar fullName={name} containerStyle={{ alignSelf: 'flex-end' }} />}
          {attachments.map((attachment, index) => {
            return (
              <Image
                key={index}
                source={{ uri: attachment.attachments[0].link }}
                style={{
                  height: 150,
                  width: 250,
                  borderWidth: 4,
                  borderRadius: 6,
                  borderColor: theme.colors.background,
                }}
              />
            );
          })}
        </View>
        {dateView()}
      </>
    );
  };
  const dateView = (): React.ReactElement => {
    return (
      <View
        style={{
          flexDirection: isAssetOwner ? 'row-reverse' : 'row',
          alignItems: 'center',
          marginStart: isAssetOwner ? 0 : 44,
          padding: 8,
          marginBottom: 6,
        }}
      >
        {!isAssetOwner && (
          <>
            <Text style={{ color: theme.colors.darkTint6 }}>{name}</Text>
            <Icon name={icons.roundFilled} color={theme.colors.disabled} size={8} style={{ marginHorizontal: 4 }} />
          </>
        )}
        <Text style={{ color: theme.colors.darkTint6 }}>{DateUtils.getUtcDisplayDate(createdAt, 'LT')}</Text>
      </View>
    );
  };
  return (
    <>
      {messageView()}
      {attachmentView()}
    </>
  );
};

export default MessageCard;
