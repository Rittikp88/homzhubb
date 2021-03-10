import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { LinkingService } from '@homzhub/mobile/src/services/LinkingService';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import TicketDetailsCard from '@homzhub/common/src/components/molecules/TicketDetailsCard';
import TicketActivityCard from '@homzhub/common/src/components/molecules/TicketActivity';
import {
  AssetDetailsImageCarousel,
  BottomSheetListView,
  FullScreenAssetDetailsCarousel,
} from '@homzhub/mobile/src/components';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { mockTicketDetails, ticketActions, TicketActionType } from '@homzhub/common/src/constants/ServiceTickets';

type NavProps = NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.ServiceTicketDetail>;

type Props = NavProps & WithTranslation;

interface IScreenState {
  activeSlide: number;
  isFullScreen: boolean;
  isActionSheet: boolean;
  selectedAction: string;
}
class ServiceTicketDetails extends React.Component<Props, IScreenState> {
  public state = {
    activeSlide: 0,
    isFullScreen: false,
    isActionSheet: false,
    selectedAction: '',
  };

  public render = (): React.ReactElement => {
    const { isActionSheet, selectedAction } = this.state;
    const {
      navigation: { goBack },
      t,
    } = this.props;
    return (
      <>
        <UserScreen
          // ToDo : Praharsh : Replace hard coded string
          title="Property Name"
          pageTitle={t('serviceTickets:ticketDetails')}
          loading={false}
          onBackPress={goBack}
          contentContainerStyle={styles.userScreen}
        >
          {this.renderDetailsCard()}
          {this.renderActivityCard()}
        </UserScreen>
        {this.renderActionButton()}
        {this.renderFullscreenCarousel()}
        <BottomSheetListView
          selectedValue={selectedAction}
          listHeight={350}
          data={ticketActions}
          listTitle={t('chooseAction')}
          onSelectItem={this.onSelectAction}
          onCloseDropDown={(): void => this.handleActionSheet(false)}
          isBottomSheetVisible={isActionSheet}
        />
      </>
    );
  };

  private renderActionButton = (): React.ReactElement => {
    const { t } = this.props;
    // TODO: (Shikha) -Add take action button title logic
    return (
      <View style={styles.buttonContainer}>
        <Button type="primary" title={t('assetDashboard:takeActions')} />
        <Button
          type="primary"
          icon={icons.downArrow}
          iconSize={20}
          iconColor={theme.colors.white}
          containerStyle={styles.iconButton}
          onPress={(): void => this.handleActionSheet(true)}
        />
      </View>
    );
  };

  private renderCarousel = (): React.ReactElement => {
    const { activeSlide, isFullScreen } = this.state;

    if (!mockTicketDetails.ticketAttachments.length) {
      return <ImagePlaceholder height="100%" containerStyle={styles.placeholder} />;
    }
    return (
      <>
        {!isFullScreen && (
          <AssetDetailsImageCarousel
            enterFullScreen={this.enableFullScreenWithImage}
            // To-Do (Praharsh : 08.03.2021) : Replace mock with API response
            data={mockTicketDetails.ticketAttachments}
            activeSlide={activeSlide}
            updateSlide={this.updateSlide}
            containerStyles={styles.carousel}
            hasOnlyImages
          />
        )}
      </>
    );
  };

  private renderFullscreenCarousel = (): React.ReactElement | null => {
    const { isFullScreen, activeSlide } = this.state;
    if (!isFullScreen) return null;
    return (
      <FullScreenAssetDetailsCarousel
        onFullScreenToggle={this.enableFullScreenWithImage}
        activeSlide={activeSlide}
        // To-Do (Praharsh : 08.03.2021) : Replace mock with API response
        data={mockTicketDetails.ticketAttachments}
        updateSlide={this.updateSlide}
        hasOnlyImages
      />
    );
  };

  private renderActivityCard = (): React.ReactElement => {
    return (
      <TicketActivityCard
        ticketData={mockTicketDetails}
        onPressQuote={this.handleQuoteClick}
        onPressImage={this.onFullScreenToggleCompleted}
      />
    );
  };

  private renderDetailsCard = (): React.ReactElement => {
    return <TicketDetailsCard ticketData={mockTicketDetails} ticketImages={this.renderCarousel()} />;
  };

  // HANDLERS START

  private onSelectAction = (value: string): void => {
    const { navigation } = this.props;
    switch (value) {
      case TicketActionType.SUBMIT_QUOTE:
        navigation.navigate(ScreensKeys.SubmitQuote);
        break;
      case TicketActionType.APPROVE_QUOTE:
        navigation.navigate(ScreensKeys.ApproveQuote);
        break;
      case TicketActionType.WORK_COMPLETED:
      default:
        navigation.navigate(ScreensKeys.WorkCompleted);
        break;
    }

    this.handleActionSheet(false);
  };

  private onFullScreenToggleCompleted = (slideNumber: number): void => {
    this.setState((prevState) => ({
      isFullScreen: !prevState.isFullScreen,
      activeSlide: slideNumber,
    }));
  };

  private handleActionSheet = (isOpen: boolean): void => {
    this.setState({ isActionSheet: isOpen });
  };

  private enableFullScreenWithImage = (): void => {
    this.setState((prevState) => ({
      isFullScreen: !prevState.isFullScreen,
    }));
  };

  private updateSlide = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
  };

  private handleQuoteClick = async (url: string): Promise<void> => {
    await LinkingService.canOpenURL(url);
  };

  // HANDLERS END
}

export default withTranslation()(ServiceTicketDetails);

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: theme.colors.darkTint5,
  },
  carousel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: theme.viewport.width - 64,
    borderRadius: 10,
    height: 160,
    marginHorizontal: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: theme.colors.white,
  },
  iconButton: {
    flex: 0.2,
    marginLeft: 2,
  },
  userScreen: {
    paddingBottom: 0,
  },
});
