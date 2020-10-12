import React, { ReactElement } from 'react';
import { View, StyleSheet, ImageSourcePropType, TouchableOpacity } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider, ImageRound, Label, PricePerUnit, RNCheckbox } from '@homzhub/common/src/components';
import { Unit } from '@homzhub/common/src/domain/models/Unit';

interface IOwnProps {
  heading: string;
  image: ImageSourcePropType;
  price: number;
  discountedPrice?: number;
  bundleItems: Unit[];
  selected: boolean;
  onToggle: (value: boolean) => void;
  containerStyle?: any;
}

interface IOwnState {
  showMore: boolean;
}

export class CardWithCheckbox extends React.PureComponent<IOwnProps, IOwnState> {
  public state = {
    showMore: false,
  };

  public render = (): React.ReactElement => {
    const { heading, image, price, discountedPrice, containerStyle, selected } = this.props;
    const { showMore } = this.state;
    const {
      colors: { moreSeparator, white },
    } = theme;
    const backgroundColor = selected ? moreSeparator : white;

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
                <RNCheckbox selected={selected} onToggle={this.onToggle} />
              </View>
              <View style={styles.rowStyle}>
                <PricePerUnit
                  textStyle={[styles.price, styles.marginRight]}
                  textSizeType="small"
                  price={price}
                  currency="INR"
                />
                {discountedPrice && (
                  <PricePerUnit
                    textStyle={styles.originalPrice}
                    textSizeType="small"
                    price={discountedPrice}
                    currency="INR"
                  />
                )}
              </View>
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
    const { bundleItems } = this.props;
    return (
      <>
        <Divider containerStyles={styles.dividerStyles} />
        {bundleItems.map((item) => {
          return (
            <View key={item.id} style={[styles.rowStyle, styles.marginBottom]}>
              <Label style={styles.marginRight} type="regular">
                {'\u2B24'}
              </Label>
              <Label type="regular">{item.label}</Label>
            </View>
          );
        })}
      </>
    );
  };

  private onToggle = (): void => {
    const { onToggle, selected } = this.props;
    onToggle(!selected);
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
  originalPrice: {
    color: theme.colors.disabled,
    textDecorationLine: 'line-through',
    marginTop: 10,
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
  marginRight: {
    marginRight: 8,
  },
  marginBottom: {
    marginBottom: 14,
  },
});
