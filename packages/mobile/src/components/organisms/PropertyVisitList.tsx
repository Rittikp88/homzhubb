import React, { Component } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Avatar, Button, Divider, Dropdown, EmptyState, Label, Text } from '@homzhub/common/src/components';
import { BottomSheet, Loader } from '@homzhub/mobile/src/components';
import { AddressWithVisitDetail } from '@homzhub/mobile/src/components/molecules/AddressWithVisitDetail';
import {
  AssetVisit,
  IVisitActions,
  IVisitByKey,
  RoleType,
  VisitActions,
  VisitStatusType,
} from '@homzhub/common/src/domain/models/AssetVisit';
import { VisitStatus } from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IDropdownObject } from '@homzhub/common/src/constants/FinanceOverview';
import { MISSED_COMPLETED_DATA, UPCOMING_DROPDOWN_DATA } from '@homzhub/common/src/constants/SiteVisit';

// CONSTANTS
const confirmation = ['Yes', 'No'];

// END CONSTANTS

interface IProps {
  visitType: VisitStatusType;
  visitData: IVisitByKey[];
  isLoading: boolean;
  isFromProperty?: boolean;
  handleAction: (id: number, action: VisitActions) => void;
  handleReschedule: (id: number) => void;
  handleDropdown: (startDate: string, endDate: string, visitType: VisitStatusType) => void;
}

interface IScreenState {
  dropdownValue: number;
  isCancelSheet: boolean;
  currentVisitId: number;
}

type Props = IProps & WithTranslation;

class PropertyVisitList extends Component<Props, IScreenState> {
  public state = {
    dropdownValue: 1,
    isCancelSheet: false,
    currentVisitId: 0,
  };

  public render(): React.ReactNode {
    const { visitData, isLoading, t } = this.props;
    const { dropdownValue } = this.state;
    const dropdownData = this.getDropdownData();
    const totalVisit = visitData[0] ? visitData[0].totalVisits : 0;
    return (
      <>
        <View style={styles.headerView}>
          <Label type="regular" style={styles.count}>
            {t('totalVisit', { totalVisit })}
          </Label>
          <Dropdown
            data={dropdownData}
            value={dropdownValue}
            icon={icons.downArrow}
            textStyle={{ color: theme.colors.blue }}
            iconColor={theme.colors.blue}
            onDonePress={this.handleDropdownSelection}
            containerStyle={styles.dropdownStyle}
          />
        </View>
        {visitData.length > 0 ? (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {visitData.map((item) => {
              const results = item.results as AssetVisit[];
              return (
                <>
                  <View style={styles.dateView}>
                    <View style={styles.dividerView} />
                    <Text type="small" style={styles.horizontalStyle}>
                      {item.key}
                    </Text>
                    <View style={styles.dividerView} />
                  </View>
                  {results.map((asset: AssetVisit) => {
                    return this.renderItem(asset);
                  })}
                </>
              );
            })}
          </ScrollView>
        ) : (
          <EmptyState icon={icons.schedule} title={t('noVisits')} />
        )}
        <Loader visible={isLoading} />
        {this.renderCancelConfirmation()}
      </>
    );
  }

  private renderItem = (item: AssetVisit): React.ReactElement => {
    const { asset, user, actions, startDate, endDate, id, role, createdAt, comments } = item;
    const { visitType, handleReschedule, isFromProperty } = this.props;
    const isMissed = visitType === VisitStatusType.MISSED;
    const isCompleted = visitType === VisitStatusType.COMPLETED;

    const userRole = this.getUserRole(role);

    const containerStyle = [styles.container, actions.length > 1 && styles.newVisit];

    const onReschedule = (): void => handleReschedule(id);

    return (
      <View style={styles.mainContainer} key={id}>
        <View style={containerStyle}>
          <Avatar
            fullName={user.fullName}
            isRightIcon
            designation={userRole}
            rating={user.rating}
            date={createdAt}
            containerStyle={styles.horizontalStyle}
          />
          <AddressWithVisitDetail
            primaryAddress={asset.projectName}
            subAddress={asset.address}
            startDate={startDate}
            endDate={endDate}
            comments={comments}
            isFromProperty={isFromProperty}
            isMissedVisit={isMissed}
            isCompletedVisit={isCompleted}
            onPressSchedule={onReschedule}
            containerStyle={styles.horizontalStyle}
          />
          {visitType === VisitStatusType.UPCOMING && this.renderUpcomingView(item)}
        </View>
      </View>
    );
  };

