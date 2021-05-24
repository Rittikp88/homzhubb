import React from 'react';
import { StyleSheet, View } from 'react-native';
import Bell from '@homzhub/common/src/assets/images/bell.svg';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';

// TODO: (Shikha) - Remove hardcoded data after API integration
const ServiceCard = (): React.ReactElement => {
  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <View style={styles.topLeft}>
          <Bell height={36} />
          <View style={styles.heading}>
            <Text type="small" textType="semiBold">
              Professional Photoshoot
            </Text>
            <Badge title="Open" badgeColor={theme.colors.orange} badgeStyle={styles.badge} />
          </View>
        </View>
        <Icon name={icons.verticalDots} color={theme.colors.primaryColor} size={18} />
      </View>
      <View style={styles.attachmentView}>
        <Icon name={icons.gallery} color={theme.colors.primaryColor} size={24} />
        <Text type="small" style={styles.attachmentText}>
          10 Photos
        </Text>
      </View>
      <View style={styles.bottomView}>
        <Label type="large" style={styles.text}>
          ID: HZ32
        </Label>
        <Label type="large" style={styles.text}>
          10.11.2020
        </Label>
      </View>
    </View>
  );
};

export default ServiceCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.lightGrayishBlue,
    padding: 16,
  },
  topView: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heading: {
    marginHorizontal: 12,
  },
  badge: {
    width: '40%',
    marginVertical: 8,
  },
  attachmentView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  attachmentText: {
    color: theme.colors.primaryColor,
    marginHorizontal: 6,
  },
  bottomView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  text: {
    color: theme.colors.darkTint3,
  },
});
