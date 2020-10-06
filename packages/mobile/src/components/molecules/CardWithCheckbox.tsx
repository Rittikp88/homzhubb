import React, { ReactElement } from 'react';
import { View, StyleSheet, ImageSourcePropType, TouchableOpacity } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider, ImageRound, Label, PricePerUnit, RNCheckbox } from '@homzhub/common/src/components';

interface IOwnProps {
  heading: string;
  image: ImageSourcePropType;
  price: number;
  selected: boolean;
  onToggleSelect?: () => void;
  containerStyle?: any;
}
interface IOwnState {
  isChecked: boolean;
  showMore: boolean;
}

export class CardWithCheckbox extends React.PureComponent<IOwnProps, IOwnState> {
  constructor(props: IOwnProps) {
    super(props);
    const { selected } = this.props;

    this.state = {
      isChecked: selected,
      showMore: false,
    };
  }

  public render = (): React.ReactElement => {
    const { heading, image, price, containerStyle } = this.props;
    const { isChecked, showMore } = this.state;
    const {
      colors: { moreSeparator, white },
    } = theme;
    const backgroundColor = isChecked ? moreSeparator : white;

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={[{ backgroundColor }, styles.padding]}>
          <View style={styles.rowStyle}>
            <ImageRound width={70} height={70} source={image} />
            <View style={styles.content}>
              <View style={styles.headingStyle}>
                <Label type="large" numberOfLines={3} style={styles.textStyle}>
                  {heading}
                </Label>
                <RNCheckbox selected={isChecked} onToggle={this.onToggle} />
              </View>
              <PricePerUnit textStyle={styles.price} textSizeType="small" price={price} currency="INR" />
            </View>
          </View>
          {showMore && this.renderMoreContent()}
        </View>
        <TouchableOpacity style={styles.moreBtn} onPress={this.toggleSubsection}>
          <Label type="regular" textType="semiBold" style={styles.moreTextStyle}>
            {showMore ? 'Show less' : 'Show more'}
          </Label>
        </TouchableOpacity>
      </View>
    );
  };

  private renderMoreContent = (): ReactElement => {
    return (
      <>
        <Divider containerStyles={styles.dividerStyles} />
        <View style={styles.rowStyle}>
          <Label type="regular">{'\u2B24'}</Label>
          <Label type="regular">Some extra text</Label>
        </View>
      </>
    );
  };

  private onToggle = (): void => {
    this.setState((prev) => ({
      isChecked: !prev.isChecked,
    }));
  };

  private toggleSubsection = (): void => {
    this.setState((prev) => ({
      showMore: !prev.showMore,
    }));
  };
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: theme.colors.moreSeparator,
    borderRadius: 4,
  },
  content: {
    marginLeft: 10,
  },
  headingStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textStyle: {
    width: '70%',
    color: theme.colors.darkTint2,
  },
  price: {
    marginTop: 10,
    color: theme.colors.darkTint2,
  },
  rowStyle: {
    flexDirection: 'row',
  },
  moreBtn: {
    backgroundColor: theme.colors.lightBlue,
    alignItems: 'center',
    paddingVertical: 6,
  },
  padding: {
    padding: 12,
  },
  moreTextStyle: {
    color: theme.colors.blue,
  },
  dividerStyles: {
    marginTop: 16,
    marginBottom: 12,
  },
});
