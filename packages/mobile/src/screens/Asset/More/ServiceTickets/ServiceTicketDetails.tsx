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
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import TicketActivityCard from '@homzhub/common/src/components/molecules/TicketActivity';
import TicketDetailsCard from '@homzhub/common/src/components/molecules/TicketDetailsCard';
import {
  AssetDetailsImageCarousel,
  BottomSheetListView,
  FullScreenAssetDetailsCarousel,
} from '@homzhub/mobile/src/components';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { Ticket, TicketStatus } from '@homzhub/common/src/domain/models/Ticket';
import { TicketAction } from '@homzhub/common/src/domain/models/TicketAction';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { ICurrentTicket, ITicketState } from '@homzhub/common/src/modules/tickets/interface';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { TicketActions as Actions } from '@homzhub/common/src/constants/ServiceTickets';

interface ITicketAction {
  title: string;
  onPress: () => void;
  isDisabled: boolean;
}

interface IDispatchProps {
  getTicketDetail: (payload: number) => void;
  clearState: () => void;
  sendTicketReminder: () => void;
}

interface IStateProps {
  currentTicket: ICurrentTicket | null;
  ticketDetails: Ticket | null;
  isLoading: boolean;
  ticketLoader: ITicketState['loaders'];
  ticketActions: TicketAction[];
}

interface IScreenState {
  activeSlide: number;
  isFullScreen: boolean;
  isActionSheet: boolean;
  selectedAction: string;
  hasClickedWorkDone: boolean;
  showRemindSheet: boolean;
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
    showRemindSheet: false,
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
    const { isActionSheet, selectedAction, showRemindSheet } = this.state;
    const {
      t,
      ticketDetails,
      isLoading,
      ticketLoader: { closeTicket, ticketReminder },
    } = this.props;

