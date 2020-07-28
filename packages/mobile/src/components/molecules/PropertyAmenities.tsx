import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { AmenitiesIcon } from '@homzhub/common/src/components';

interface IAmenitiesData {
  icon: string;
  iconSize?: number;
  iconColor?: string;
  label: string;
}

interface IProps {
  data: IAmenitiesData[];
  direction: 'row' | 'column';
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

class PropertyAmenities extends React.PureComponent<IProps, {}> {
  public render(): React.ReactNode {
    const { containerStyle } = this.props;
    return <View style={[styles.rowContainer, containerStyle]}>{this.renderIcons()}</View>;
  }

  public renderIcons = (): React.ReactNode => {
    const { data, direction, contentContainerStyle } = this.props;
    return data.map((amenity: IAmenitiesData, index: number) => {
      const isLastIndex = index === data.length - 1;
      return (
        <AmenitiesIcon
          direction={direction}
          icon={amenity.icon}
          label={amenity.label}
          key={index}
          iconColor={amenity.iconColor}
          iconSize={amenity.iconSize}
          isLastIndex={isLastIndex}
          containerStyle={contentContainerStyle}
        />
      );
    });
  };
}

export default PropertyAmenities;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
