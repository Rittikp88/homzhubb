import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import Check from '@homzhub/common/src/assets/images/check.svg';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { flags } from '@homzhub/common/src/components/atoms/Flag';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { acceptOffer } from '@homzhub/common/src/constants/ProspectProfile';

type Props = WithTranslation;
interface IState {
  isBottomSheetVisible: boolean;
}

interface IOwner {
  Text: string;
}
class AcceptOffer extends Component<Props, IState> {
  public state = {
    isBottomSheetVisible: false,
  };

  public render(): React.ReactNode {
    const { t } = this.props;
    return (
      <UserScreen isOuterScrollEnabled title={t('assetMore:Portfolio')} pageTitle={t('assetMore:propertyVisits')}>
        {this.renderAcceptOffer()}
      </UserScreen>
    );
  }

  private renderAcceptOffer = (): React.ReactElement => {
    const { t } = this.props;

    return (
      <View style={styles.container}>
        <Avatar
          fullName={acceptOffer.name}
          isRightIcon
          onPressRightIcon={FunctionUtils.noop}
          designation={acceptOffer.designation}
          date={acceptOffer.date}
          rating={5.0}
        />
        <PropertyAddressCountry
          isIcon
          primaryAddress={acceptOffer.propertyName}
          countryFlag={flags.IN}
          subAddress={acceptOffer.propertyAddress}
          containerStyle={styles.marginVertical}
        />
        <Divider />
        <View style={styles.acceptButtom}>
          <TouchableOpacity
            style={[styles.acceptButton, { backgroundColor: theme.colors.blueOpacity }]}
            onPress={(): void => this.onOpenBottomSheet()}
          >
            <Icon name={icons.circularCheckFilled} color={theme.colors.green} size={20} />
            <Text style={styles.acceptText} type="small">
              {t('common:accept')}
            </Text>
          </TouchableOpacity>
        </View>
        {this.renderBottomSheet()}
      </View>
    );
  };

  public renderBottomSheet = (): React.ReactNode => {
    const { isBottomSheetVisible } = this.state;
    const { t } = this.props;
    return (
      <BottomSheet
        visible={isBottomSheetVisible}
        sheetHeight={theme.viewport.height * 0.7}
        onCloseSheet={this.onCloseBottomSheet}
      >
        <ScrollView>
          <View style={styles.bottomSheetContainer}>
            <Text textType="semiBold" type="large">
              {t('common:congratulations')}
            </Text>
            <Text textType="regular" type="small" style={styles.marginVertical}>
              {t('offers:aboutToRent')}
            </Text>
            <Check />
            <Label type="large" textType="semiBold" style={styles.marginVertical}>
              {t('offers:keepInMind')}
            </Label>

            {acceptOffer.owner.map((item: IOwner, index: number) => {
              return (
                <View key={index} style={styles.textView}>
                  <Label key={index} type="large" textType="regular" style={styles.text}>
                    {item.Text}
                  </Label>
                </View>
              );
            })}
          </View>
          <Button type="primary" title={t('offers:acceptAndLease')} containerStyle={styles.button} />
        </ScrollView>
      </BottomSheet>
    );
  };

  public onOpenBottomSheet = (): void => {
    const { isBottomSheetVisible } = this.state;

    this.setState({ isBottomSheetVisible: !isBottomSheetVisible });
  };

  public onCloseBottomSheet = (): void => {
    this.setState({ isBottomSheetVisible: false });
  };
}

export default withTranslation()(AcceptOffer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    padding: 16,
  },
  acceptButton: {
    bottom: 0,
    padding: 16,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    marginBottom: 36,
  },
  acceptText: {
    paddingLeft: 8,
    color: theme.colors.green,
  },
  acceptButtom: {
    width: '100%',
    justifyContent: 'center',
    marginTop: 250,
  },
  button: {
    borderWidth: 0,
    margin: 10,
    flex: 0,
  },
  text: {
    color: theme.colors.darkTint4,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    padding: 5,
  },
  bottomSheetContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  marginVertical: {
    marginVertical: 16,
  },
  textView: {
    marginLeft: 20,
  },
});
