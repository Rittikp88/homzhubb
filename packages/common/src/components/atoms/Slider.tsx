import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import MultiSlider, { MarkerProps, LabelProps } from '@ptomasroos/react-native-multi-slider';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text, Label } from '@homzhub/common/src/components/atoms/Text';

interface ISliderProps {
  isMultipleSlider?: boolean;
  isLabelRequired?: boolean;
  maxSliderRange?: number;
  minSliderRange?: number;
  minSliderValue?: number;
  maxSliderValue?: number;
  onSliderChange: (val1: number, val2?: number) => void;
  labelText?: string;
  testID?: string;
}

const higherLength = theme.viewport.width > 400 ? 350 : 310;
const SLIDER_LENGTH = theme.viewport.width > 350 ? higherLength : 260;

export class Slider extends Component<ISliderProps> {
  public render(): React.ReactNode {
    const { isMultipleSlider } = this.props;
    return <>{isMultipleSlider ? this.renderMultipleSlider() : this.renderSingleSlider()}</>;
  }

  private renderMultipleSlider = (): React.ReactElement => {
    let { maxSliderValue = 0 } = this.props;
    const { maxSliderRange = 10, minSliderRange = 0, isLabelRequired, minSliderValue = 0 } = this.props;
    if (maxSliderValue && maxSliderValue <= 0) {
      maxSliderValue = maxSliderRange;
    }
    return (
      <MultiSlider
        values={[minSliderValue, maxSliderValue]}
        sliderLength={SLIDER_LENGTH}
        onValuesChange={this.multiSliderValuesChange}
        min={minSliderRange}
        max={maxSliderRange}
        step={maxSliderRange * 0.001}
        snapped
        enableLabel={isLabelRequired}
        isMarkersSeparated
        selectedStyle={styles.selectedStyle}
        markerContainerStyle={styles.markerContainer}
        customMarkerLeft={(e): React.ReactElement => this.customMarkerLeft(e)}
        customMarkerRight={(e): React.ReactElement => this.customMarkerRight(e)}
        containerStyle={styles.slider}
      />
    );
  };

  private renderSingleSlider = (): React.ReactElement => {
    const { isLabelRequired = false, maxSliderRange, minSliderRange, minSliderValue = 0 } = this.props;
    return (
      <MultiSlider
        values={[minSliderValue]}
        sliderLength={SLIDER_LENGTH}
        min={minSliderRange}
        max={maxSliderRange}
        isMarkersSeparated
        enableLabel={isLabelRequired}
        customLabel={(e): React.ReactElement => this.renderLabel(e)}
        onValuesChange={this.singleSliderValuesChange}
        customMarkerLeft={(e): React.ReactElement => this.customMarkerLeft(e)}
      />
    );
  };

  private renderLabel = (e: LabelProps): React.ReactElement => {
    const { labelText = '' } = this.props;
    return (
      <View
        style={[
          { transform: [{ translateX: e.oneMarkerLeftPosition - theme.viewport.width * 0.075 }] },
          styles.textContainer,
        ]}
      >
        <Text textType="regular" type="regular">{`${e.oneMarkerValue} `}</Text>
        <Label type="regular" textType="regular">
          {labelText}
        </Label>
      </View>
    );
  };

  private customMarkerLeft = (e: MarkerProps): React.ReactElement => {
    return <>{e.pressed ? <View style={styles.pressedMarker} /> : <View style={styles.normalMarker} />}</>;
  };

  private customMarkerRight = (e: MarkerProps): React.ReactElement => {
    return <>{e.pressed ? <View style={styles.pressedMarker} /> : <View style={styles.normalMarker} />}</>;
  };

  private multiSliderValuesChange = (values: number[]): void => {
    const { onSliderChange } = this.props;
    onSliderChange(values[0], values[1]);
  };

  private singleSliderValuesChange = (value: number[]): void => {
    const { onSliderChange } = this.props;
    onSliderChange(value[0]);
  };
}

const styles = StyleSheet.create({
  pressedMarker: {
    height: 22,
    width: 22,
    borderRadius: 22,
    backgroundColor: theme.colors.active,
    shadowColor: theme.colors.primaryColor,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4.65,
    elevation: 7,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  normalMarker: {
    ...(theme.circleCSS(20) as object),
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.active,
  },
  selectedStyle: { backgroundColor: theme.colors.primaryColor },
  markerContainer: {
    justifyContent: 'center',
  },
  slider: {
    paddingHorizontal: 4,
  },
});
