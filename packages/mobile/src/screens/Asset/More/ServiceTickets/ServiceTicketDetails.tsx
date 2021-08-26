import React from 'react';
import { PickerItemProps, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { LinkingService } from '@homzhub/mobile/src/services/LinkingService';
import { CommonParamList } from '@homzhub/mobile/src/navigation/Common';
import HandleBack from '@homzhub/mobile/src/navigation/HandleBack';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import TicketActivityCard from '@homzhub/common/src/components/molecules/TicketActivity';
import TicketDetailsCard from '@homzhub/common/src/components/molecules/TicketDetailsCard';
import {
  AssetDetailsImageCarousel,
  BottomSheetListView,
  FullScreenAssetDetailsCarousel,
} from '@homzhub/mobile/src/components';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { Ticket, TicketStatus } from '@homzhub/common/src/domain/models/Ticket';
import { TicketAction } from '@homzhub/common/src/domain/models/TicketAction';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { ICurrentTicket } from '@homzhub/common/src/modules/tickets/interface';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { TakeActionTitle } from '@homzhub/common/src/constants/ServiceTickets';

interface ITicketAction {
  title: string;
  onPress: () => void;
  isDisabled: boolean;
}

interface IDispatchProps {
  getTicketDetail: (payload: number) => void;
  clearState: () => void;
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
  hasClickedWorkDone: boolean;
}

type NavProps = NavigationScreenProps<CommonParamList, ScreensKeys.ServiceTicketDetail>;
type Props = NavProps & WithTranslation & IDispatchProps & IStateProps;

class ServiceTicketDetails extends React.Component<Props, IScreenState> {
  public focusListener: any;

  public state = {
    activeSlide: 0,
    isFullScreen: false,
    isActionSheet: false,
    selectedAction: '',
    hasClickedWorkDone: false,
  };

  public componentDidMount = (): void => {
    const { navigation, currentTicket, getTicketDetail } = this.props;

    this.focusListener = navigation.addListener('focus', () => {
      if (currentTicket) {
        getTicketDetail(currentTicket.ticketId);
      }
    });
  };

  public render = (): React.ReactNode => {
    const { isActionSheet, selectedAction } = this.state;
    const { t, ticketDetails, isLoading } = this.props;

    const actionList = this.getActionList();
    const title = ticketDetails ? ticketDetails.asset.projectName : t('common:detail');
    return (
      <HandleBack onBack={this.handleGoBack}>
        <UserScreen
          title={title}
          pageTitle={t('serviceTickets:ticketDetails')}
          loading={isLoading}
          onBackPress={this.handleGoBack}
          contentContainerStyle={styles.userScreen}
        >
          <View style={styles.container}>
            {!isLoading && !ticketDetails && <EmptyState isIconRequired={false} title={t('serviceTickets:noDetail')} />}
            {this.renderDetailsCard()}
            {this.renderActivityCard()}
          </View>
        </UserScreen>
        {this.renderActionButton()}
        {this.renderFullscreenCarousel()}
        <BottomSheetListView
          selectedValue={selectedAction}
          listHeight={350}
          data={actionList}
          listTitle={t('chooseAction')}
          onSelectItem={this.onSelectAction}
          onCloseDropDown={(): void => this.handleActionSheet(false)}
          isBottomSheetVisible={isActionSheet}
        />
      </HandleBack>
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
    const { isFullScreen, activeSlide, hasClickedWorkDone } = this.state;
    const { ticketDetails } = this.props;
    if (!isFullScreen || !ticketDetails) return null;
    let workDoneAttachments: Attachment[] = [];
    if (ticketDetails.status === TicketStatus.CLOSED) {
      const { activities } = ticketDetails;
      const lastActivity = activities[activities.length - 1];
      workDoneAttachments = lastActivity.data?.attachments ?? [];
    }
    return (
      <FullScreenAssetDetailsCarousel
        onFullScreenToggle={this.enableFullScreenWithImage}
        activeSlide={activeSlide}
        data={hasClickedWorkDone ? workDoneAttachments : ticketDetails.ticketAttachments}
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

  private renderActionButton = (): React.ReactElement | null => {
    const { ticketDetails } = this.props;
    if (!ticketDetails) return null;
    const buttonData = this.getActionData(ticketDetails.status, ticketDetails.actions);

    if (!buttonData) return null;
    return (
      <View style={styles.buttonContainer}>
        <Button type="primary" title={buttonData.title} disabled={buttonData.isDisabled} onPress={buttonData.onPress} />
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
    const { navigation } = this.props;

    switch (value) {
      case TakeActionTitle.REASSIGN_TICKET:
        navigation.navigate(ScreensKeys.ReassignTicket);
        break;
      case TakeActionTitle.SUBMIT_QUOTE:
        navigation.navigate(ScreensKeys.SubmitQuote);
        break;
      case TakeActionTitle.APPROVE_QUOTE:
        navigation.navigate(ScreensKeys.ApproveQuote);
        break;
      case TakeActionTitle.WORK_COMPLETED:
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
      hasClickedWorkDone: true,
    }));
  };

  private handleActionSheet = (isOpen: boolean): void => {
    this.setState({ isActionSheet: isOpen });
  };

  private handleGoBack = (): void => {
    const { navigation, clearState } = this.props;
    this.setState({ isFullScreen: false });
    clearState();
    navigation.goBack();
  };

  private enableFullScreenWithImage = (): void => {
    this.setState((prevState) => ({
      isFullScreen: !prevState.isFullScreen,
      hasClickedWorkDone: false,
    }));
  };

  private updateSlide = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
  };

  private handleQuoteClick = async (url: string): Promise<void> => {
    await LinkingService.canOpenURL(url);
  };

  /* Take action button logic */
  private getActionData = (status: string, actions: TicketAction): ITicketAction | null => {
    const { navigation } = this.props;
    const { canApproveQuote, canCloseTicket, canSubmitQuote, canReassignTicket } = actions;
    switch (status) {
      // Todo (Praharsh) : Update status handler when BE is done with changing ticket's status.
      case TicketStatus.OPEN:
      case TicketStatus.QUOTE_REQUESTED:
        return {
          title: TakeActionTitle.REASSIGN_TICKET,
          onPress: (): void => navigation.navigate(ScreensKeys.ReassignTicket),
          isDisabled: !canReassignTicket,
        };
      case TicketStatus.TICKET_REASSIGNED:
        return {
          title: TakeActionTitle.SUBMIT_QUOTE,
          onPress: (): void => navigation.navigate(ScreensKeys.SubmitQuote),
          isDisabled: !canSubmitQuote,
        };
      case TicketStatus.QUOTE_SUBMITTED:
        return {
          title: TakeActionTitle.APPROVE_QUOTE,
          onPress: (): void => navigation.navigate(ScreensKeys.ApproveQuote),
          isDisabled: !canApproveQuote,
        };
      case TicketStatus.QUOTE_APPROVED:
        return {
          title: TakeActionTitle.WORK_COMPLETED,
          onPress: (): void => navigation.navigate(ScreensKeys.WorkCompleted),
          isDisabled: !canCloseTicket,
        };
      case TicketStatus.WORK_COMPLETED:
      default:
        return null;
    }
  };

  /* Take action dropdown data logic */
  private getActionList = (): PickerItemProps[] => {
    const { ticketDetails } = this.props;
    if (!ticketDetails) return [];
    const { canCloseTicket, canApproveQuote, canSubmitQuote, canReassignTicket } = ticketDetails.actions;
    const { SUBMIT_QUOTE, WORK_COMPLETED, APPROVE_QUOTE, REASSIGN_TICKET } = TakeActionTitle;

    const list: PickerItemProps[] = [];

    if (canReassignTicket) {
      list.push({ label: REASSIGN_TICKET, value: REASSIGN_TICKET });
    }
    if (canSubmitQuote) {
      list.push({ label: SUBMIT_QUOTE, value: SUBMIT_QUOTE });
    }
    if (canApproveQuote) {
      list.push({ label: APPROVE_QUOTE, value: APPROVE_QUOTE });
    }
    if (canCloseTicket) {
      list.push({ label: WORK_COMPLETED, value: WORK_COMPLETED });
    }

    return list;
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
  const { getTicketDetail, clearState } = TicketActions;
  return bindActionCreators(
    {
      getTicketDetail,
      clearState,
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
