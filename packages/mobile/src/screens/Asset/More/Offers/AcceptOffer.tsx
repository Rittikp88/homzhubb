import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import OfferCard from '@homzhub/common/src/components/organisms/OfferCard';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { Offer } from '@homzhub/common/src/domain/models/Offer';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { acceptOffer } from '@homzhub/common/src/constants/ProspectProfile';
import { offers } from '@homzhub/common/src/mocks/Offers';

interface IState {
  isBottomSheetVisible: boolean;
}

interface IOwner {
  text: string;
}

type Props = WithTranslation & NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.AcceptOffer>;

class AcceptOffer extends Component<Props, IState> {
  public state = {
    isBottomSheetVisible: false,
  };

  public render(): React.ReactNode {
    const { t, navigation } = this.props;
    return (
      <UserScreen
        isOuterScrollEnabled
        title={t('offers')}
        pageTitle={t('offers:acceptOffer')}
        onBackPress={navigation.goBack}
      >
        {this.renderAcceptOffer()}
      </UserScreen>
    );
  }

  private renderAcceptOffer = (): React.ReactElement => {
    const { t } = this.props;

    // TODO: Remove after API integration
    const offerData = ObjectMapper.deserializeArray(Offer, offers);

    return (
      <View style={styles.container}>
        <OfferCard offer={offerData[0]} isFromAccept />
        <Button
          type="primary"
          iconSize={20}
          icon={icons.circularCheckFilled}
          iconColor={theme.colors.green}
          title={t('common:accept')}
          onPress={this.onOpenBottomSheet}
          containerStyle={styles.acceptButton}
          titleStyle={styles.acceptText}
        />
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
            <View style={styles.icon}>
              <Icon name={icons.doubleCheck} size={60} color={theme.colors.completed} />
            </View>

            <Label type="large" textType="semiBold" style={styles.marginVertical}>
              {t('offers:keepInMind')}
            </Label>

            {acceptOffer.tenant.map((item: IOwner, index: number) => {
              return (
                <View key={index} style={styles.textView}>
                  <Label key={index} type="large" textType="regular" style={styles.text}>
                    {item.text}
                  </Label>
                </View>
              );
            })}
          </View>
          <Button
            type="primary"
            title={t('offers:acceptAndLease')}
            containerStyle={[styles.button, styles.marginVertical]}
          />
        </ScrollView>
      </BottomSheet>
    );
  };

  public onOpenBottomSheet = (): void => {
    this.setState({ isBottomSheetVisible: true });
  };

  public onCloseBottomSheet = (): void => {
    this.setState({ isBottomSheetVisible: false });
  };
}

export default withTranslation()(AcceptOffer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  acceptButton: {
    marginHorizontal: 16,
    flexDirection: 'row-reverse',
    backgroundColor: theme.colors.greenOpacity,
    marginVertical: 60,
  },
  acceptText: {
    marginHorizontal: 8,
    color: theme.colors.green,
  },
  text: {
    color: theme.colors.darkTint4,
    justifyContent: 'center',
    alignItems: 'center',
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
  button: {
    marginHorizontal: 16,
  },
  icon: {
    borderWidth: 10,
    borderRadius: 120 / 2,
    backgroundColor: theme.colors.greenOpacity,
    borderColor: theme.colors.greenOpacity,
  },
});
