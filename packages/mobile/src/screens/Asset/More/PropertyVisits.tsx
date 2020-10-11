import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { icons } from '@homzhub/common/src/assets/icon';
import { AnimatedProfileHeader, HeaderCard } from '@homzhub/mobile/src/components';
import { DropdownWithCountry } from '@homzhub/mobile/src/components/molecules/DropdownWithCountry';
import SiteVisitTab from '@homzhub/mobile/src/components/organisms/SiteVisitTab';
import SiteVisitCalendarView from '@homzhub/mobile/src/components/organisms/SiteVisitCalendarView';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IDispatchProps {
  clearAsset: () => void;
}

interface IScreenState {
  isCalendarView: boolean;
}

type libraryProps = NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.PropertyVisits>;
type Props = WithTranslation & libraryProps & IDispatchProps;

class PropertyVisits extends Component<Props, IScreenState> {
  public state = {
    isCalendarView: false,
  };

  public render(): React.ReactNode {
    const { t } = this.props;
    return (
      <AnimatedProfileHeader isOuterScrollEnabled={false} title={t('assetMore:more')}>
        <HeaderCard
          title={t('assetMore:propertyVisits')}
          titleFontWeight="semiBold"
          renderItem={(): React.ReactElement => this.renderPropertyVisits()}
          onIconPress={this.handleBack}
          handleIcon={this.handleCalendarPress}
          icon={icons.calendar}
          containerStyles={styles.headerContainer}
          headerStyle={styles.headerStyle}
        />
      </AnimatedProfileHeader>
    );
  }

  private renderPropertyVisits = (): React.ReactElement => {
    const { isCalendarView } = this.state;
    return (
      <>
        <DropdownWithCountry />
        {isCalendarView ? (
          <SiteVisitCalendarView onReschedule={this.rescheduleVisit} />
        ) : (
          <SiteVisitTab onReschedule={this.rescheduleVisit} />
        )}
      </>
    );
  };

  private handleBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private handleCalendarPress = (): void => {
    const { isCalendarView } = this.state;
    this.setState({
      isCalendarView: !isCalendarView,
    });
  };

  private rescheduleVisit = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.SearchStack, {
      screen: ScreensKeys.BookVisit,
      params: { isReschedule: true },
    });
  };
}

export default withTranslation()(PropertyVisits);

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 0,
  },
  headerStyle: {
    paddingHorizontal: 10,
  },
});
