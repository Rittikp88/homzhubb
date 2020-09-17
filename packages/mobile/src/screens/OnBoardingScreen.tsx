import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { StorageService, StorageKeys } from '@homzhub/common/src/services/storage/StorageService';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { GuestStackNavigatorParamList } from '@homzhub/mobile/src/navigation/GuestStack';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button, Label, SVGUri, Text } from '@homzhub/common/src/components';
import { SnapCarousel, PaginationComponent } from '@homzhub/mobile/src/components';
import { OnBoarding } from '@homzhub/common/src/domain/models/OnBoarding';

interface IDispatchProps {
  updateOnBoarding: (isOnBoardingCompleted: boolean) => void;
}

interface IOnBoardingScreenState {
  activeSlide: number;
  ref: any;
  data: OnBoarding[];
}

type libraryProps = WithTranslation & NavigationScreenProps<GuestStackNavigatorParamList, ScreensKeys.OnBoarding>;
type Props = IDispatchProps & libraryProps;

export class OnBoardingScreen extends React.PureComponent<Props, IOnBoardingScreenState> {
  public state = {
    activeSlide: 0,
    ref: null,
    data: [],
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getOnBoardingData();
  };

  public render(): React.ReactNode {
    const { t } = this.props;
    const { data, activeSlide } = this.state;

    if (data.length === 0) {
      return null;
    }

    const buttonText = activeSlide === data.length - 1 ? t('common:gotIt') : t('common:next');
    const currentSlide: OnBoarding = data[activeSlide];
    return (
      <SafeAreaView style={styles.container}>
        {this.renderSkipButton()}
        <View style={styles.carousel}>
          <SnapCarousel
            bubbleRef={this.updateRef}
            carouselData={data}
            carouselItem={this.renderCarouselItem}
            activeIndex={activeSlide}
            onSnapToItem={this.onSnapToItem}
            testID="carsl"
          />
          <PaginationComponent dotsLength={data.length} activeSlide={activeSlide} />
        </View>
        <View style={styles.textContainer}>
          <Text type="large" textType="bold">
            {currentSlide.title}
          </Text>
          <Label type="large" textType="regular" style={styles.description}>
            {currentSlide.description}
          </Label>
          <Button
            type="primary"
            title={buttonText}
            onPress={this.renderNextFrame}
            containerStyle={styles.button}
            testID="btnNextFrame"
          />
        </View>
      </SafeAreaView>
    );
  }

  private renderCarouselItem = (item: OnBoarding): React.ReactElement => {
    return <SVGUri viewBox="0 0 327 220" preserveAspectRatio="xMidYMid meet" uri={item.imageUrl} />;
  };

  public renderNextFrame = async (): Promise<void> => {
    const { activeSlide, ref, data } = this.state;
    if (activeSlide < data.length - 1 && ref) {
      // @ts-ignore
      ref.snapToNext();
      this.setState({ activeSlide: activeSlide + 1 });
    } else {
      await this.navigateToGettingStarted();
    }
  };

  public renderSkipButton = (): React.ReactNode => {
    const { t } = this.props;
    const { data, activeSlide } = this.state;
    if (activeSlide === data.length - 1) {
      return <View style={styles.emptySkipView} />;
    }
    return (
      <View style={styles.skipLinkContainer}>
        <Button
          type="secondary"
          title={t('skip')}
          containerStyle={styles.skipLink}
          onPress={this.navigateToGettingStarted}
          testID="btnGettingStarted"
        />
      </View>
    );
  };

  public onSnapToItem = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
  };

  public getOnBoardingData = async (): Promise<void> => {
    try {
      const response = await CommonRepository.getOnBoarding();
      this.setState({
        data: response,
      });
    } catch (error) {
      AlertHelper.error({ message: error.message });
    }
  };

  public navigateToGettingStarted = async (): Promise<void> => {
    const { navigation, updateOnBoarding } = this.props;
    updateOnBoarding(true);
    await StorageService.set(StorageKeys.IS_ONBOARDING_COMPLETED, true);
    navigation.navigate(ScreensKeys.GettingStarted);
  };

  public updateRef = (ref: any): void => {
    this.setState({ ref });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.onBoardingScreenBackground,
    justifyContent: 'space-around',
  },
  carousel: {
    flex: 1,
    alignSelf: 'center',
  },
  textContainer: {
    flex: 1,
    padding: theme.layout.screenPadding,
    justifyContent: 'space-around',
    alignItems: 'center',
    textAlign: 'center',
  },
  skipLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  emptySkipView: {
    height: 48,
  },
  skipLink: {
    flex: 0,
    backgroundColor: theme.colors.transparent,
    borderWidth: 0,
    alignItems: 'flex-end',
  },
  description: {
    textAlign: 'center',
  },
  button: {
    flex: 0,
  },
});

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { updateOnBoarding } = UserActions;
  return bindActionCreators(
    {
      updateOnBoarding,
    },
    dispatch
  );
};

export default connect(null, mapDispatchToProps)(withTranslation()(OnBoardingScreen));