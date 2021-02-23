import React from 'react';
import { FlexStyle, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
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
}

type getStyles = (circleSize?: number, isHeader?: boolean, isFirst?: boolean, index?: number) => IScreenStyles;

const GroupChatAvatar = (props: IProps): React.ReactElement => {
  // Deserializing data
  const mockFaces = ObjectMapper.deserializeArray(User, mockUsers); // TODO:Praharsh : Remove mock
  const styles = getStyles();
  const { faces = mockFaces, isHeader = true, containerStyle = {} } = props;
  const faceDisplayCount = isHeader ? MAX_DISPLAY_COUNT_HEADER : MAX_DISPLAY_COUNT_CHAT;
  const shouldShowOverflow = faces.length > faceDisplayCount;
  const overflow = faces.length - faceDisplayCount;
  const facesToShow = faces
    .sort((a: User, b: User) => a.firstName.localeCompare(b.firstName))
    .slice(0, faceDisplayCount);
  const circleSize = isHeader ? CIRCLE_SIZE_HEADER : CIRCLE_SIZE_CHAT;

  const ExtraCount = (): React.ReactElement | null => {
    const customStyle = getStyles(circleSize, isHeader);
    if (shouldShowOverflow) {
      return (
        <Avatar
          isOnlyAvatar
          containerStyle={customStyle.extraCountContainer}
          imageSize={circleSize}
          customText={`+${overflow.toString()}`}
          initialsContainerStyle={customStyle.initialsContainerStyle}
          customTextStyle={customStyle.customText}
        />
      );
    }
    return null;
  };

  const Faces = (): React.ReactElement => {
    return (
      <>
        {facesToShow.map((face: User) => {
          const isFirst = facesToShow.indexOf(face) === 0;
          const index = facesToShow.indexOf(face);
          const { name, profilePicture } = face;
          const faceStyle = getStyles(circleSize, isHeader, isFirst, index);
          return (
            <Avatar
              key={index}
              isOnlyAvatar
              containerStyle={faceStyle.imageAvatarContainer}
              imageSize={circleSize}
              fullName={name}
              image={profilePicture || undefined}
              customTextStyle={faceStyle.customText}
            />
          );
        })}
      </>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Faces />
      <ExtraCount />
    </View>
  );
};

export default React.memo(GroupChatAvatar);

interface IScreenStyles {
  container: FlexStyle;
  initialsContainerStyle: ViewStyle;
  extraCount: ViewStyle;
  imageAvatarContainer: ViewStyle;
  customText: TextStyle;
  extraCountContainer: ViewStyle;
}

const getStyles: getStyles = (circleSize = CIRCLE_SIZE_HEADER, isHeader = true, isFirst = false, index = 0) => {
  // To lift item up on chat head
  const liftUp = (): { marginBottom: number } => {
    const shift = isHeader ? (circleSize / 2) * index : circleSize * index + 7;
    return { marginBottom: isHeader ? 0 : shift };
  };

  const imageAvatarContainerStyle = (): ViewStyle =>
    !isFirst
      ? { marginLeft: -circleSize / 3.5, ...liftUp() }
      : { marginRight: isHeader ? 0 : -circleSize / 3, zIndex: isHeader ? 0 : 10 };

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    initialsContainerStyle: {
      backgroundColor: theme.colors.background,
    },
    extraCount: {
      marginBottom: -4,
      zIndex: 10,
    },
    imageAvatarContainer: { ...imageAvatarContainerStyle() },
    customText: {
      ...(!isHeader && { fontSize: circleSize / 2.5 }),
    },
    extraCountContainer: {
      marginLeft: isHeader ? -circleSize / 3.5 : -circleSize / 1.5,
      zIndex: isHeader ? 0 : 10,
    },
  });
};
