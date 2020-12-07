import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { ContactActions } from '@homzhub/common/src/domain/models/Search';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  fullName: string;
  designation: string;
  phoneNumber: string;
  image?: string;
  onContactTypeClicked: (type: ContactActions, phoneNumber: string, message: string) => void;
}

const OPTIONS = [
  { icon: icons.whatsapp, id: ContactActions.WHATSAPP },
  { icon: icons.phone, id: ContactActions.CALL },
  { icon: icons.envelope, id: ContactActions.MAIL },
];

const ContactPerson = (props: IProps): React.ReactElement => {
  const { fullName, designation, phoneNumber, onContactTypeClicked, image } = props;
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  return (
    <View style={styles.container}>
      <Avatar fullName={fullName} designation={designation} image={image} />
      <View style={styles.iconContainer}>
        {OPTIONS.map((item, index: number) => {
          const { icon, id } = item;
          let conditionalStyle = {};

          if (index === 1) {
            conditionalStyle = { marginHorizontal: 12 };
          }

          const onPress = (): void => {
            if (id === ContactActions.CALL) {
              onContactTypeClicked(ContactActions.CALL, phoneNumber, '');
              return;
            }

            if (id === ContactActions.WHATSAPP) {
              onContactTypeClicked(ContactActions.WHATSAPP, phoneNumber, t('whatsappMessage', { fullName }));
              return;
            }

            onContactTypeClicked(ContactActions.MAIL, '', '');
          };

          return (
            <TouchableOpacity
              key={id}
              style={[
                styles.iconButton,
                PlatformUtils.isMobile() ? conditionalStyle : isMobile && styles.iconButtonMobile,
              ]}
              onPress={onPress}
              testID="to"
            >
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
    padding: PlatformUtils.isWeb() ? 0 : 16,
    shadowColor: theme.colors.darkTint7,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    marginLeft: 24,
    borderRadius: 4,
  },
  iconButtonMobile: {
    marginLeft: 12,
  },
});

const memoizedComponent = React.memo(ContactPerson);
export { memoizedComponent as ContactPerson };
