import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { OnBoardingActions } from '@homzhub/common/src/modules/onboarding/actions';
import { IOnBoardingState } from '@homzhub/common/src/modules/onboarding/interface';
import { Button, Label, Text } from '@homzhub/common/src/components/';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { theme } from '@homzhub/common/src/styles/theme';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { StorageService, StorageKeys } from '@homzhub/common/src/services/storage/StorageService';

interface IStateProps {
  onBoarding: IOnBoardingState;
}

interface IDispatchProps {
  getOnBoardingDetail: () => void;
}

interface IOnBoardingScreenState {
  activeSlide: number;
  ref: any;
}

type IOwnProps = NavigationScreenProps<AuthStackParamList, ScreensKeys.OnBoarding>;
type Props = IOwnProps & IStateProps & IDispatchProps & WithTranslation;

class OnBoarding extends React.PureComponent<Props, IOnBoardingScreenState> {
  public state = {
    activeSlide: 0,
    ref: null,
  };

  public componentDidMount(): void {
    const { getOnBoardingDetail } = this.props;
    getOnBoardingDetail();
  }

  public render(): React.ReactNode {
    const { onBoarding, t } = this.props;
    const { activeSlide } = this.state;
    if (!onBoarding.data) {
      return null;
    }
    const buttonText = activeSlide === onBoarding.data.length - 1 ? t('common:gotIt') : t('common:next');
    return (
      <SafeAreaView style={styles.container}>
        {this.renderSkipButton()}
        <SnapCarousel
          bubbleRef={this.updateRef}
          carouselItems={onBoarding.data}
          activeSlide={activeSlide}
          showPagination
          currentSlide={this.changeSlide}
        />
        <Text type="large" textType="bold" style={styles.title}>
          {onBoarding.data[activeSlide].title || ''}
        </Text>
        <Label type="large" textType="regular" style={styles.description}>
          {onBoarding.data[activeSlide].description || ''}
        </Label>
        <Button type="primary" title={buttonText} onPress={this.renderNextFrame} containerStyle={styles.button} />
      </SafeAreaView>
    );
  }

  public renderNextFrame = async (): Promise<void> => {
    const { activeSlide, ref } = this.state;
    const { onBoarding } = this.props;
    if (activeSlide < onBoarding.data.length - 1 && ref) {
      ref.snapToNext();
      this.setState({ activeSlide: activeSlide + 1 });
    } else {
      await this.navigateToGettingStarted();
    }
  };

  public renderSkipButton = (): React.ReactNode => {
    const { onBoarding, t } = this.props;
    const { activeSlide } = this.state;
    if (activeSlide === onBoarding.data.length - 1) {
      return <View style={styles.emptySkipView} />;
    }
    return (
      <View style={styles.skipLinkContainer}>
        <Button
          type="secondary"
          title={t('skip')}
          containerStyle={styles.skipLink}
          onPress={this.navigateToGettingStarted}
        />
      </View>
    );
  };

  public navigateToGettingStarted = async (): Promise<void> => {
    const { navigation } = this.props;
    await StorageService.set(StorageKeys.IS_ONBOARDING_COMPLETED, true);
    navigation.navigate(ScreensKeys.GettingStarted);
  };

  public changeSlide = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
  };

  public updateRef = (ref: any): void => {
    this.setState({ ref });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.onBoardingScreenBackground,
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
  title: {
    textAlign: 'center',
    marginVertical: 30,
  },
  description: {
    textAlign: 'center',
  },
  button: {
    flex: 0,
    alignSelf: 'center',
    marginVertical: 30,
  },
});

const mapStateToProps = (state: IState): IStateProps => {
  return {
    onBoarding: state.onBoarding,
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getOnBoardingDetail } = OnBoardingActions;
  return bindActionCreators(
    {
      getOnBoardingDetail,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(OnBoarding));
