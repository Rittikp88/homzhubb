import React from 'react';
import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Badge, Label, Text } from '@homzhub/common/src/components';
import { ProgressBar } from '@homzhub/mobile/src/components/atoms/ProgressBar';
import { PropertyAddressCountry } from '@homzhub/mobile/src/components/molecules/PropertyAddressCountry';
import { LabelColor } from '@homzhub/common/src/domain/models/LeaseTransaction';

interface IProps {
  steps: string[];
  currentIndex: number;
  isStepDone: boolean[];
  progress: number;
  primaryAddress: string;
  subAddress: string;
  propertyType: string;
  icon?: string;
  badge?: LabelColor;
  stepContainerStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export const AddressWithStepIndicator = (props: IProps): React.ReactElement => {
  const {
    steps,
    currentIndex,
    isStepDone,
    progress,
    icon,
    badge,
    stepContainerStyle = {},
    containerStyle = {},
    primaryAddress,
    subAddress,
    propertyType,
  } = props;
  const renderIndicator = ({ item, index }: { item: string; index: number }): React.ReactElement => {
    const isCurrentStep = currentIndex === index;
    const stepDone = isStepDone[index];
    const iconColor = isCurrentStep ? theme.colors.blue : stepDone ? theme.colors.green : theme.colors.darkTint7;
    const labelStyle = [styles.stepLabel, isCurrentStep && styles.currentStepLabel, stepDone && styles.doneStepLabel];
    return (
      <View style={styles.indicatorView}>
        <Icon name={icons.roundFilled} size={30} color={iconColor} />
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

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.topView}>
        <Text type="small" textType="regular">
          {propertyType}
        </Text>
        {icon && <Icon name={icon} size={23} color={theme.colors.blue} />}
        {badge && <Badge title={badge.label} badgeColor={badge.color} />}
      </View>
      <PropertyAddressCountry
        primaryAddress={primaryAddress}
        subAddress={subAddress}
        containerStyle={styles.addressView}
      />
      <ProgressBar progress={progress} width={theme.viewport.width > 400 ? 350 : 310} />
      <FlatList
        data={steps}
        renderItem={renderIndicator}
        horizontal
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
    width: 60,
    height: 2,
    marginTop: 10,
    opacity: 0.3,
  },
  doneSeparator: {
    backgroundColor: theme.colors.green,
  },
  listStyle: {
    paddingHorizontal: 10,
    marginTop: 20,
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
