import React, { Component } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { groupBy } from 'lodash';
import { withTranslation, WithTranslation } from 'react-i18next';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Avatar, Badge, Button, Divider, EmptyState } from '@homzhub/common/src/components';
import CalendarHeader from '@homzhub/common/src/components/atoms/CalendarHeader';
import { CalendarComponent } from '@homzhub/common/src/components/atoms/CalendarComponent';
import { BottomSheet, Loader } from '@homzhub/mobile/src/components';
import { AddressWithVisitDetail } from '@homzhub/mobile/src/components/molecules/AddressWithVisitDetail';
import { AssetVisit, ISlotItem, IVisitByKey } from '@homzhub/common/src/domain/models/AssetVisit';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IAssetVisitPayload, VisitStatus } from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { TimeSlot } from '@homzhub/common/src/constants/ContactFormData';
import { ILabelColor } from '@homzhub/common/src/domain/models/LeaseTransaction';

interface IDispatchProps {
  getAssetVisit: (payload: IAssetVisitPayload) => void;
  setVisitIds: (payload: number[]) => void;
}

interface IStateProps {
  visits: IVisitByKey[][];
  isLoading: boolean;
}

interface IProps {
  onReschedule: () => void;
  selectedAssetId: number;
}

interface IScreenState {
  currentDate: string;
  timeSlot: ISlotItem[];
  isCalendarVisible: boolean;
  selectedSlot: number;
  visitsData: IVisitByKey[][];
}

const allSlot = { id: 0, from: 0, to: 0, icon: '', formatted: 'ALL' };

type Props = IProps & IDispatchProps & IStateProps & WithTranslation;

class SiteVisitCalendarView extends Component<Props, IScreenState> {
  public state = {
    currentDate: DateUtils.getUtcFormattedDate(new Date().toDateString(), 'DD, MMMM YYYY'),
    timeSlot: [allSlot].concat(TimeSlot),
    isCalendarVisible: false,
    selectedSlot: 0,
    visitsData: [],
  };

  public static getDerivedStateFromProps(props: Props, state: IScreenState): IScreenState | null {
    const { visits } = props;
    const { visitsData } = state;
    if (visits && visitsData) {
      return {
        ...state,
        visitsData: visits,
      };
    }

    return null;
  }

  public componentDidMount(): void {
    this.getVisitsData();
  }

  public render(): React.ReactNode {
    const { t, isLoading } = this.props;
    const { currentDate, isCalendarVisible, visitsData } = this.state;
    return (
      <>
        <CalendarHeader
          headerTitle={currentDate}
          onMonthPress={this.handleFullCalendar}
          onNextPress={this.handleNextDay}
          onBackPress={this.handlePreviousDay}
        />
        {this.renderTimeSlot()}
        {visitsData.length > 0 ? (
          <ScrollView style={styles.visitView} showsVerticalScrollIndicator={false}>
            {visitsData.map((visitItem: IVisitByKey[]) => {
              return visitItem.map((visit) => {
                return this.renderVisits(visit);
              });
            })}
          </ScrollView>
        ) : (
          <EmptyState icon={icons.schedule} title={t('noVisits')} />
        )}
        <BottomSheet
          visible={isCalendarVisible}
          onCloseSheet={this.onCloseCalendar}
          headerTitle={t('maintenanceSchedule')}
          isShadowView
          sheetHeight={580}
        >
          <CalendarComponent allowPastDates selectedDate={currentDate} onSelect={this.onSelectDate} />
        </BottomSheet>
        <Loader visible={isLoading} />
      </>
    );
  }

