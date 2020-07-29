import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';

interface IProps {
  fullName: string;
  designation: string;
}

const ContactPerson = (props: IProps): React.ReactElement => {
  const { fullName, designation } = props;
  return (
    <View style={styles.container}>
      <Avatar fullName={fullName} designation={designation} />
      <View style={styles.iconContainer}>
        {[icons.whatsapp, icons.phone, icons.envelope].map((icon: string, index: number) => {
          let conditionalStyle = {};

          if (index === 1) {
            conditionalStyle = { marginHorizontal: 12 };
          }

          return (
            <TouchableOpacity key={icon} style={[styles.iconButton, conditionalStyle]}>
              <Icon name={icon} size={24} color={theme.colors.primaryColor} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    padding: 16,
    backgroundColor: theme.colors.background,
    borderRadius: 4,
  },
});

const memoizedComponent = React.memo(ContactPerson);
export { memoizedComponent as ContactPerson };
