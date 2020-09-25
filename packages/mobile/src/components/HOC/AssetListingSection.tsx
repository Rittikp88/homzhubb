import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components';

interface IProps {
  title: string;
  children: React.ReactElement;
}

const AssetListingSection = ({ title, children }: IProps): React.ReactElement => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text type="small" textType="semiBold" style={styles.title}>
          {title}
        </Text>
      </View>
      <View style={styles.contentContainer}>{children}</View>
    </View>
  );
};

const memoizedComponent = React.memo(AssetListingSection);
export { memoizedComponent as AssetListingSection };

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: 4,
  },
  titleContainer: {
    padding: 16,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: theme.colors.moreSeparator,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    color: theme.colors.darkTint3,
  },
});