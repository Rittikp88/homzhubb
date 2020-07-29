import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  fullName: string;
  designation: string;
}

const Avatar = (props: IProps): React.ReactElement => {
  const { fullName, designation } = props;

  return (
    <>
      <View style={styles.initialsContainer}>
        <Text type="small" textType="regular" style={styles.initials}>
          {StringUtils.getInitials(fullName)}
        </Text>
      </View>
      <View style={styles.nameContainer}>
        <Label textType="regular" type="large">
          {fullName}
        </Label>
        <Label textType="regular" type="regular" style={styles.designation}>
          {designation}
        </Label>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  initialsContainer: {
    width: 42,
    height: 42,
    borderRadius: 42 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.darkTint6,
  },
  designation: {
    color: theme.colors.darkTint5,
    marginTop: 2,
  },
  initials: {
    color: theme.colors.white,
  },
  nameContainer: {
    marginHorizontal: 12,
  },
});

const memoizedComponent = React.memo(Avatar);
export { memoizedComponent as Avatar };
