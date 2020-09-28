import React from 'react';
import { View, StyleSheet, ImageSourcePropType } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Image, Label, PricePerUnit, RNCheckbox } from '@homzhub/common/src/components';

interface IOwnProps {
  heading: string;
  image: ImageSourcePropType;
  price: number;
  selected: boolean;
  onToggleSelect?: () => void;
}
interface IOwnState {
  isChecked: boolean;
}

export class CardWithCheckbox extends React.PureComponent<IOwnProps, IOwnState> {
  constructor(props: IOwnProps) {
    super(props);
    const { selected } = this.props;

    this.state = {
      isChecked: selected,
    };
  }

  public render = (): React.ReactElement => {
    const { heading, image, price } = this.props;
    const { isChecked } = this.state;
    const {
      colors: { moreSeparator, white },
    } = theme;
    const backgroundColor = isChecked ? moreSeparator : white;

    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Image width={80} height={80} source={image} />
        <View style={styles.content}>
          <View style={styles.subContainer}>
            <Label type="large" numberOfLines={3} style={styles.textStyle}>
              {heading}
            </Label>
            <RNCheckbox selected={isChecked} onToggle={this.onToggle} containerStyle={styles.checkbox} />
          </View>
          <PricePerUnit textStyle={styles.price} textSizeType="small" price={price} currency="INR" />
        </View>
      </View>
    );
  };

  private onToggle = (): void => {
    this.setState((prev) => ({
      isChecked: !prev.isChecked,
    }));
  };
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: theme.layout.screenPadding,
    marginBottom: 16,
  },
  content: {
    marginLeft: 10,
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    width: '70%',
    color: theme.colors.darkTint2,
  },
  checkbox: {
    marginHorizontal: 16,
  },
  price: {
    marginTop: 10,
    color: theme.colors.darkTint2,
  },
});
