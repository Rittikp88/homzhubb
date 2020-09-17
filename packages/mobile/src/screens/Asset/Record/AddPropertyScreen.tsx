import React, { ReactElement, PureComponent, ReactNode } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';
import { withTranslation, WithTranslation } from 'react-i18next';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components';
import { Header, AddressWithStepIndicator } from '@homzhub/mobile/src/components';
import { PropertyHighlights } from '@homzhub/mobile/src/components/organisms/PropertyHighlights';
import PropertyImages from '@homzhub/mobile/src/components/organisms/PropertyImages';

interface IRoutes {
  key: string;
  title: string;
}

const Routes: IRoutes[] = [
  { key: 'detail', title: 'Details' },
  { key: 'highlights', title: 'Highlights' },
  { key: 'gallery', title: 'Gallery' },
];

const Steps = ['Details', 'Highlights', 'Gallery'];

interface IScreenState {
  currentIndex: number;
  isStepDone: boolean[];
  progress: number;
}

type Props = WithTranslation & NavigationScreenProps<PropertyPostStackParamList, ScreensKeys.AddPropertyScreen>;

export class AddPropertyScreen extends PureComponent<Props, IScreenState> {
  public state = {
    currentIndex: 0,
    progress: 0,
    isStepDone: [],
  };

  // TODO: Replace static data after api integration
  public render = (): ReactNode => {
    const { currentIndex, isStepDone, progress } = this.state;
    const { t } = this.props;
    return (
      <View style={styles.screen}>
        <Header
          icon={icons.leftArrow}
          title={t('property:addProperty')}
          isBottomStyleVisible
          onIconPress={this.goBack}
        />
        <ScrollView style={styles.content}>
          <AddressWithStepIndicator
            icon={icons.noteBook}
            steps={Steps}
            progress={progress}
            propertyType="Bungalow"
            primaryAddress="Kalpataru Splendour"
            subAddress="Shankar Kalat Nagar, Maharashtra 411057"
            currentIndex={currentIndex}
            isStepDone={isStepDone}
            stepContainerStyle={styles.stepContainer}
            containerStyle={styles.addressCard}
          />
          {this.renderTabHeader()}
          <TabView
            renderScene={this.renderScene}
            onIndexChange={this.handleIndexChange}
            renderTabBar={(): null => null}
            swipeEnabled={false}
            navigationState={{
              index: currentIndex,
              routes: Routes,
            }}
          />
        </ScrollView>
      </View>
    );
  };

  private renderTabHeader = (): ReactElement => {
    const { currentIndex } = this.state;
    const tabTitle = Routes[currentIndex].title;
    return (
      <View style={styles.tabHeader}>
        <Text type="small" textType="semiBold" style={styles.title}>
          {tabTitle}
        </Text>
        {currentIndex > 0 && (
          <Text type="small" textType="semiBold" style={styles.skip}>
            Skip
          </Text>
        )}
      </View>
    );
  };

  // TODO: Replace components once ready
  private renderScene = SceneMap({
    detail: (): ReactElement => <PropertyHighlights handleNextStep={this.handleNextStep} />,
    highlights: (): ReactElement => <PropertyHighlights handleNextStep={this.handleNextStep} />,
    gallery: (): ReactElement => (
      <PropertyImages
        propertyId={60} // TODO: Pass the property id from mapStateToProps
        onPressContinue={this.handleNextStep}
        containerStyle={styles.propertyImagesContainer}
      />
    ),
  });

  private goBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private handleIndexChange = (index: number): void => {
    this.setState({ currentIndex: index });
  };

  private handleNextStep = (): void => {
    const { navigation } = this.props;
    const { currentIndex, isStepDone, progress } = this.state;
    const newStepDone: boolean[] = isStepDone;
    newStepDone[currentIndex] = true;
    this.setState({
      isStepDone: newStepDone,
    });
    if (progress < 100) {
      const progressCount = Number((100 / Steps.length).toFixed(0));
      let newProgress = progress + progressCount;
      if (100 - newProgress === 1) {
        newProgress += 1;
      }
      this.setState({
        progress: newProgress,
      });
    } else {
      navigation.navigate(ScreensKeys.RentServicesScreen);
    }
    if (currentIndex < Routes.length - 1) {
      this.setState({ currentIndex: currentIndex + 1 });
    }
  };
}

export default withTranslation()(AddPropertyScreen);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  tabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  title: {
    paddingVertical: 16,
  },
  skip: {
    color: theme.colors.blue,
  },
  stepContainer: {
    paddingHorizontal: 50,
  },
  addressCard: {
    marginHorizontal: 16,
  },
  propertyImagesContainer: {
    margin: theme.layout.screenPadding,
  },
});
