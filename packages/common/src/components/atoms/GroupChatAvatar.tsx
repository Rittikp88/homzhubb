import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { theme } from '@homzhub/common/src/styles/theme';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { User } from '@homzhub/common/src/domain/models/User';
import { mockUsers } from '@homzhub/common/src/mocks/UserRepositoryMocks';

const MAX_DISPLAY_COUNT_HEADER = 3;
const MAX_DISPLAY_COUNT_CHAT = 2;
const CIRCLE_SIZE_HEADER = 55;
const CIRCLE_SIZE_CHAT = 40;

interface IProps {
  faces: User[];
  isHeader: boolean;
  containerStyle?: ViewStyle;
  onPressAvatar?: () => void;
}

const GroupChatAvatar = (props: IProps): React.ReactElement => {
  // Deserializing data
  const mockFaces = ObjectMapper.deserializeArray(User, mockUsers); // TODO:Praharsh : Remove mock

  const { faces = mockFaces, isHeader = true, containerStyle = {}, onPressAvatar = (): void => {} } = props;
  const faceDisplayCount = isHeader ? MAX_DISPLAY_COUNT_HEADER : MAX_DISPLAY_COUNT_CHAT;
  const shouldShowOverflow = faces.length > faceDisplayCount;
  const overflow = faces.length - faceDisplayCount;
  const facesToShow = faces
    .sort((a: User, b: User) => a.firstName.localeCompare(b.firstName))
    .slice(0, faceDisplayCount);
  const circleSize = isHeader ? CIRCLE_SIZE_HEADER : CIRCLE_SIZE_CHAT;
  const customTextStyleSmaller = (): { fontSize?: number } => ({ ...(!isHeader && { fontSize: circleSize / 2.5 }) });

  const onPress = (): void => {
    if (isHeader) {
      onPressAvatar();
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {facesToShow.map((face: User) => {
        const isFirst = facesToShow.indexOf(face) === 0;
        const index = facesToShow.indexOf(face);
        const { name, profilePicture } = face;

        // To lift item up on chat head
        const liftUp = (): { marginBottom: number } => {
          const shift = isHeader ? (circleSize / 2) * index : circleSize * index + 5;
          return { marginBottom: isHeader ? 0 : shift };
        };

        const returnStyle = (): ViewStyle =>
          !isFirst
            ? { marginLeft: isHeader ? -16 : -circleSize / 3.5, ...liftUp() }
            : { marginRight: isHeader ? 0 : -14 };

        return (
          <TouchableOpacity key={index} onPress={onPress} style={{ ...(isFirst && !isHeader && { zIndex: 10 }) }}>
            <Avatar
              isOnlyAvatar
              containerStyle={returnStyle()}
              imageSize={circleSize}
              fullName={name}
              image={profilePicture || undefined}
              customTextStyle={customTextStyleSmaller()}
            />
          </TouchableOpacity>
        );
      })}
      {shouldShowOverflow && (
        <Avatar
          isOnlyAvatar
          containerStyle={{
            marginLeft: isHeader ? -16 : -circleSize / 1.5,
            ...(!isHeader && { marginBottom: -4, zIndex: 10 }),
          }}
          imageSize={circleSize}
          customText={`+${overflow.toString()}`}
          initialsContainerStyle={{ backgroundColor: theme.colors.background }}
          customTextStyle={customTextStyleSmaller()}
        />
      )}
    </View>
  );
};

export default React.memo(GroupChatAvatar);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