  private renderTimeSlot = (): React.ReactElement => {
    const { timeSlot, selectedSlot } = this.state;
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {timeSlot.map((slot, index) => {
          const onSelectSlot = (): void => this.handleSlotSelection(slot.id);
          const isSelected = selectedSlot === slot.id;
          return (
            <Button
              key={index}
              type="secondary"
              icon={slot.icon}
              iconColor={isSelected ? theme.colors.white : theme.colors.darkTint4}
              iconSize={16}
              title={slot.formatted}
              onPress={onSelectSlot}
              titleStyle={[styles.slotTitle, isSelected && styles.selectedTitle]}
              containerStyle={[styles.slotButton, isSelected && styles.selectedSlot]}
            />
          );
        })}
      </ScrollView>
    );
  };

  private renderVisits = (visit: IVisitByKey): React.ReactElement => {
    const { key, results } = visit;
    const visitData = results as AssetVisit[];
    const visitByStatus = this.getVisitByStatus(visitData);
    return (
      <View style={styles.visitCard}>
        <AddressWithVisitDetail
          primaryAddress={key}
          isRescheduleAll
          subAddress={visitData[0].asset.address}
          startDate={visitData[0].startDate}
          endDate={visitData[0].endDate}
          onPressSchedule={(): void => this.handleRescheduleAll(visitData)}
          containerStyle={styles.addressView}
        />
        <Divider containerStyles={styles.dividerStyle} />
        <View style={styles.userView}>
          {visitByStatus.map((visitItem, index) => {
            const { key: status, results: assetResults } = visitItem;
            const assetVisit = assetResults as AssetVisit[];
            const badge = this.getBadgesData(status);
            return (
              <>
                <Badge title={badge.label} badgeColor={badge.color} badgeStyle={styles.badge} />
                {assetVisit.map((item) => {
                  return (
                    <>
                      <Avatar
                        key={item.id}
                        fullName={item.user.fullName}
                        designation={StringUtils.toTitleCase(item.role)}
                        rating={item.user.rating}
                        isRightIcon
                        date={item.createdAt}
                        containerStyle={styles.avatar}
                      />
                      {results.length - 1 !== index && <Divider containerStyles={styles.dividerStyle} />}
                    </>
                  );
                })}
              </>
            );
          })}
        </View>
      </View>
    );
  };

  private onCloseCalendar = (): void => {
    this.setState({
      isCalendarVisible: false,
    });
  };

  private onSelectDate = (date: string): void => {
    this.setState({
      currentDate: DateUtils.getDisplayDate(date, 'DD, MMMM YYYY'),
      isCalendarVisible: false,
    });
  };

  // TODO: (Shikha) - Refactor
  private getBadgesData = (status: string): ILabelColor => {
    switch (status) {
      case VisitStatus.ACCEPTED:
        return {
          label: 'Completed',
          color: theme.colors.green,
        };
        break;
      case VisitStatus.PENDING:
        return {
          label: 'Missed',
          color: theme.colors.green,
        };
        break;
      case VisitStatus.CANCELLED:
        return {
          label: 'Cancelled',
          color: theme.colors.error,
        };
        break;
      case VisitStatus.REJECTED:
        return {
          label: 'Declined',
          color: theme.colors.error,
        };
        break;
      default:
        return {
          label: 'Completed',
          color: theme.colors.green,
        };
    }
  };

  private getVisitByStatus = (visitData: AssetVisit[]): IVisitByKey[] => {
    const groupData = groupBy(visitData, (result) => result.status);
    return Object.keys(groupData).map((key) => {
      const results = groupData[key];
      return {
        key,
        results,
      };
    });
  };

  private getVisitsData = (): void => {
    const { getAssetVisit, selectedAssetId } = this.props;
    const { currentDate, selectedSlot, timeSlot } = this.state;

    const start_date = DateUtils.getUtcFormatted(currentDate, 'DD, MMM YYYY', 'YYYY-MM-DD');
    let start_datetime = '';
    if (selectedSlot > 0) {
      timeSlot.forEach((item) => {
        if (item.id === selectedSlot) {
          start_datetime = DateUtils.getISOFormat(currentDate, item.from);
        }
      });
    }
    const payload: IAssetVisitPayload = {
      ...(selectedSlot === 0 && { start_date }),
      ...(selectedSlot > 0 && { start_datetime }),
      ...(selectedAssetId !== 0 && { asset_id: selectedAssetId }),
    };

    getAssetVisit(payload);
  };

  private handleNextDay = (): void => {
    const { currentDate } = this.state;
    this.setState(
      {
        currentDate: DateUtils.getNextDate(1, currentDate, 'DD, MMMM YYYY'),
        selectedSlot: 0,
      },
      (): void => this.getVisitsData()
    );
  };

  private handlePreviousDay = (): void => {
    const { currentDate } = this.state;
    this.setState(
      {
        currentDate: DateUtils.getPreviousDate(1, currentDate, 'DD, MMMM YYYY'),
        selectedSlot: 0,
      },
      (): void => this.getVisitsData()
    );
  };

  private handleFullCalendar = (): void => {
    this.setState((prevState) => {
      return {
        isCalendarVisible: !prevState.isCalendarVisible,
      };
    });
  };

  private handleSlotSelection = (value: string | number): void => {
    this.setState(
      {
        selectedSlot: value as number,
      },
      (): void => {
        this.getVisitsData();
      }
    );
  };

  private handleRescheduleAll = (results: AssetVisit[]): void => {
    const { setVisitIds, onReschedule } = this.props;
    const visitIds: number[] = [];
    results.forEach((visit) => {
      visitIds.push(visit.id);
    });

    setVisitIds(visitIds);
    onReschedule();
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    visits: AssetSelectors.getVisitsByAsset(state),
    isLoading: AssetSelectors.getVisitLoadingState(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetVisit, setVisitIds } = AssetActions;
  return bindActionCreators(
    {
      getAssetVisit,
      setVisitIds,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.property)(SiteVisitCalendarView));

const styles = StyleSheet.create({
  scrollView: {
    marginVertical: 16,
    flexDirection: 'row',
  },
  slotTitle: {
    marginHorizontal: 10,
    marginVertical: 4,
    color: theme.colors.darkTint4,
  },
  selectedTitle: {
    color: theme.colors.white,
  },
  slotButton: {
    backgroundColor: theme.colors.background,
    borderWidth: 0,
    paddingHorizontal: 12,
    marginHorizontal: 10,
    flexDirection: 'row-reverse',
  },
  selectedSlot: {
    backgroundColor: theme.colors.blue,
  },
  visitView: {
    height: 450,
    marginTop: 10,
  },
  visitCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: theme.colors.darkTint10,
  },
  addressView: {
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  dividerStyle: {
    borderColor: theme.colors.darkTint10,
  },
  userView: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  avatar: {
    marginVertical: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 14,
  },
});
