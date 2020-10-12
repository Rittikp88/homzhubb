import React, { Component } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Avatar, Divider, Button, EmptyState } from '@homzhub/common/src/components';
import CalendarHeader from '@homzhub/common/src/components/atoms/CalendarHeader';
import { CalendarComponent } from '@homzhub/common/src/components/atoms/CalendarComponent';
import { BottomSheet, Loader } from '@homzhub/mobile/src/components';
import { AddressWithVisitDetail } from '@homzhub/mobile/src/components/molecules/AddressWithVisitDetail';
import { AssetVisit, ISlotItem, IVisitByKey } from '@homzhub/common/src/domain/models/AssetVisit';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IAssetVisitPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { TimeSlot } from '@homzhub/common/src/constants/ContactFormData';

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
}

const allSlot = { id: 0, from: 0, to: 0, icon: '', formatted: 'ALL' };

type Props = IProps & IDispatchProps & IStateProps & WithTranslation;

class SiteVisitCalendarView extends Component<Props, IScreenState> {
  public state = {
    currentDate: DateUtils.getDisplayDate(new Date().toDateString(), 'DD, MMMM YYYY'),
    timeSlot: [allSlot].concat(TimeSlot),
    isCalendarVisible: false,
    selectedSlot: 0,
  };

  public componentDidMount(): void {
    this.getVisitsData();
  }

  public render(): React.ReactNode {
    const { t, visits, isLoading } = this.props;
    const { currentDate, isCalendarVisible } = this.state;
    return (
      <>
        <CalendarHeader
          headerTitle={currentDate}
          onMonthPress={this.handleFullCalendar}
          onNextPress={this.handleNextDay}
          onBackPress={this.handlePreviousDay}
        />
        {this.renderTimeSlot()}
        {visits.length > 0 ? (
          <ScrollView style={styles.visitView} showsVerticalScrollIndicator={false}>
            {visits.map((visitData) => {
              return visitData.map((visit) => {
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
          {visitData.map((item, index) => {
            const {
              user: { fullName, rating },
              role,
              id,
              createdAt,
            } = item;
            return (
              <>
                <Avatar
                  key={id}
                  fullName={fullName}
                  designation={role}
                  rating={rating}
                  isRightIcon
                  date={createdAt}
                  containerStyle={styles.avatar}
                />
                {results.length - 1 !== index && <Divider containerStyles={styles.dividerStyle} />}
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

  private getVisitsData = (): void => {
    const { getAssetVisit, selectedAssetId } = this.props;
    const { currentDate, selectedSlot, timeSlot } = this.state;

    const start_date__gte = DateUtils.getUtcFormattedDate(currentDate, DateFormats.ISO);
    let start_date = '';
    if (selectedSlot > 0) {
      timeSlot.forEach((item) => {
        if (item.id === selectedSlot) {
          start_date = DateUtils.getISOFormat(currentDate, item.from);
        }
      });
    }

    const payload: IAssetVisitPayload = {
      ...(start_date && { start_date }),
      ...(selectedSlot === 0 && start_date__gte && { start_date__gte }),
      ...(selectedAssetId && { asset_id: selectedAssetId }),
    };

    getAssetVisit(payload);
  };

  private handleNextDay = (): void => {
    const { currentDate } = this.state;
    this.setState(
      {
        currentDate: DateUtils.getNextDate(1, currentDate, 'DD, MMMM YYYY'),
      },
      (): void => this.getVisitsData()
    );
  };

  private handlePreviousDay = (): void => {
    const { currentDate } = this.state;
    this.setState(
      {
        currentDate: DateUtils.getPreviousDate(1, currentDate, 'DD, MMMM YYYY'),
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
});