  private renderUpcomingView = (item: AssetVisit): React.ReactElement => {
    const { actions, status, id } = item;
    const visitStatus = this.getVisitStatus(status);

    return (
      <>
        <Divider containerStyles={styles.dividerStyle} />
        <View style={styles.buttonView}>
          {actions.length < 2 && (
            <Button
              type="secondary"
              icon={visitStatus?.icon}
              iconColor={visitStatus?.color}
              iconSize={20}
              title={visitStatus?.title}
              containerStyle={styles.statusView}
              titleStyle={[styles.statusTitle, { color: visitStatus?.color }]}
            />
          )}
          {actions.map((action: string, index: number): React.ReactElement | null => {
            const actionData = this.getActions(action);
            if (!actionData) return null;
            const onPressButton = (): void => actionData.action && actionData.action(id);
            return (
              <Button
                key={index}
                type="secondary"
                icon={actionData.icon}
                iconColor={actionData.color}
                iconSize={20}
                onPress={onPressButton}
                title={actionData.title}
                containerStyle={styles.statusView}
                titleStyle={[styles.actionTitle, { color: actionData.color }]}
              />
            );
          })}
        </View>
      </>
    );
  };

  private renderCancelConfirmation = (): React.ReactElement => {
    const { isCancelSheet } = this.state;
    const { t } = this.props;
    return (
      <BottomSheet visible={isCancelSheet} headerTitle={t('cancelVisit')} onCloseSheet={this.onCancelSheet}>
        <View style={styles.sheetContent}>
          <Text type="small" style={{ color: theme.colors.darkTint1 }}>
            {t('wantCancelVisit')}
          </Text>
          <View style={styles.sheetButtonView}>
            {confirmation.map((item, index) => {
              return (
                <Button
                  type="secondary"
                  key={index}
                  title={item}
                  onPress={(): void => this.onPressConfirmation(item)}
                  containerStyle={styles.confirmationContainer}
                  titleStyle={styles.confirmationTitle}
                />
              );
            })}
          </View>
        </View>
      </BottomSheet>
    );
  };

  private onPressConfirmation = (item: string): void => {
    const { handleAction } = this.props;
    const { currentVisitId } = this.state;
    if (item === 'Yes') {
      handleAction(currentVisitId, VisitActions.CANCEL);
    }
    this.onCancelSheet();
  };

  private onCancelSheet = (): void => {
    this.setState({
      isCancelSheet: false,
    });
  };

  private getActions = (action: string): IVisitActions | null => {
    const { handleAction } = this.props;
    const { APPROVE, REJECT, CANCEL } = VisitActions;
    switch (action) {
      case APPROVE:
        return {
          title: 'Accept',
          color: theme.colors.green,
          icon: icons.circularCheckFilled,
          action: (id): void => handleAction(id, VisitActions.APPROVE),
        };
      case REJECT:
        return {
          title: 'Reject',
          color: theme.colors.error,
          icon: icons.circularCrossFilled,
          action: (id): void => handleAction(id, VisitActions.REJECT),
        };
      case CANCEL:
        return {
          title: 'Cancel',
          color: theme.colors.error,
          action: (id): void => this.handleVisitCancel(id),
        };
      default:
        return null;
    }
  };

