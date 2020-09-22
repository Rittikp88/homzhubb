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
        <View style={styles.subContainer}>
          <Image width={100} height={80} source={image} />
          <View style={styles.textStyle}>
            <Label type="large" numberOfLines={3}>
              {heading}
            </Label>
            <PricePerUnit textStyle={styles.marginTop} textSizeType="small" price={price} currency="INR" />
          </View>
        </View>
        <RNCheckbox selected={isChecked} onToggle={this.onToggle} />
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: theme.layout.screenPadding,
  },
  subContainer: {
    flexDirection: 'row',
  },
  textStyle: {
    marginHorizontal: 10,
    width: '70%',
  },
  marginTop: {
    marginTop: 17,
  },
});
