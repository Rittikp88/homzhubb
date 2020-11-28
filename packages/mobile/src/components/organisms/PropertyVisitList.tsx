import React, { Component } from 'react';
import { LayoutChangeEvent, PickerItemProps, ScrollView, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Dropdown } from '@homzhub/common/src/components/atoms/Dropdown';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
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

// CONSTANTS
const confirmation = ['Yes', 'No'];

// END CONSTANTS

interface IProps {
  visitType: VisitStatusType;
  visitData: IVisitByKey[];
  dropdownData: PickerItemProps[];
  isLoading: boolean;
  isFromProperty?: boolean;
  dropdownValue: number;
  handleAction: (id: number, action: VisitActions) => void;
  handleReschedule: (id: number) => void;
  handleDropdown: (value: string | number, visitType: VisitStatusType) => void;
}

interface IScreenState {
  isCancelSheet: boolean;
  currentVisitId: number;
  height: number;
}

type Props = IProps & WithTranslation;

class PropertyVisitList extends Component<Props, IScreenState> {
  public state = {
    isCancelSheet: false,
    currentVisitId: 0,
    height: theme.viewport.height,
  };

  public render(): React.ReactNode {
    const { visitData, isLoading, t, dropdownData, dropdownValue, visitType, handleDropdown } = this.props;
    const { height } = this.state;
    const totalVisit = visitData[0] ? visitData[0].totalVisits : 0;
    return (
      <View onLayout={this.onLayout} style={styles.mainView}>
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
            onDonePress={(value): void => handleDropdown(value, visitType)}
            containerStyle={styles.dropdownStyle}
          />
        </View>
        {visitData.length > 0 ? (
          <ScrollView style={{ height }} showsVerticalScrollIndicator={false}>
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
          <View style={styles.emptyView}>
            <EmptyState icon={icons.schedule} title={t('noVisits')} />
          </View>
        )}
        <Loader visible={isLoading} />
        {this.renderCancelConfirmation()}
      </View>
    );
  }

  private renderItem = (item: AssetVisit): React.ReactElement => {
    const { asset, user, actions, startDate, endDate, id, role, createdAt, comments, isAssetOwner } = item;
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
            designation={userRole}
            rating={user.rating}
            date={createdAt}
            containerStyle={styles.avatar}
          />
          <AddressWithVisitDetail
            primaryAddress={asset.projectName}
            subAddress={asset.address}
            startDate={startDate}
            isPropertyOwner={isAssetOwner}
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
    const isSmallerView = (visitStatus?.title?.length ?? 0) > 16 && theme.viewport.width < 350;

    return (
      <>
        <Divider containerStyles={styles.dividerStyle} />
        <View style={isSmallerView ? styles.buttonSmallerView : styles.buttonView}>
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
                containerStyle={[styles.statusView, isSmallerView && styles.smallStatusView]}
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

  private onLayout = (e: LayoutChangeEvent): void => {
    const { height } = this.state;
    const { height: newHeight } = e.nativeEvent.layout;
    if (newHeight === height) {
      this.setState({ height: newHeight });
    }
  };

  private getActions = (action: string): IVisitActions | null => {
    const { handleAction, t } = this.props;
    const { APPROVE, REJECT, CANCEL } = VisitActions;
    switch (action) {
      case APPROVE:
        return {
          title: t('common:accept'),
          color: theme.colors.green,
          icon: icons.circularCheckFilled,
          action: (id): void => handleAction(id, VisitActions.APPROVE),
        };
      case REJECT:
        return {
          title: t('common:reject'),
          color: theme.colors.error,
          icon: icons.circularCrossFilled,
          action: (id): void => handleAction(id, VisitActions.REJECT),
        };
      case CANCEL:
        return {
          title: t('common:cancel'),
          color: theme.colors.error,
          action: (id): void => this.handleVisitCancel(id),
        };
      default:
        return null;
    }
  };

  private getVisitStatus = (status: string): IVisitActions | null => {
    const { t } = this.props;
    switch (status) {
      case VisitStatus.ACCEPTED:
        return {
          title: t('visitScheduled'),
          color: theme.colors.green,
          icon: icons.circularCheckFilled,
        };
      case VisitStatus.REJECTED:
        return {
          title: t('visitDeclined'),
          color: theme.colors.error,
          icon: icons.circularCrossFilled,
        };
      case VisitStatus.CANCELLED:
        return {
          title: t('visitCancelled'),
          color: theme.colors.error,
          icon: icons.circularCrossFilled,
        };
      case VisitStatus.PENDING:
        return {
          title: t('awaiting'),
          color: theme.colors.darkTint3,
          icon: icons.watch,
        };
      default:
        return null;
    }
  };

  private getUserRole = (role: RoleType): string => {
    const { t } = this.props;
    switch (role) {
      case RoleType.PROPERTY_AGENT:
        return t('propertyAgent');
      case RoleType.BUYER:
        return t('buyer');
      case RoleType.TENANT:
        return t('tenant');
      case RoleType.OWNER:
        return t('owner');
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
}

export default withTranslation(LocaleConstants.namespacesKey.property)(PropertyVisitList);

const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 10,
    marginHorizontal: 16,
  },
  mainView: {
    marginBottom: 75,
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  buttonSmallerView: {
    alignItems: 'flex-start',
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
    marginHorizontal: 6,
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
  emptyView: {
    marginBottom: 20,
  },
  avatar: {
    paddingHorizontal: 10,
  },
  smallStatusView: {
    marginRight: 10,
    marginTop: 4,
  },
});