  private getVisitStatus = (status: string): IVisitActions | null => {
    switch (status) {
      case VisitStatus.ACCEPTED:
        return {
          title: 'Visit Scheduled',
          color: theme.colors.green,
          icon: icons.circularCheckFilled,
        };
      case VisitStatus.REJECTED:
        return {
          title: 'Visit Declined',
          color: theme.colors.error,
          icon: icons.circularCrossFilled,
        };
      case VisitStatus.CANCELLED:
        return {
          title: 'Visit Cancelled',
          color: theme.colors.error,
          icon: icons.circularCrossFilled,
        };
      case VisitStatus.PENDING:
        return {
          title: 'Awaiting Confirmation...',
          color: theme.colors.darkTint3,
          icon: icons.watch,
        };
      default:
        return null;
    }
  };

  private getDropdownData = (): IDropdownObject[] => {
    const { visitType, t } = this.props;
    let results;
    switch (visitType) {
      case VisitStatusType.UPCOMING:
        results = Object.values(UPCOMING_DROPDOWN_DATA);
        break;
      case VisitStatusType.MISSED:
      case VisitStatusType.COMPLETED:
        results = Object.values(MISSED_COMPLETED_DATA);
        break;
      default:
        results = Object.values(MISSED_COMPLETED_DATA);
    }

    return results.map((currentData: IDropdownObject) => {
      return {
        ...currentData,
        label: t(currentData.label),
      };
    });
  };

  // TODO: move to en.json
  private getUserRole = (role: RoleType): string => {
    switch (role) {
      case RoleType.PROPERTY_AGENT:
        return 'Property agent';
      case RoleType.BUYER:
        return 'Buyer';
      case RoleType.TENANT:
        return 'Tenant';
      case RoleType.OWNER:
        return 'Owner';
      default:
        return role;
    }
  };

  private handleVisitCancel = (id: number): void => {
    this.setState({
      isCancelSheet: true,
      currentVisitId: id,
    });
  };

  private handleDropdownSelection = (value: string | number): void => {
    const { handleDropdown, visitType } = this.props;
    const currentDate = DateUtils.getCurrentDateISO();
    this.setState({
      dropdownValue: value as number,
    });
    const data = this.getDropdownData();
    const selectedData = data.find((item) => item.value === (value as number));
    if (selectedData) {
      const fromDate =
        visitType === VisitStatusType.UPCOMING && selectedData.startDate < currentDate
          ? currentDate
          : selectedData.startDate;
      handleDropdown(fromDate, selectedData.endDate, visitType);
    }
  };
}

export default withTranslation(LocaleConstants.namespacesKey.property)(PropertyVisitList);

const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 10,
    marginHorizontal: 16,
  },
  container: {
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 16,
    borderColor: theme.colors.darkTint10,
  },
  newVisit: {
    borderWidth: 0,
    backgroundColor: theme.colors.moreSeparator,
  },
  dividerStyle: {
    backgroundColor: theme.colors.background,
    marginVertical: 16,
  },
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  statusView: {
    borderWidth: 0,
    flex: 0,
    flexDirection: 'row-reverse',
    backgroundColor: theme.colors.transparent,
  },
  statusTitle: {
    marginVertical: 0,
    marginHorizontal: 8,
  },
  actionTitle: {
    marginVertical: 0,
    marginHorizontal: 16,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  scrollView: {
    flex: 1,
    height: 450,
  },
  count: {
    color: theme.colors.darkTint6,
  },
  dropdownStyle: {
    borderWidth: 0,
    backgroundColor: theme.colors.lightGrayishBlue,
  },
  dividerView: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
    width: 100,
  },
  horizontalStyle: {
    marginHorizontal: 16,
  },
  dateView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  sheetContent: {
    alignSelf: 'center',
  },
  sheetButtonView: {
    flexDirection: 'row',
    marginTop: 24,
  },
  confirmationContainer: {
    marginHorizontal: 6,
  },
  confirmationTitle: {
    marginVertical: 0,
    paddingVertical: 8,
  },
});
