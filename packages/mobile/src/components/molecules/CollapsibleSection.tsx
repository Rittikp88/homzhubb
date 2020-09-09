import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import Collapsible from 'react-native-collapsible';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider, Text } from '@homzhub/common/src/components';

interface ICollapsibleSectionProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  onCollapse?: (isCollapsed: boolean) => void;
  isDividerRequired?: boolean;
  titleStyle?: StyleProp<ViewStyle>;
  initialCollapsedValue?: boolean;
}
const CollapsibleSection = (props: ICollapsibleSectionProps): React.ReactElement => {
  const {
    title,
    children,
    initialCollapsedValue = false,
    icon,
    titleStyle,
    isDividerRequired = false,
    onCollapse,
  } = props;
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsedValue);

  const onPress = (): void => {
    setIsCollapsed(!isCollapsed);
    if (onCollapse) {
      onCollapse(!isCollapsed);
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.ratingsHeading} onPress={onPress} testID="collapse">
        <View style={styles.leftView}>
          {icon && <Icon name={icon} size={22} color={theme.colors.darkTint4} />}
          <Text type="small" textType="semiBold" style={[styles.textColor, titleStyle]}>
            {title}
          </Text>
        </View>
        <Icon name={isCollapsed ? icons.plus : icons.minus} size={20} color={theme.colors.darkTint4} />
      </TouchableOpacity>
      <Collapsible collapsed={isCollapsed}>{children}</Collapsible>
      {isDividerRequired && <Divider containerStyles={styles.divider} />}
    </>
  );
};

const styles = StyleSheet.create({
  divider: {
    marginTop: 24,
  },
  leftView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textColor: {
    color: theme.colors.darkTint4,
  },
  ratingsHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
});

const memoizedComponent = React.memo(CollapsibleSection);
export { memoizedComponent as CollapsibleSection };
