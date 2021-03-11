import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { LinkingService } from '@homzhub/mobile/src/services/LinkingService';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import TicketActivityCard from '@homzhub/common/src/components/molecules/TicketActivity';
import TicketDetailsCard from '@homzhub/common/src/components/molecules/TicketDetailsCard';
import {
  AssetDetailsImageCarousel,
  BottomSheetListView,
  FullScreenAssetDetailsCarousel,
} from '@homzhub/mobile/src/components';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { Ticket } from '@homzhub/common/src/domain/models/Ticket';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { ICurrentTicket } from '@homzhub/common/src/modules/tickets/interface';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { ticketActions, TicketActionType } from '@homzhub/common/src/constants/ServiceTickets';

interface IDispatchProps {
  getTicketDetail: (payload: number) => void;
  setCurrentTicket: (payload: ICurrentTicket) => void;
}

interface IStateProps {
  currentTicket: ICurrentTicket | null;
  ticketDetails: Ticket | null;
  isLoading: boolean;
}

interface IScreenState {
  activeSlide: number;
  isFullScreen: boolean;
  isActionSheet: boolean;
  selectedAction: string;
}

type NavProps = NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.ServiceTicketDetail>;
type Props = NavProps & WithTranslation & IDispatchProps & IStateProps;

class ServiceTicketDetails extends React.Component<Props, IScreenState> {
  public focusListener: any;

  public state = {
    activeSlide: 0,
    isFullScreen: false,
    isActionSheet: false,
    selectedAction: '',
  };

  public componentDidMount = (): void => {
    const { navigation, currentTicket, getTicketDetail } = this.props;

    this.focusListener = navigation.addListener('focus', () => {
      if (currentTicket) {
        getTicketDetail(currentTicket.ticketId);
      }
    });
  };

  public render = (): React.ReactElement | null => {
    const { isActionSheet, selectedAction } = this.state;
    const {
      navigation: { goBack },
      t,
      ticketDetails,
      isLoading,
    } = this.props;

    if (!ticketDetails) return null;

    const {
      asset: { projectName },
    } = ticketDetails;
    return (
      <>
        <UserScreen
          title={projectName}
          pageTitle={t('serviceTickets:ticketDetails')}
          loading={isLoading}
          onBackPress={goBack}
          contentContainerStyle={styles.userScreen}
        >
          <View style={styles.container}>
            {this.renderDetailsCard()}
            {this.renderActivityCard()}
          </View>
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

  private renderDetailsCard = (): React.ReactElement | null => {
    const { ticketDetails } = this.props;
    if (!ticketDetails) return null;
    return <TicketDetailsCard ticketData={ticketDetails} ticketImages={this.renderCarousel(ticketDetails)} />;
  };

  private renderCarousel = (detail: Ticket): React.ReactElement => {
    const { activeSlide, isFullScreen } = this.state;

    if (!detail.ticketAttachments.length) {
      return <ImagePlaceholder height="100%" containerStyle={styles.carousel} />;
    }

    return (
      <>
        {!isFullScreen && (
          <AssetDetailsImageCarousel
            enterFullScreen={this.enableFullScreenWithImage}
            data={detail.ticketAttachments}
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
    const { ticketDetails } = this.props;
    if (!isFullScreen || !ticketDetails) return null;
    return (
      <FullScreenAssetDetailsCarousel
        onFullScreenToggle={this.enableFullScreenWithImage}
        activeSlide={activeSlide}
        data={ticketDetails.ticketAttachments}
        updateSlide={this.updateSlide}
        hasOnlyImages
      />
    );
  };

  private renderActivityCard = (): React.ReactElement | null => {
    const { ticketDetails } = this.props;
    if (!ticketDetails) return null;
    return (
      <TicketActivityCard
        ticketData={ticketDetails}
        onPressQuote={this.handleQuoteClick}
        onPressImage={this.onFullScreenToggleCompleted}
      />
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

  // HANDLERS START

  private onSelectAction = (value: string): void => {
    const { navigation, setCurrentTicket, ticketDetails } = this.props;
    if (!ticketDetails) return;
    // TODO: (Shikha) Handle logic
    setCurrentTicket({
      ticketId: ticketDetails.id,
      quoteRequestId: ticketDetails.quoteRequestId,
      propertyName: ticketDetails.asset.projectName,
    });

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

const mapStateToProps = (state: IState): IStateProps => {
  const { getCurrentTicket, getTicketDetail, getTicketDetailLoader } = TicketSelectors;
  return {
    currentTicket: getCurrentTicket(state),
    ticketDetails: getTicketDetail(state),
    isLoading: getTicketDetailLoader(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getTicketDetail, setCurrentTicket } = TicketActions;
  return bindActionCreators(
    {
      getTicketDetail,
      setCurrentTicket,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ServiceTicketDetails));

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
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
