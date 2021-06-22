import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { CommonParamList } from '@homzhub/mobile/src/navigation/Common';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { CollapsibleSection } from '@homzhub/mobile/src/components';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import ScheduleVisitForm from '@homzhub/common/src/components/organisms/ScheduleVisitForm';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IVisitState {
  isCollapsed: boolean;
  isLoading: boolean;
}

type libraryProps = WithTranslation & NavigationScreenProps<CommonParamList, ScreensKeys.BookVisit>;
type Props = libraryProps;

export class BookVisit extends Component<Props, IVisitState> {
  public state = {
    isCollapsed: true,
    isLoading: false,
  };

  public render(): React.ReactNode {
    const { isCollapsed, isLoading } = this.state;
    const {
      t,
      route: { params },
    } = this.props;
    return (
      <Screen
        backgroundColor={theme.colors.white}
        isLoading={isLoading}
        headerProps={{
          onIconPress: this.goBack,
          type: 'secondary',
          title: t('assetDescription:BookVisit'),
          icon: icons.close,
        }}
      >
        {/* @ts-ignore */}
        <ScheduleVisitForm
          isCollapsed={isCollapsed}
          isReschedule={params ? params.isReschedule : false}
          leaseListingId={params.lease_listing_id}
          saleListingId={params.sale_listing_id}
          userId={params.userId}
          renderCollapseSection={this.renderCollapsibleSection}
          setLoading={this.setLoading}
          onSubmitSuccess={this.goBack}
        />
      </Screen>
    );
  }

  private renderCollapsibleSection = (children: React.ReactElement, title: string): React.ReactElement => {
    const { isCollapsed } = this.state;
    return (
      <CollapsibleSection
        title={title}
        icon={icons.watch}
        titleStyle={styles.upcomingTitle}
        initialCollapsedValue={isCollapsed}
        onCollapse={this.handleSlotView}
      >
        {children}
      </CollapsibleSection>
    );
  };

  private handleSlotView = (isCollapsed: boolean): void => {
    this.setState({ isCollapsed });
  };

  private setLoading = (isLoading: boolean): void => {
    this.setState({ isLoading });
  };

  private goBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}
export default withTranslation()(BookVisit);

const styles = StyleSheet.create({
  upcomingTitle: {
    marginLeft: 12,
  },
});
