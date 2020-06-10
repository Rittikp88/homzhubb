import React from 'react';
import { StyleProp, ViewStyle, ImageURISource } from 'react-native';
import Slider from '@react-native-community/slider';

interface IProps {
  sliderStyle: StyleProp<ViewStyle>;
  minimumValue: number;
  maximumValue: number;
  minimumTrackTintColor: string;
  maximumTrackTintColor: string;
  onValueChange: (data: number) => void;
  value: number;
  disabled?: boolean;
  onSlidingStart?: (data: number) => void;
  onSlidingComplete?: (data: number) => void;
  step?: number;
  inverted?: boolean;
  thumbTintColor?: string;
  thumbImage?: ImageURISource;
}

export const RNSlider = (props: IProps): React.ReactElement => {
  const {
    sliderStyle,
    minimumValue,
    maximumValue,
    minimumTrackTintColor,
    maximumTrackTintColor,
    disabled = false,
    onSlidingStart,
    onSlidingComplete,
    onValueChange,
    step,
    value,
    inverted = false,
    thumbTintColor,
    thumbImage,
  } = props;

  const bubbleValueChange = (data: number): void => {
    onValueChange(data);
  };

  const bubbleOnSlidingStart = (data: number): void => {
    if (onSlidingStart) {
      onSlidingStart(data);
    }
  };

  const bubbleOnSlidingComplete = (data: number): void => {
    if (onSlidingComplete) {
      onSlidingComplete(data);
    }
  };

  return (
    <Slider
      style={sliderStyle}
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      minimumTrackTintColor={minimumTrackTintColor}
      maximumTrackTintColor={maximumTrackTintColor}
      disabled={disabled}
      onSlidingStart={bubbleOnSlidingStart}
      onSlidingComplete={bubbleOnSlidingComplete}
      onValueChange={bubbleValueChange}
      step={step}
      value={value}
      inverted={inverted}
      thumbTintColor={thumbTintColor}
      thumbImage={thumbImage}
    />
  );
};
