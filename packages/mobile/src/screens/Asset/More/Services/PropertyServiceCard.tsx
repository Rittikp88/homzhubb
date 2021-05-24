import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import { Text, Label } from '@homzhub/common/src/components/atoms/Text';
import PropertyCard from '@homzhub/common/src/components/molecules/PropertyCard';
import ServiceCard from '@homzhub/mobile/src/components/molecules/ServiceCard';

// TODO: (Shikha) - Remove hardcoded data after API integration
const PropertyServiceCard = (): React.ReactElement => {
  const [isExpanded, setIsExpanded] = useState(false);
  const userAsset = useSelector(UserSelector.getUserAssets);

  return (
    <View style={styles.container}>
      <TouchableOpacity disabled={isExpanded} onPress={(): void => setIsExpanded(!isExpanded)}>
        <>
          <TouchableOpacity onPress={(): void => setIsExpanded(!isExpanded)} style={styles.header}>
            <View style={styles.headerLeft}>
              <Badge title="For Rent" badgeColor={theme.colors.red} />
              <Icon name={icons.roundFilled} color={theme.colors.darkTint7} size={10} style={styles.separatorIcon} />
              <Icon name={icons.service} size={16} color={theme.colors.primaryColor} />
              <Label type="large" style={styles.count}>
                1
              </Label>
            </View>
            <Icon name={isExpanded ? icons.upArrow : icons.downArrow} size={16} color={theme.colors.primaryColor} />
          </TouchableOpacity>
          <PropertyCard
            asset={userAsset[0]}
            isExpanded={isExpanded}
            isPriceVisible={false}
            isShieldVisible={false}
            containerStyle={styles.propertyCard}
          />
          {isExpanded && (
            <>
              <Text type="small" textType="semiBold" style={styles.serviceHeading}>
                Services (1)
              </Text>
              <ServiceCard />
            </>
          )}
        </>
      </TouchableOpacity>
    </View>
  );
};

export default PropertyServiceCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  propertyCard: {
    margin: 16,
  },
  serviceHeading: {
    color: theme.colors.darkTint3,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separatorIcon: {
    marginHorizontal: 10,
  },
  count: {
    color: theme.colors.primaryColor,
    marginHorizontal: 4,
  },
});
