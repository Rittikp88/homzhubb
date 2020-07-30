import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinkingService } from '@homzhub/mobile/src/services/LinkingService';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';

interface IProps {
  fullName: string;
  designation: string;
  phoneNumber: string;
  onMailClicked: () => void;
}

enum Actions {
  WHATSAPP = 'WHATSAPP',
  CALL = 'CALL',
  MAIL = 'MAIL',
}

const OPTIONS = [
  { icon: icons.whatsapp, id: Actions.WHATSAPP },
  { icon: icons.phone, id: Actions.CALL },
  { icon: icons.envelope, id: Actions.MAIL },
];

const ContactPerson = (props: IProps): React.ReactElement => {
  const { fullName, designation, phoneNumber, onMailClicked } = props;
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Avatar fullName={fullName} designation={designation} />
      <View style={styles.iconContainer}>
        {OPTIONS.map((item, index: number) => {
          const { icon, id } = item;
          let conditionalStyle = {};

          if (index === 1) {
            conditionalStyle = { marginHorizontal: 12 };
          }

          const onPress = async (): Promise<void> => {
            if (id === Actions.CALL) {
              await LinkingService.openDialer(phoneNumber);
              return;
            }

            if (id === Actions.WHATSAPP) {
              await LinkingService.whatsappMessage(phoneNumber, t('whatsappMessage', { fullName }));
              return;
            }

            onMailClicked();
          };

          return (
            <TouchableOpacity key={id} style={[styles.iconButton, conditionalStyle]} onPress={onPress}>
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
    justifyContent: 'space-between',
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
