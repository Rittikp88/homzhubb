import React, { ReactElement } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components';

interface IOwnProps {
  title: string;
  subTitle?: string;
  onIconPress?: () => void;
  onClearPress?: () => void;
  containerStyles?: StyleProp<ViewStyle>;
  renderItem?: () => ReactElement;
}

export class HeaderCard extends React.PureComponent<IOwnProps> {
  public render(): ReactElement {
    const { title, onIconPress, containerStyles, onClearPress, subTitle, renderItem } = this.props;

    return (
      <View style={[styles.container, containerStyles]}>
        <View style={styles.headerView}>
          <View style={styles.iconContainer}>
            <Icon
              size={30}
              name={icons.leftArrow}
              color={theme.colors.primaryColor}
              style={styles.iconStyle}
              onPress={onIconPress}
            />
            <Text type="regular" textType="bold">
              {title}
            </Text>
          </View>
          {onClearPress && subTitle ? (
            <TouchableOpacity onPress={onClearPress}>
              <Text type="small" textType="bold" style={styles.clearText}>
                {subTitle}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
        {renderItem && renderItem()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 2,
    backgroundColor: theme.colors.white,
    padding: theme.layout.screenPadding,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    paddingRight: 12,
  },
  clearText: {
    color: theme.colors.primaryColor,
  },
});
