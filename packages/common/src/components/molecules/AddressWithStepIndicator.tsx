import React from 'react';
import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { useDown, useViewPort } from '@homzhub/common/src/utils/MediaQueryUtils';
import { IBadgeInfo } from '@homzhub/mobile/src/navigation/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { ITypographyProps } from '@homzhub/common/src/components/atoms/Typography';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { IAmenitiesData, PropertyAmenities } from '@homzhub/common/src/components/molecules/PropertyAmenities';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { ILabelColor } from '@homzhub/common/src/domain/models/LeaseTransaction';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  steps: string[];
  currentIndex: number;
  isStepDone: boolean[];
  primaryAddress: string;
  subAddress: string;
  countryFlag: React.ReactElement;
  propertyType: string;
  icon?: string;
  onEditPress?: () => void;
  selectedPan?: string;
  badgeInfo?: IBadgeInfo;
  amenities?: IAmenitiesData[];
  onPressSteps: (index: number) => void;
  badgeStyle?: StyleProp<ViewStyle>;
  stepContainerStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  stepIndicatorSeparatorStyle?: StyleProp<ViewStyle>;
  primaryAddressTextStyles?: ITypographyProps;
  subAddressTextStyles?: ITypographyProps;
}

export const AddressWithStepIndicator = (props: IProps): React.ReactElement => {
  const {
    steps,
    currentIndex,
    isStepDone,
    icon,
    selectedPan,
    badgeInfo,
    badgeStyle,
    amenities,
    stepContainerStyle = {},
    containerStyle = {},
    primaryAddress,
    subAddress,
    propertyType,
    onPressSteps,
    onEditPress,
    countryFlag,
    stepIndicatorSeparatorStyle,
    subAddressTextStyles,
    primaryAddressTextStyles,
  } = props;

  const { width } = useViewPort();
  const { t } = useTranslation(LocaleConstants.namespacesKey.property);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const numberOfSteps = steps.length;
  const { rental, sell, informational, blue, green, darkTint7 } = theme.colors;

  const badgeData = (): ILabelColor => {
    switch (selectedPan) {
      case TypeOfPlan.SELL:
        return {
          label: t('forSale'),
          color: sell,
        };
      case TypeOfPlan.MANAGE:
        return {
          label: t('manage'),
          color: informational,
        };
      case TypeOfPlan.RENT:
      default:
        return {
          label: t('forRental'),
          color: rental,
        };
    }
  };

  const renderIndicator = ({ item, index }: { item: string; index: number }): React.ReactElement => {
    const isCurrentStep = currentIndex === index;
    const stepDone = isStepDone[index];
    const iconColor = isCurrentStep ? blue : stepDone ? green : darkTint7;
    const labelStyle = [styles.stepLabel, isCurrentStep && styles.currentStepLabel, stepDone && styles.doneStepLabel];
    return (
      <View style={styles.indicatorView}>
        <Icon name={icons.roundFilled} size={30} color={iconColor} onPress={(): void => onPressSteps(index)} />
        <Label type="small" textType="semiBold" style={labelStyle}>
          {item}
        </Label>
      </View>
    );
  };

  const renderSeparator = (separatorData: { highlighted: boolean; leadingItem: string }): React.ReactElement => {
    let isDone = false;
    const indicatorSteps: string[] = steps;
    indicatorSteps.forEach((item, index) => {
      if (separatorData.leadingItem === item) {
        isDone = isStepDone[index];
      }
    });

    const calculateSeparatorWidth = (): number => {
      if (PlatformUtils.isMobile()) return (width - 220) / numberOfSteps;
      if (isMobile) return (width - 170) / numberOfSteps;
      if (isTablet) return (width - 230) / numberOfSteps;
      return (width - 600) / numberOfSteps;
    };

    const separatorWidth = { width: calculateSeparatorWidth() };

    return (
      <View style={[styles.separator, isDone && styles.doneSeparator, separatorWidth, stepIndicatorSeparatorStyle]} />
    );
  };

  const badge = badgeInfo ? { label: badgeInfo.title, color: badgeInfo.color } : badgeData();

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.topView}>
        <Label type="large" textType="regular" style={styles.propertyTypeStyle}>
          {propertyType}
        </Label>
        {icon && <Icon name={icon} size={23} color={blue} onPress={onEditPress} />}
        {(selectedPan || badgeInfo) && (
          <Badge title={badge.label.toUpperCase()} badgeColor={badge.color} badgeStyle={badgeStyle} />
        )}
      </View>
      <PropertyAddressCountry
        primaryAddress={primaryAddress}
        subAddress={subAddress}
        countryFlag={countryFlag}
        containerStyle={styles.addressView}
        primaryAddressTextStyles={primaryAddressTextStyles}
        subAddressTextStyles={subAddressTextStyles}
      />
      {amenities && (
        <PropertyAmenities
          labelStyles={subAddressTextStyles}
          containerStyle={styles.amenities}
          contentContainerStyle={styles.amenitiesContentStyle}
          data={amenities}
          direction="row"
        />
      )}
      <FlatList
        keyExtractor={(step): string => step}
        data={steps}
        renderItem={renderIndicator}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={renderSeparator}
        style={[styles.listStyle, stepContainerStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
  },
  addressView: {
    marginVertical: 6,
  },
  indicatorView: {
    alignItems: 'center',
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    backgroundColor: theme.colors.darkTint7,
    height: 2,
    marginTop: 10,
    opacity: 0.3,
  },
  doneSeparator: {
    backgroundColor: theme.colors.green,
  },
  listStyle: {
    marginTop: 10,
    alignSelf: 'center',
  },
  stepLabel: {
    color: theme.colors.darkTint7,
  },
  currentStepLabel: {
    color: theme.colors.blue,
  },
  doneStepLabel: {
    color: theme.colors.green,
  },
  amenities: {
    marginTop: 10,
    marginBottom: 14,
    justifyContent: 'flex-start',
  },
  amenitiesContentStyle: {
    marginRight: 16,
  },
  propertyTypeStyle: {
    color: theme.colors.primaryColor,
  },
});
