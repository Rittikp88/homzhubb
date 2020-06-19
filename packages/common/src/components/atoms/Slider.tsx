import React from 'react';
import { StyleProp, ViewStyle, ImageURISource } from 'react-native';
import Slider from '@react-native-community/slider';

interface IProps {
  sliderStyle?: StyleProp<ViewStyle>;
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

  return (
    <Slider
      style={sliderStyle}
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      minimumTrackTintColor={minimumTrackTintColor}
      maximumTrackTintColor={maximumTrackTintColor}
      disabled={disabled}
      onSlidingStart={onSlidingStart}
      onSlidingComplete={onSlidingComplete}
      onValueChange={onValueChange}
      step={step}
      value={value}
      inverted={inverted}
      thumbTintColor={thumbTintColor}
      thumbImage={thumbImage}
    />
  );
};
