import React from 'react';
import { StyleProp, View, ViewStyle, StyleSheet } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label } from '@homzhub/common/src/components';

enum StepStatus {
  finished = 'finished',
  unfinished = 'unfinished',
  current = 'current',
}

enum StepDirection {
  horizontal = 'horizontal',
  vertical = 'vertical',
}

const baseCustomStyles = {
  stepStrokeCurrentColor: theme.colors.secondaryColor,
  separatorFinishedColor: theme.colors.secondaryColor,
  separatorUnFinishedColor: theme.colors.whiteOpacity,
  stepIndicatorFinishedColor: theme.colors.secondaryColor,
  stepIndicatorUnFinishedColor: theme.styleConstants.transparent,
};

export interface IStepIndicatorStyles {
  stepIndicatorSize?: number;
  currentStepIndicatorSize?: number;
  separatorStrokeWidth?: number;
  stepStrokeWidth?: number;
  currentStepStrokeWidth?: number;
  stepStrokeCurrentColor?: string;
  stepStrokeFinishedColor?: string;
  stepStrokeUnFinishedColor?: string;
  separatorFinishedColor?: string;
  separatorUnFinishedColor?: string;
  stepIndicatorFinishedColor?: string;
  stepIndicatorUnFinishedColor?: string;
  stepIndicatorCurrentColor?: string;
  stepIndicatorLabelFontSize?: number;
  currentStepIndicatorLabelFontSize?: number;
  stepIndicatorLabelCurrentColor?: string;
  stepIndicatorLabelFinishedColor?: string;
  stepIndicatorLabelUnFinishedColor?: string;
  labelColor?: string;
  currentStepLabelColor?: string;
  labelSize?: number;
  labelAlign?: string;
  labelFontFamily?: string;
}

interface IProps {
  stepCount: number;
  currentPosition: number;
  labels?: string[];
  direction?: StepDirection;
  isPaymentSuccess?: boolean;
  customStyles?: IStepIndicatorStyles;
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: (step: number) => void;
}

export class StepIndicatorComponent extends React.PureComponent<IProps, {}> {
  public render(): React.ReactNode {
    const {
      stepCount,
      currentPosition,
      labels,
      onPress,
      direction = StepDirection.horizontal,
      customStyles = {},
      containerStyle = {},
    } = this.props;
    return (
      <View style={containerStyle}>
        <StepIndicator
          stepCount={stepCount}
          direction={direction}
          customStyles={{ ...baseCustomStyles, ...customStyles }}
          currentPosition={currentPosition}
          labels={labels}
          onPress={onPress}
          renderLabel={this.label}
          renderStepIndicator={this.stepIndicator}
        />
      </View>
    );
  }

  private label = ({ label }: { label: string }): React.ReactNode => {
    return (
      <Label type="regular" textType="semiBold" style={styles.label} numberOfLines={1}>
        {label}
      </Label>
    );
  };

  private stepIndicator = ({ stepStatus }: { stepStatus: string }): React.ReactNode => {
    const { isPaymentSuccess } = this.props;
    let conditionalInnerStyle = {};
    if (stepStatus === StepStatus.current) {
      conditionalInnerStyle = {
        backgroundColor: theme.colors.primaryColor,
      };
    }

    return (
      <View style={styles.stepIndicator}>
        {stepStatus === StepStatus.finished || isPaymentSuccess ? (
          <Icon name={icons.checkFilled} size={20} color={theme.colors.primaryColor} />
        ) : (
          <View style={[styles.inner, conditionalInnerStyle]} />
        )}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  stepIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 28,
    height: 28,
    borderRadius: 28 / 2,
    backgroundColor: theme.colors.whiteOpacity,
  },
  inner: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    backgroundColor: theme.colors.secondaryColor,
  },
  label: {
    textAlign: 'center',
    color: theme.colors.white,
  },
});
