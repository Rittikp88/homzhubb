import React from 'react';
import { Image, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { TimeUtils } from '@homzhub/common/src/utils/TimeUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import Rating from '@homzhub/common/src/components/atoms/Rating';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  fullName: string;
  isOnlyAvatar?: boolean;
  image?: string;
  designation?: string;
  phoneNumber?: string;
  phoneCode?: string;
  rating?: number;
  date?: string;
  isRightIcon?: boolean;
  imageSize?: number;
  onPressCamera?: () => void;
  onPressRightIcon?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  initialsContainerStyle?: StyleProp<ViewStyle>;
}

const Avatar = (props: IProps): React.ReactElement => {
  const {
    fullName,
    designation,
    containerStyle = {},
    phoneNumber,
    rating,
    date,
    isRightIcon = false,
    phoneCode,
    isOnlyAvatar = false,
    image,
    initialsContainerStyle,
    imageSize = 42,
    onPressCamera,
    onPressRightIcon,
  } = props;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.leftView}>
        <>
          {image ? (
            <Image
              source={{
                uri: image,
              }}
              /* eslint-disable-next-line react-native/no-inline-styles */
              style={{
                ...(theme.circleCSS(imageSize) as object),
                borderColor: theme.colors.white,
                borderWidth: 1,
              }}
            />
          ) : (
            <View
              style={[styles.initialsContainer, { ...(theme.circleCSS(imageSize) as object) }, initialsContainerStyle]}
            >
              <Text type="small" textType="regular" style={styles.initials}>
                {StringUtils.getInitials(fullName)}
              </Text>
            </View>
          )}
          {onPressCamera && (
            <TouchableOpacity style={styles.editView} onPress={onPressCamera} activeOpacity={0.8}>
              <Icon name={icons.camera} size={14} color={theme.colors.white} />
            </TouchableOpacity>
          )}
        </>
        {!isOnlyAvatar && (
          <View style={styles.nameContainer}>
            <Label textType="regular" type="large" minimumFontScale={0.5} adjustsFontSizeToFit>
              {fullName}
            </Label>
            <View style={styles.leftView}>
              <Label textType="regular" type="regular" style={styles.designation}>
                {designation}
              </Label>
              {phoneNumber && (
                <View style={styles.numberContainer}>
                  <Icon name={icons.roundFilled} color={theme.colors.disabled} size={12} style={styles.iconStyle} />
                  {!!phoneCode && (
                    <Label textType="regular" type="regular" style={styles.designation}>
                      {`(${phoneCode}) `}
                    </Label>
                  )}
                  <Label textType="regular" type="regular" style={styles.designation}>
                    {phoneNumber}
                  </Label>
                </View>
              )}
              {rating && (
                <View style={styles.numberContainer}>
                  <Icon name={icons.roundFilled} color={theme.colors.disabled} size={10} style={styles.iconStyle} />
                  <Rating count={rating} />
                </View>
              )}
            </View>
          </View>
        )}
      </View>
      {(isRightIcon || date) && (
        <View style={styles.rightView}>
          {isRightIcon && onPressRightIcon && (
            <Icon
              name={icons.rightArrow}
              color={theme.colors.blue}
              size={20}
              style={styles.iconStyle}
              onPress={onPressRightIcon}
            />
          )}
          {date && (
            <Label textType="regular" type="regular" style={styles.designation}>
              {TimeUtils.getLocaltimeDifference(date)}
            </Label>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftView: {
    flexDirection: 'row',
  },
  rightView: {
    flex: 1,
    alignItems: 'flex-end',
  },
  initialsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.darkTint6,
    borderWidth: 1,
    borderColor: theme.colors.white,
  },
  designation: {
    color: theme.colors.darkTint5,
    marginTop: 2,
  },
  initials: {
    color: theme.colors.white,
  },
  nameContainer: {
    marginLeft: 12,
    marginRight: 6,
    width: PlatformUtils.isWeb() ? undefined : theme.viewport.width / 2 - 40,
  },
  numberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    marginTop: 6,
    marginHorizontal: 4,
  },
  editView: {
    ...(theme.circleCSS(26) as object),
    backgroundColor: theme.colors.blue,
    borderColor: theme.colors.white,
    borderWidth: 2,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 60,
    left: 50,
  },
});

const memoizedComponent = React.memo(Avatar);
export { memoizedComponent as Avatar };
