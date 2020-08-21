import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Collapsible from 'react-native-collapsible';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider, Text } from '@homzhub/common/src/components';

interface ICollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  initialCollapsedValue?: boolean;
}
const CollapsibleSection = (props: ICollapsibleSectionProps): React.ReactElement => {
  const { title, children, initialCollapsedValue = false } = props;
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsedValue);

  const onPress = (): void => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <TouchableOpacity style={styles.ratingsHeading} onPress={onPress} testID="collapse">
        <Text type="small" textType="semiBold" style={styles.textColor}>
          {title}
        </Text>
        <Icon name={isCollapsed ? icons.plus : icons.minus} size={20} color={theme.colors.darkTint4} />
      </TouchableOpacity>
      <Collapsible collapsed={isCollapsed}>{children}</Collapsible>
      <Divider containerStyles={styles.divider} />
    </>
  );
};

const styles = StyleSheet.create({
  divider: {
    marginTop: 24,
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
