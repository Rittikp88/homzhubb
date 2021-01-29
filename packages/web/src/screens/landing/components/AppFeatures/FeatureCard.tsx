import React, { FC } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import HoveredTickOwner from '@homzhub/common/src/assets/images/hoveredTickOwner.svg';
import TickOwnwer from '@homzhub/common/src/assets/images/tickOwner.svg';
import HoveredTickTenant from '@homzhub/common/src/assets/images/hoveredTickTenant.svg';
import TickTenant from '@homzhub/common/src/assets/images/tickTenant.svg';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Hoverable } from '@homzhub/web/src/components/hoc/Hoverable';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { IFeatureDataProps, OwnerFeatureData, TenantFeatureData } from '@homzhub/common/src/constants/LandingScreen';

interface ICardprops {
  onDataPress: (image: string) => void;
  isOwner: boolean;
}

const FeatureCard: FC<ICardprops> = (props: ICardprops) => {
  const { onDataPress, isOwner } = props;
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const styles = cardStyles(isMobile, isTablet);
  const data = isOwner ? OwnerFeatureData : TenantFeatureData;

  return (
    <View style={[styles.card, !isOwner && styles.cardTenant]}>
      {data.map((item: IFeatureDataProps, index) => {
        const onSelect = (): void => {
          onDataPress(item.image);
        };
        return (
          <View key={index}>
            <Hoverable onHoverIn={onSelect}>
              {(isHovered: boolean): React.ReactNode => (
                <TouchableOpacity onPress={onSelect}>
                  <View style={styles.list}>
                    <View style={styles.textContainer}>
                      <Typography size="regular" style={styles.cardTitle} fontWeight="semiBold">
                        {item.title}
                      </Typography>
                      <Typography size="small" style={styles.cardDescription} fontWeight="regular">
                        {item.description}
                      </Typography>
                    </View>
                    {isHovered && (isOwner ? <HoveredTickOwner /> : <HoveredTickTenant />)}
                    {!isHovered && (isOwner ? <TickOwnwer /> : <TickTenant />)}
                  </View>
                </TouchableOpacity>
              )}
            </Hoverable>

            {index < 3 && <Divider />}
          </View>
        );
      })}
    </View>
  );
};

export default FeatureCard;

interface ICardStyles {
  card: ViewStyle;
  cardTenant: ViewStyle;
  cardTitle: ViewStyle;
  cardDescription: ViewStyle;
  list: ViewStyle;
  textContainer: ViewStyle;
}
const cardStyles = (isMobile: boolean, isTablet: boolean): StyleSheet.NamedStyles<ICardStyles> =>
  StyleSheet.create<ICardStyles>({
    card: {
      backgroundColor: theme.colors.grey5,
      minHeight: 530,
      borderRadius: 8,
      maxWidth: !isMobile ? (isTablet ? '80%' : '45%') : '90%',
      marginLeft: !isMobile ? (isTablet ? '13%' : '6%') : '4%',
      borderTopColor: theme.colors.completed,
      borderTopWidth: 4,
      padding: 24,
      shadowColor: theme.colors.cardShadowDark,
      shadowOffset: { width: 0, height: 42 },
      shadowOpacity: 0.2,
      shadowRadius: 120,
    },
    cardTenant: {
      borderTopColor: theme.colors.primaryColor,
      marginLeft: !isMobile ? (isTablet ? '11%' : '18%') : '6%',
    },

    cardTitle: {
      marginTop: 24,
      color: theme.colors.darkTint1,
    },
    cardDescription: {
      marginTop: 8,
      color: theme.colors.darkTint3,
      marginBottom: 24,
    },
    list: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textContainer: {
      width: '95%',
    },
  });
