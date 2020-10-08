import React from 'react';
import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Badge, Label, Text } from '@homzhub/common/src/components';
import { PropertyAddressCountry } from '@homzhub/mobile/src/components/molecules/PropertyAddressCountry';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { ILabelColor } from '@homzhub/common/src/domain/models/LeaseTransaction';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  steps: string[];
  currentIndex: number;
  isStepDone: boolean[];
  primaryAddress: string;
  subAddress: string;
  propertyType: string;
  icon?: string;
  onEditPress?: () => void;
  selectedPan?: string;
  onPressSteps: (index: number) => void;
  badgeStyle?: StyleProp<ViewStyle>;
  stepContainerStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export const AddressWithStepIndicator = (props: IProps): React.ReactElement => {
  const {
    steps,
    currentIndex,
    isStepDone,
    icon,
    selectedPan,
    badgeStyle,
    stepContainerStyle = {},
    containerStyle = {},
    primaryAddress,
    subAddress,
    propertyType,
    onPressSteps,
    onEditPress,
  } = props;

  const { t } = useTranslation(LocaleConstants.namespacesKey.property);

  const { rental, sell, informational, blue, green, darkTint7 } = theme.colors;

  const badgeData = (): ILabelColor => {
    switch (selectedPan) {
      case TypeOfPlan.RENT:
        return {
          label: t('forRental'),
          color: rental,
        };
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
    return <View style={[styles.separator, isDone && styles.doneSeparator]} />;
  };

  const badge = badgeData();

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.topView}>
        <Text type="small" textType="regular">
          {propertyType}
        </Text>
        {icon && <Icon name={icon} size={23} color={blue} onPress={onEditPress} />}
        {selectedPan && <Badge title={badge.label.toUpperCase()} badgeColor={badge.color} badgeStyle={badgeStyle} />}
      </View>
      <PropertyAddressCountry
        primaryAddress={primaryAddress}
        subAddress={subAddress}
        containerStyle={styles.addressView}
      />
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
    width: 50,
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
});
