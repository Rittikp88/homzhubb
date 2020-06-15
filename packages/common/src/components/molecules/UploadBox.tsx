import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Icon from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, Text } from '@homzhub/common/src/components';

interface IProps {
  icon: string;
  header: string;
  subHeader: string;
  containerStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  subHeaderStyle?: StyleProp<ViewStyle>;
  iconSize?: number;
  iconColor?: string;
}

export const UploadBox = (props: IProps): React.ReactElement => {
  const { icon, header, subHeader, containerStyle, headerStyle, subHeaderStyle, iconSize, iconColor } = props;
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.icon}>
        <Icon name={icon} size={iconSize ?? 40} color={iconColor ?? theme.colors.primaryColor} />
      </View>
      <View style={styles.headerView}>
        <Text type="small" textType="semiBold" style={[styles.header, headerStyle]}>
          {header}
        </Text>
        <Label type="regular" textType="regular" style={[styles.subHeader, subHeaderStyle]}>
          {subHeader}
        </Label>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.lowPriority,
    borderRadius: 4,
    padding: 8,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    flex: 1,
  },
  headerView: {
    flex: 3,
  },
  header: {
    color: theme.colors.primaryColor,
  },
  subHeader: {
    paddingTop: 8,
    color: theme.colors.darkTint5,
  },
});