    const actionList = this.getActionList();
    const title = ticketDetails ? ticketDetails.asset.projectName : t('common:detail');
    return (
      <HandleBack onBack={this.handleGoBack}>
        <UserScreen
          title={title}
          pageTitle={t('serviceTickets:ticketDetails')}
          loading={isLoading || closeTicket || ticketReminder}
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
          onSelectItem={this.handleAction}
          onCloseDropDown={(): void => this.handleActionSheet(false)}
          isBottomSheetVisible={isActionSheet}
          extraContent={showRemindSheet ? this.renderRemindSheet : undefined}
        />
      </HandleBack>
    );
  };

  private renderDetailsCard = (): React.ReactElement | null => {
    const { ticketDetails } = this.props;
    if (!ticketDetails) return null;
    return (
      <TicketDetailsCard
        ticketData={ticketDetails}
        ticketImages={this.renderCarousel(ticketDetails)}
        renderRatingForm={this.renderRatingSheet}
        successCallback={this.onSuccessCallback}
      />
    );
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
    const { ticketDetails, ticketActions } = this.props;
    if (!ticketDetails) return null;

    // Check close ticket action is allowed or not
    const isCloseAllowed = ticketActions.find((item) => item.code === Actions.CLOSE_TICKET)?.isAllowed;
    return (
      <TicketActivityCard
        ticketData={ticketDetails}
        isCloseAllowed={isCloseAllowed}
        onPressQuote={this.handleQuoteClick}
        onPressImage={this.onFullScreenToggleCompleted}
      />
    );
  };

  private renderActionButton = (): React.ReactElement | null => {
    const { ticketDetails } = this.props;
    if (!ticketDetails) return null;
    const buttonData = this.getActionData();

    if (!buttonData) return null;
    return (
      <View style={styles.buttonContainer}>
        <Button type="primary" title={buttonData.title} disabled={buttonData.isDisabled} onPress={buttonData.onPress} />
        <Button
          type="primary"
          iconSize={20}
          icon={icons.downArrow}
          iconColor={theme.colors.white}
          containerStyle={styles.iconButton}
          onPress={(): void => this.handleActionSheet(true)}
        />
      </View>
    );
  };

  private renderRemindSheet = (): React.ReactElement => {
    const { t, sendTicketReminder } = this.props;
    const { showRemindSheet } = this.state;

    const onConfirmSendReminder = (): void => {
      sendTicketReminder();
      this.hideActionAndRemindSheets();
    };

    return (
      <BottomSheet
        visible={showRemindSheet}
        sheetHeight={theme.viewport.height / 2.8}
        onCloseSheet={this.hideRemindSheet}
        headerTitle={t('serviceTickets:remindToPay')}
        headerStyles={styles.remindHeader}
      >
        <View style={styles.remindSheetContent}>
          <Text type="small" style={styles.remindConfirmationText}>
            {t('serviceTickets:sendReminderConfirmation')}
          </Text>

          <View style={styles.remindInfoContainer}>
            <Icon name={icons.roundFilled} size={5} color={theme.colors.darkTint3} />
            <Label type="regular" textType="regular" style={styles.remindInfoText}>
              {t('serviceTickets:onceIn12Hours')}
            </Label>
          </View>

          <View style={styles.remindButtonsContainer}>
            <Button
              type="secondaryOutline"
              title={t('cancel')}
              titleStyle={styles.remindCancelTitle}
              onPress={this.hideRemindSheet}
              containerStyle={styles.remindCancelButton}
            />
            <Button type="primary" title={t('serviceTickets:remindNow')} onPress={onConfirmSendReminder} />
          </View>
        </View>
      </BottomSheet>
    );
  };

  private renderRatingSheet = (children: React.ReactElement, onClose: () => void): React.ReactElement => {
    const { t } = this.props;
    return (
      <BottomSheet visible headerTitle={t('serviceTickets:ticketReview')} sheetHeight={600} onCloseSheet={onClose}>
        {children}
      </BottomSheet>
    );
  };

  // HANDLERS START

  private onFullScreenToggleCompleted = (slideNumber: number): void => {
    this.setState((prevState) => ({
      isFullScreen: !prevState.isFullScreen,
      activeSlide: slideNumber,
      hasClickedWorkDone: true,
    }));
  };

  private onSuccessCallback = (): void => {
    const { currentTicket, getTicketDetail } = this.props;
    if (currentTicket) {
      getTicketDetail(currentTicket.ticketId);
    }
  };

  private handleActionSheet = (isOpen: boolean): void => {
    this.setState({ isActionSheet: isOpen });
  };

  private handleGoBack = (): void => {
    const {
      navigation,
      clearState,
      route: { params },
    } = this.props;
    this.setState({ isFullScreen: false });
    clearState();
    if (params && params.isFromScreen) {
      navigation.navigate(ScreensKeys.ServiceTicketScreen, { isFromScreenLevel: true });
    } else {
      navigation.goBack();
    }
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

  // Take action button logic
  private getActionData = (): ITicketAction | null => {
    const { ticketActions } = this.props;
    if (!ticketActions) return null;

    const nextAction = ticketActions.filter((item) => item.isNext && item.code !== Actions.CLOSE_TICKET)[0];
    if (!nextAction) return null;
    return {
      title: nextAction.label,
      onPress: (): void => this.handleAction(nextAction.code),
      isDisabled: !nextAction.isAllowed,
    };
  };

  // Take action button handler
  private handleAction = (code: string): void => {
    const { navigation } = this.props;
    const { isActionSheet } = this.state;
    switch (code) {
      case Actions.REQUEST_QUOTE:
        navigation.navigate(ScreensKeys.RequestQuote);
        break;
      case Actions.SUBMIT_QUOTE:
        navigation.navigate(ScreensKeys.SubmitQuote);
        break;
      case Actions.APPROVE_QUOTE:
        navigation.navigate(ScreensKeys.ApproveQuote);
        break;
      case Actions.INITIATE_WORK:
        navigation.navigate(ScreensKeys.WorkInitiated);
        break;
      case Actions.WORK_COMPLETED:
        navigation.navigate(ScreensKeys.WorkCompleted);
        break;
      case Actions.SEND_UPDATES:
        navigation.navigate(ScreensKeys.UpdateTicketStatus);
        break;
      case Actions.REASSIGN_TICKET:
        navigation.navigate(ScreensKeys.ReassignTicket);
        break;
      case Actions.QUOTE_PAYMENT:
        navigation.navigate(ScreensKeys.QuotePayment);
        break;
      default:
        break;
    }

    if (isActionSheet) {
      this.handleActionSheet(false);
    }
  };

  // Take action dropdown data logic
  private getActionList = (): PickerItemProps[] => {
    const { ticketActions } = this.props;
    if (!ticketActions) return [];

    // Excluding close ticket option from list
    return ticketActions
      .filter((actions) => actions.code !== Actions.CLOSE_TICKET)
      .map((item) => {
        return {
          label: item.label,
          value: item.code,
        };
      });
  };

  private showRemindSheet = (): void => {
    this.setState({ showRemindSheet: true });
  };

  private hideRemindSheet = (): void => {
    this.setState({ showRemindSheet: false });
  };

  private hideActionAndRemindSheets = (): void => {
    this.setState({ showRemindSheet: false, isActionSheet: false });
  };

  // HANDLERS END
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getCurrentTicket, getTicketDetail, getTicketDetailLoader, getTicketLoaders, getTicketActions } =
    TicketSelectors;
  return {
    currentTicket: getCurrentTicket(state),
    ticketDetails: getTicketDetail(state),
    isLoading: getTicketDetailLoader(state),
    ticketLoader: getTicketLoaders(state),
    ticketActions: getTicketActions(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getTicketDetail, clearState, sendTicketReminder } = TicketActions;
  return bindActionCreators(
    {
      getTicketDetail,
      clearState,
      sendTicketReminder,
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
    height: 150,
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
  remindHeader: {
    fontSize: 20,
  },
  remindSheetContent: {
    paddingHorizontal: 16,
    flex: 1,
  },
  remindConfirmationText: {
    color: theme.colors.darkTint3,
  },
  remindInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  remindInfoText: {
    color: theme.colors.darkTint3,
    marginStart: 5,
  },
  remindButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  remindCancelButton: {
    borderWidth: 1,
    borderColor: theme.colors.primaryColor,
    marginEnd: 16,
  },
  remindCancelTitle: {
    color: theme.colors.primaryColor,
  },
});
