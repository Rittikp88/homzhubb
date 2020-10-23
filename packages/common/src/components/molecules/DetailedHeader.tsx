import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import Icon from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text, TextSizeType } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  title?: string;
  subTitle?: string;
  subTitleType?: TextSizeType;
  subTitleColor?: string;
  linkText?: string;
  icon?: string;
  iconColor?: string;
  iconSize?: number;
  onIconPress?: () => void;
  onLinkPress?: () => void;
  headerContainerStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export const DetailedHeader = (props: IProps): React.ReactElement => {
  const {
    title,
    subTitle,
    subTitleType,
    subTitleColor,
    linkText,
    icon,
    iconColor,
    iconSize,
    onIconPress,
    onLinkPress,
    headerContainerStyle,
    testID,
  } = props;
  const isHeaderContentVisible = !!(title || subTitle);
  const customStyle = customizedStyles(subTitleColor, isHeaderContentVisible, icon);

  return (
    <View style={customStyle.mainContainer}>
      <View style={[customStyle.headerContainer, headerContainerStyle]} testID={testID}>
        {icon && (
          <Icon
            name={icon}
            size={iconSize || 22}
            color={iconColor || theme.colors.darkTint4}
            onPress={onIconPress}
            style={styles.iconStyle}
          />
        )}
        {isHeaderContentVisible && (
          <View style={customStyle.headerContent}>
            {title && (
              <Text type="large" textType="semiBold" style={styles.title}>
                {title}
              </Text>
            )}
            <Text
              type={subTitleType || 'small'}
              textType={subTitleType ? 'semiBold' : 'regular'}
              style={customStyle.text}
            >
              {subTitle}{' '}
              <Text type="small" style={styles.linkText} onPress={onLinkPress}>
                {linkText}
              </Text>
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = {
  title: {
    color: theme.colors.dark,
    paddingVertical: 5,
  },
  linkText: {
    color: theme.colors.primaryColor,
  },
  iconStyle: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
};

const customizedStyles = (textColor: string | undefined, isVisible: boolean, icon: string | undefined): any => ({
  text: {
    marginVertical: textColor ? 24 : 6,
    color: textColor || theme.colors.darkTint3,
  },
  headerContent: {
    marginVertical: textColor ? 8 : 16,
    paddingHorizontal: 24,
  },
  headerContainer: {
    flex: icon ? 0 : 1,
    paddingTop: PlatformUtils.isIOS() ? 50 : 30,
    borderBottomColor: theme.colors.disabled,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  mainContainer: {
    flex: icon ? 0 : 1,
    paddingTop: icon ? 0 : 50,
  },
});
