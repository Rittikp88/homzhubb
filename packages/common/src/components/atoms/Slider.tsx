import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MultiSlider, { MarkerProps, LabelProps } from '@ptomasroos/react-native-multi-slider';
import { theme } from '@homzhub/common/src/styles/theme';

interface ISliderProps {
  isMultipleSlider?: boolean;
  isLabelRequired?: boolean;
  maxSliderRange?: number;
  minSliderRange?: number;
  minSliderValue?: number;
  maxSliderValue?: number;
  onSliderChange: (val1: number, val2?: number) => void;
  labelText?: string;
}

interface ISliderState {
  multiSliderValue: number[];
  singleSliderValue: number[];
}

export class Slider extends Component<ISliderProps, ISliderState> {
  public constructor(props: ISliderProps) {
    super(props);
    const { minSliderValue, maxSliderValue, maxSliderRange } = props;
    const max = maxSliderValue && maxSliderValue > 0 ? maxSliderValue : maxSliderRange || 10;
    this.state = {
      multiSliderValue: [minSliderValue || 0, max],
      singleSliderValue: [0],
    };
  }

  public componentDidUpdate = (prevProps: Readonly<ISliderProps>, prevState: Readonly<ISliderState>): void => {
    const { maxSliderRange, minSliderValue } = this.props;
    if (maxSliderRange !== prevState.multiSliderValue[1]) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        multiSliderValue: [prevState.multiSliderValue[0], maxSliderRange || -1],
      });
    }
    if (minSliderValue !== prevState.multiSliderValue[0]) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        multiSliderValue: [minSliderValue || -1, prevProps.maxSliderRange || -1],
      });
    }
  };

  public render(): React.ReactNode {
    const { isMultipleSlider } = this.props;
    return <>{isMultipleSlider ? this.renderMultipleSlider() : this.renderSingleSlider()}</>;
  }

  private renderMultipleSlider = (): React.ReactElement => {
    const { multiSliderValue } = this.state;
    const { maxSliderRange = 10, minSliderRange = 0, isLabelRequired } = this.props;
    return (
      <MultiSlider
        values={[multiSliderValue[0], multiSliderValue[1]]}
        sliderLength={theme.viewport.width > 350 ? 360 : 260}
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
      />
    );
  };

  private renderSingleSlider = (): React.ReactElement => {
    const { singleSliderValue } = this.state;
    const { isLabelRequired = false, maxSliderRange, minSliderRange } = this.props;
    return (
      <MultiSlider
        values={singleSliderValue}
        sliderLength={theme.viewport.width > 350 ? 360 : 260}
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
      <View style={{ transform: [{ translateX: e.oneMarkerLeftPosition }] }}>
        <Text>{`${e.oneMarkerValue} ${labelText}`}</Text>
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
    this.setState({
      multiSliderValue: values,
    });

    onSliderChange(values[0], values[1]);
  };

  private singleSliderValuesChange = (value: number[]): void => {
    const { onSliderChange } = this.props;
    this.setState({
      singleSliderValue: value,
    });

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
  normalMarker: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.active,
  },
  selectedStyle: { backgroundColor: theme.colors.primaryColor },
  markerContainer: {
    justifyContent: 'center',
  },
});
