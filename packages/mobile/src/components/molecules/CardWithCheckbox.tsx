import React, { ReactElement } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Image } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button, Divider, Label, PricePerUnit, RNCheckbox } from '@homzhub/common/src/components';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IOwnProps extends WithTranslation {
  heading: string;
  image: string;
  price: number;
  discountedPrice: number;
  bundleItems: Unit[];
  selected: boolean;
  onToggle: (value: boolean) => void;
  containerStyle?: StyleProp<ViewStyle>;
  currency: Currency;
}

interface IOwnState {
  showMore: boolean;
}

export class CardWithCheckbox extends React.PureComponent<IOwnProps, IOwnState> {
  public state = {
    showMore: false,
  };

  public render = (): React.ReactElement => {
    const { t, heading, image, price, discountedPrice, containerStyle, selected, currency } = this.props;
    const { showMore } = this.state;
    const {
      colors: { moreSeparator, white },
    } = theme;
    const backgroundColor = selected ? moreSeparator : white;

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={[{ backgroundColor }, styles.padding]}>
          <View style={styles.rowStyle}>
            <Image source={{ uri: image }} style={styles.image} />
            <View style={styles.content}>
              <View style={styles.headingStyle}>
                <Label type="large" numberOfLines={3} style={styles.textStyle}>
                  {heading}
                </Label>
                <RNCheckbox selected={selected} onToggle={this.onToggle} />
              </View>
              <View style={styles.rowStyle}>
                <PricePerUnit
                  price={discountedPrice || price}
                  currency={currency}
                  textSizeType="small"
                  textStyle={[styles.price, styles.marginRight]}
                />
                {discountedPrice > 0 && (
                  <PricePerUnit
                    price={price}
                    currency={currency}
                    textSizeType="small"
                    textStyle={styles.originalPrice}
                  />
                )}
              </View>
            </View>
          </View>
          {showMore && this.renderMoreContent()}
        </View>
        <Button
          type="secondary"
          textType="label"
          textSize="regular"
          title={showMore ? t('showLess') : t('showMore')}
          onPress={this.toggleSubsection}
          containerStyle={styles.moreBtn}
          titleStyle={styles.moreTextStyle}
        />
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
              <Icon name={icons.roundFilled} color={theme.colors.disabled} size={10} style={styles.iconStyle} />
              <Label type="regular" style={styles.label}>
                {item.label}
              </Label>
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

export default withTranslation(LocaleConstants.namespacesKey.property)(CardWithCheckbox);

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.5,
    borderColor: theme.colors.moreSeparator,
    borderRadius: 4,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    elevation: 1,
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
    alignItems: 'center',
  },
  moreBtn: {
    backgroundColor: theme.colors.blueTint10,
    alignItems: 'center',
    borderWidth: 0,
  },
  padding: {
    padding: 12,
  },
  moreTextStyle: {
    color: theme.colors.blue,
    marginVertical: 6,
  },
  dividerStyles: {
    marginTop: 16,
    marginBottom: 12,
    borderColor: theme.colors.background,
  },
  marginRight: {
    marginRight: 8,
  },
  marginBottom: {
    marginBottom: 14,
  },
  iconStyle: {
    marginTop: 4,
    marginHorizontal: 6,
  },
  label: {
    color: theme.colors.darkTint5,
  },
  image: {
    width: 70,
    height: 60,
  },
});
