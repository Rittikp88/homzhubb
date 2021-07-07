import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Icon from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { OnFocusCallback } from '@homzhub/common/src/components/atoms/OnFocusCallback';
import { Text } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  sectionTitle: string;
  sectionIcon: string;
  rightText?: string;
  rightTextColor?: string;
  children: React.ReactElement;
  containerStyle?: ViewStyle;
  iconSize?: number;
  callback?: any;
  isAsync?: boolean;
}

const SectionContainer = (props: IProps): React.ReactElement => {
  const {
    sectionTitle,
    sectionIcon,
    rightText,
    children,
    containerStyle,
    rightTextColor,
    iconSize = 22,
    callback,
    isAsync,
  } = props;
  return (
    <View style={[containerStyle && containerStyle]}>
      {callback && <OnFocusCallback isAsync={Boolean(isAsync)} callback={callback} />}
      <View style={styles.headerHolder}>
        <View style={styles.header}>
          <Icon style={styles.icon} name={sectionIcon} size={iconSize} />
          <Text type="small" textType="semiBold">
            {sectionTitle}
          </Text>
        </View>
        {rightText && (
          <Text type="small" textType="semiBold" style={{ ...styles.rightText, color: rightTextColor || undefined }}>
            {rightText}
          </Text>
        )}
      </View>
      <Divider />
      {children}
    </View>
  );
};

export default SectionContainer;

const styles = StyleSheet.create({
  headerHolder: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    marginEnd: 12,
  },
  rightText: {
    marginRight: 16,
  },
});
