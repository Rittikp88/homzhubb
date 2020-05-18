import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { OnboardingActions } from '@homzhub/common/src/modules/onboarding/actions';
import { IOnboardingState } from '@homzhub/common/src/modules/onboarding/interface';
import { Button, Label, Text } from '@homzhub/common/src/components/';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { theme } from '@homzhub/common/src/styles/theme';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { IState } from '@homzhub/common/src/modules/interfaces';

interface IOwnProps {
  navigation: NavigationScreenProps<AuthStackParamList, ScreensKeys.GettingStarted>;
}

interface IStateProps {
  onboarding: IOnboardingState;
}

interface IDispatchProps {
  getOnboardingDetail: () => void;
}

interface IOnboardingScreenState {
  activeSlide: number;
  ref: any;
}

type Props = IOwnProps & IStateProps & IDispatchProps & WithTranslation;

class Onboarding extends React.Component<Props, IOnboardingScreenState> {
  public state = {
    activeSlide: 0,
    ref: null,
  };

  public componentDidMount(): void {
    const { getOnboardingDetail } = this.props;
    getOnboardingDetail();
  }

  public render(): React.ReactElement {
    const { onboarding } = this.props;
    const { activeSlide } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {this.renderSkipButton()}
        <SnapCarousel
          bubbleRef={this.updateRef}
          carouselItems={onboarding.data}
          activeSlide={activeSlide}
          showPagination
          currentSlide={this.changeSlide}
        />
        <Text type="large" textType="bold" style={styles.heading}>
          {onboarding.data[activeSlide].heading || ''}
        </Text>
        <Label type="large" textType="regular" style={styles.description}>
          {onboarding.data[activeSlide].description || ''}
        </Label>
        <View style={styles.skipContainer}>
          <Button
            type="primary"
            title={onboarding.data[activeSlide].buttonText}
            onPress={this.renderNextFrame}
            containerStyle={styles.button}
          />
        </View>
      </SafeAreaView>
    );
  }

  public renderNextFrame = (): void => {
    const { activeSlide, ref } = this.state;
    const { onboarding } = this.props;
    if (activeSlide < onboarding.data.length - 1) {
      ref.snapToNext();
      this.setState({ activeSlide: activeSlide + 1 });
    } else {
      this.navigateToGettingStarted();
    }
  };

  public renderSkipButton = (): React.ReactNode => {
    const { onboarding, t } = this.props;
    const { activeSlide } = this.state;
    if (activeSlide === onboarding.data.length - 1) {
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

  public navigateToGettingStarted = (): void => {
    const { navigation } = this.props;
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
    backgroundColor: theme.colors.onboardingScreenBackground,
  },
  skipContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  emptySkipView: {
    height: 48,
  },
  skipLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  skipLink: {
    flex: 0,
    backgroundColor: theme.colors.transparent,
    borderWidth: 0,
    alignItems: 'flex-end',
  },
  heading: {
    textAlign: 'center',
    marginVertical: 20,
    marginBottom: 30,
  },
  description: {
    textAlign: 'center',
  },
  button: {
    flex: 0,
    marginVertical: 20,
  },
});

const mapStateToProps = (state: IState): IStateProps => {
  return {
    onboarding: state.onboarding,
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getOnboardingDetail } = OnboardingActions;
  return bindActionCreators(
    {
      getOnboardingDetail,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(withTranslation()(Onboarding)));
