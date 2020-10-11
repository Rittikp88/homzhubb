import React, { Component } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Avatar, Divider, Button } from '@homzhub/common/src/components';
import CalendarHeader from '@homzhub/common/src/components/atoms/CalendarHeader';
import { CalendarComponent } from '@homzhub/common/src/components/atoms/CalendarComponent';
import { BottomSheet } from '@homzhub/mobile/src/components';
import { AddressWithVisitDetail } from '@homzhub/mobile/src/components/molecules/AddressWithVisitDetail';
import { ISlotItem, IVisitByKey } from '@homzhub/common/src/domain/models/AssetVisit';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IAssetVisitPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { TimeSlot } from '@homzhub/common/src/constants/ContactFormData';

interface IDispatchProps {
  getAssetVisit: (payload: IAssetVisitPayload) => void;
}

interface IStateProps {
  visits: IVisitByKey[];
}

interface IScreenState {
  currentDate: string;
  timeSlot: ISlotItem[];
  isCalendarVisible: boolean;
}

const allSlot = { id: 0, from: 0, to: 0, icon: '', formatted: 'ALL' };

type Props = IDispatchProps & IStateProps & WithTranslation;

class SiteVisitCalendarView extends Component<Props, IScreenState> {
  public state = {
    currentDate: DateUtils.getDisplayDate(new Date().toDateString(), 'DD, MMMM YYYY'),
    timeSlot: [allSlot].concat(TimeSlot),
    isCalendarVisible: false,
  };

  public componentDidMount(): void {
    this.getVisitsData();
  }

  public render(): React.ReactNode {
    const { t, visits } = this.props;
    const { currentDate, isCalendarVisible } = this.state;
    return (
      <View>
        <CalendarHeader
          headerTitle={currentDate}
          onMonthPress={this.handleFullCalendar}
          onNextPress={this.handleNextDay}
          onBackPress={this.handlePreviousDay}
        />
        {this.renderTimeSlot()}
        <ScrollView style={styles.visitView}>
          {visits.map((visit) => {
            return this.renderVisits(visit);
          })}
        </ScrollView>
        <BottomSheet
          visible={isCalendarVisible}
          onCloseSheet={this.onCloseCalendar}
          headerTitle={t('maintenanceSchedule')}
          isShadowView
          sheetHeight={580}
        >
          <CalendarComponent allowPastDates selectedDate={currentDate} onSelect={this.onSelectDate} />
        </BottomSheet>
      </View>
    );
  }

  private renderTimeSlot = (): React.ReactElement => {
    const { timeSlot } = this.state;
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {timeSlot.map((slot, index) => {
          return (
            <Button
              key={index}
              type="secondary"
              icon={slot.icon}
              iconSize={16}
              title={slot.formatted}
              onPress={FunctionUtils.noop}
              titleStyle={styles.slotTitle}
              containerStyle={styles.slotButton}
            />
          );
        })}
      </ScrollView>
    );
  };

  private renderVisits = (visit: IVisitByKey): React.ReactElement => {
    const { key, results } = visit;
    return (
      <View style={styles.visitCard}>
        <AddressWithVisitDetail
          primaryAddress={key}
          subAddress={results[0].asset.address}
          startDate={results[0].startDate}
          endDate={results[0].endDate}
          containerStyle={styles.addressView}
        />
        <Divider containerStyles={styles.dividerStyle} />
        <View style={styles.userView}>
          {results.map((item) => {
            const {
              user: { fullName, rating },
              role,
              id,
            } = item;
            return (
              <>
                <Avatar
                  key={id}
                  fullName={fullName}
                  designation={role}
                  rating={rating}
                  containerStyle={styles.avatar}
                />
                <Divider containerStyles={styles.dividerStyle} />
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
    const { getAssetVisit } = this.props;
    const { currentDate } = this.state;
    const date = DateUtils.getDisplayDate(currentDate, DateFormats.ISO);

    const payload: IAssetVisitPayload = {
      start_date__gte: date,
    };

    getAssetVisit(payload);
  };

  private handleNextDay = (): void => {
    const { currentDate } = this.state;
    this.setState({
      currentDate: DateUtils.getNextDate(1, currentDate, 'DD, MMMM YYYY'),
    });
  };

  private handlePreviousDay = (): void => {
    const { currentDate } = this.state;
    this.setState({
      currentDate: DateUtils.getNextDate(1, currentDate, 'DD, MMMM YYYY'),
    });
  };

  private handleFullCalendar = (): void => {
    this.setState((prevState) => {
      return {
        isCalendarVisible: !prevState.isCalendarVisible,
      };
    });
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    visits: AssetSelectors.getVisitsByAsset(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetVisit } = AssetActions;
  return bindActionCreators(
    {
      getAssetVisit,
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
  slotButton: {
    backgroundColor: theme.colors.background,
    borderWidth: 0,
    paddingHorizontal: 12,
    marginHorizontal: 10,
    flexDirection: 'row-reverse',
  },
  visitView: {
    height: 500,
  },
  visitCard: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.darkTint10,
  },
  addressView: {
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  dividerStyle: {
    borderColor: theme.colors.background,
  },
  userView: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  avatar: {
    marginVertical: 16,
  },
});
