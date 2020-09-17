import React, { Component } from 'react';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import HandleBack from '@homzhub/mobile/src/navigation/HandleBack';
import { SearchStackParamList } from '@homzhub/mobile/src/navigation/SearchStack';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import {
  IScheduleVisitPayload,
  IUpcomingVisitPayload,
  VisitType,
} from '@homzhub/common/src/domain/repositories/interfaces';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button, Divider, Label, SelectionPicker, Text, WithShadowView } from '@homzhub/common/src/components';
import { CollapsibleSection, Header, Loader, StateAwareComponent, TimeSlotGroup } from '@homzhub/mobile/src/components';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { RadioButtonGroup } from '@homzhub/common/src/components/molecules/RadioButtonGroup';
import { FormCalendar } from '@homzhub/common/src/components/molecules/FormCalendar';
import { AssetLeadType, UpcomingSlot } from '@homzhub/common/src/domain/models/AssetVisit';
import { TimeSlot } from '@homzhub/common/src/constants/ContactFormData';
import { VisitTypeData } from '@homzhub/common/src/mocks/BookVisit';

interface IStateProps {
  isLoggedIn: boolean;
}

interface IVisitState {
  visitors: AssetLeadType[];
  upcomingVisits: UpcomingSlot[];
  userType: number;
  visitType: string[];
  selectedTimeSlot: number;
  isCollapsed: boolean;
  selectedUpcomingSlot: number;
  isUpcomingSlotSelected: boolean;
  selectedDate: string;
  message: string;
  isLoading: boolean;
  isSpinnerLoading: boolean;
}

type libraryProps = WithTranslation & NavigationScreenProps<SearchStackParamList, ScreensKeys.BookVisit>;
type Props = libraryProps & IStateProps;

export class BookVisit extends Component<Props, IVisitState> {
  public state = {
    visitors: [],
    upcomingVisits: [],
    userType: 1,
    visitType: [VisitType.PHYSICAL],
    selectedTimeSlot: 0,
    isCollapsed: true,
    selectedDate: '',
    selectedUpcomingSlot: 0,
    isUpcomingSlotSelected: false,
    message: '',
    isLoading: false,
    isSpinnerLoading: false,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getVisitorType();
    await this.getUpcomingVisits();
  };

  public render(): React.ReactNode {
    const { isLoading } = this.state;
    return <StateAwareComponent loading={isLoading} renderComponent={this.renderComponent()} />;
  }

  private renderComponent = (): React.ReactElement => {
    const {
      isCollapsed,
      isUpcomingSlotSelected,
      message,
      upcomingVisits,
      isSpinnerLoading,
      selectedDate,
      selectedTimeSlot,
    } = this.state;
    const { t, navigation } = this.props;
    const upcomingVisitTitle = PropertyUtils.getUpcomingSlotMessage(upcomingVisits[0]);
    const isButtonDisabled = (selectedDate === '' || selectedTimeSlot === 0) && !isUpcomingSlotSelected;

    return (
      <HandleBack onBack={this.goBack} navigation={navigation}>
        <Header
          icon={icons.close}
          isHeadingVisible
          title={t('assetDescription:scheduleVisit')}
          type="secondary"
          onIconPress={this.goBack}
          testID="header"
        />
        <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
          {this.renderVisitType()}
          {this.renderVisitorType()}
          <Divider containerStyles={styles.divider} />
          {upcomingVisits.length > 0 && (
            <CollapsibleSection
              title={upcomingVisitTitle}
              icon={icons.watch}
              titleStyle={styles.upcomingTitle}
              initialCollapsedValue={isCollapsed}
              onCollapse={this.handleSlotView}
            >
              <FlatList
                data={upcomingVisits}
                renderItem={this.renderUpcomingSlot}
                horizontal
                showsHorizontalScrollIndicator={false}
                extraData={isUpcomingSlotSelected}
              />
            </CollapsibleSection>
          )}
          {isCollapsed && !isUpcomingSlotSelected && this.renderDateTimeSection()}
          <TextArea
            label={t('message')}
            placeholder={t('typeYourMessage')}
            isOptional
            value={message}
            containerStyle={styles.textArea}
            onMessageChange={this.handleMessageChange}
          />
        </ScrollView>
        <WithShadowView outerViewStyle={styles.shadowView}>
          <Button
            type="primary"
            title={t('confirm')}
            disabled={isButtonDisabled}
            titleStyle={styles.buttonTitleStyle}
            containerStyle={styles.buttonStyle}
            onPress={this.handleSubmit}
          />
        </WithShadowView>
        <Loader visible={isSpinnerLoading} />
      </HandleBack>
    );
  };

  private renderVisitType = (): React.ReactElement => {
    const { visitType } = this.state;
    return <SelectionPicker data={VisitTypeData} selectedItem={visitType} onValueChange={this.onChangeVisitType} />;
  };

  private renderVisitorType = (): React.ReactElement => {
    const { userType, visitors } = this.state;
    const { t } = this.props;
    return (
      <View style={styles.userContainer}>
        <Text type="small" textType="semiBold" style={styles.userType}>
          {t('iAm')}
        </Text>
        <RadioButtonGroup
          data={visitors}
          onToggle={this.handleUserType}
          containerStyle={styles.radioGroup}
          selectedValue={userType}
        />
      </View>
    );
  };

  private renderUpcomingSlot = ({ item }: { item: UpcomingSlot }): React.ReactElement | null => {
    const { selectedUpcomingSlot, isUpcomingSlotSelected } = this.state;
    const handleSelection = (): void => this.onSelectUpcomingSlot(item.id);
    const selected = isUpcomingSlotSelected && selectedUpcomingSlot === item.id;
    const slot = PropertyUtils.getUpcomingSlotsData(item);
    if (!slot) {
      return null;
    }
    return (
      <TouchableOpacity
        key={item.id}
        testID="selectSlot"
        style={[styles.buttonContainer, selected && styles.selectedContainer]}
        onPress={handleSelection}
      >
        <Text type="small" style={[styles.slotTitle, selected && styles.selectedTitle]}>
          {slot.date}
        </Text>
        <View style={styles.upcomingView}>
          <Icon
            name={slot.time.icon}
            size={20}
            color={selected ? theme.colors.white : theme.colors.darkTint2}
            style={styles.iconStyle}
          />
          <Label type="large" style={[styles.slotTitle, selected && styles.selectedTitle]}>
            {slot.time.formatted}
          </Label>
        </View>
      </TouchableOpacity>
    );
  };

  private renderDateTimeSection = (): React.ReactElement => {
    const { selectedTimeSlot, selectedDate } = this.state;
    const { t } = this.props;
    const maxDate = DateUtils.getFutureDate(10);
    return (
      <View style={styles.dateTimeView}>
        <FormCalendar
          label={t('selectDate')}
          name="selectDate"
          textSize="small"
          fontType="semiBold"
          placeHolder={t('datePlaceholder')}
          maxDate={maxDate}
          selectedValue={selectedDate}
          iconColor={theme.colors.darkTint8}
          placeHolderStyle={styles.placeholderStyle}
          bubbleSelectedDate={this.onSelectDate}
        />
        <Text type="small" textType="semiBold" style={styles.timeHeading}>
          {t('selectTimings')}
        </Text>
        <TimeSlotGroup
          data={TimeSlot}
          onItemSelect={this.onSelectTime}
          selectedItem={selectedTimeSlot}
          selectedDate={selectedDate}
        />
      </View>
    );
  };

  private onSelectUpcomingSlot = (slotId: number): void => {
    const { isUpcomingSlotSelected } = this.state;
    this.setState({ selectedUpcomingSlot: slotId, isUpcomingSlotSelected: !isUpcomingSlotSelected });
  };

  private onChangeVisitType = (value: string): void => {
    this.setState({ visitType: [value] }, () => {
      this.getUpcomingVisits(true).then();
    });
  };

  private onSelectDate = (day: string): void => {
    const selectedDate = DateUtils.getDisplayDate(day, 'll');
    this.setState({ selectedDate });
  };

  private onSelectTime = (slotId: number): void => {
    this.setState({ selectedTimeSlot: slotId });
  };

  private getVisitorType = async (): Promise<void> => {
    this.setState({ isLoading: true });
    try {
      const response = await AssetRepository.getVisitLeadType();
      this.setState({ visitors: response, userType: response[0].id, isLoading: false });
    } catch (e) {
      this.setState({ isLoading: false });
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };

  private getUpcomingVisits = async (isVisitTypeChange?: boolean): Promise<void> => {
    const { visitType } = this.state;
    const {
      route: { params },
    } = this.props;
    const payload: IUpcomingVisitPayload = {
      visit_type: visitType[0],
      start_date__gte: DateUtils.getCurrentDate(),
      lease_listing_id: params.lease_listing_id ?? null,
      sale_listing_id: params.sale_listing_id ?? null,
    };
    if (isVisitTypeChange) {
      this.setState({ isSpinnerLoading: true });
    } else {
      this.setState({ isLoading: true });
    }
    try {
      const response = await AssetRepository.getUpcomingVisits(payload);
      this.setState({ upcomingVisits: response, isLoading: false, isSpinnerLoading: false });
    } catch (e) {
      this.setState({ isLoading: false, isSpinnerLoading: false });
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };

  private handleUserType = (id: number): void => {
    this.setState({ userType: id });
  };

  private handleMessageChange = (value: string): void => {
    this.setState({ message: value });
  };

  private handleSlotView = (isCollapsed: boolean): void => {
    this.setState({ isCollapsed });
  };

  private handleSubmit = async (): Promise<void> => {
    this.setState({ isLoading: true });
    const {
      visitType,
      userType,
      message,
      selectedUpcomingSlot,
      upcomingVisits,
      selectedDate,
      selectedTimeSlot,
      isUpcomingSlotSelected,
    } = this.state;
    const {
      t,
      navigation,
      route: { params },
    } = this.props;

    let start_date = '';
    let end_date = '';

    if (isUpcomingSlotSelected) {
      upcomingVisits.forEach((item: UpcomingSlot) => {
        if (item.id === selectedUpcomingSlot) {
          start_date = item.start_date;
          end_date = item.end_date;
        }
      });
    } else {
      TimeSlot.forEach((item: any) => {
        if (item.id === selectedTimeSlot) {
          start_date = DateUtils.getISOFormat(selectedDate, item.from);
          end_date = DateUtils.getISOFormat(selectedDate, item.to);
        }
      });
    }

    const payload: IScheduleVisitPayload = {
      visit_type: visitType[0],
      lead_type: userType,
      start_date,
      end_date,
      ...(message && { comments: message }),
      lease_listing: params.lease_listing_id ?? null,
      sale_listing: params.sale_listing_id ?? null,
    };

    try {
      await AssetRepository.propertyVisit(payload);
      this.setState({ isLoading: false });
      AlertHelper.success({ message: t('property:scheduleVisit') });
      navigation.replace(ScreensKeys.PropertyAssetDescription, { propertyTermId: params.propertyTermId });
    } catch (e) {
      this.setState({ isLoading: false });
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };

  private goBack = (): void => {
    const {
      navigation,
      route: {
        params: { propertyTermId },
      },
    } = this.props;
    navigation.navigate(ScreensKeys.PropertyAssetDescription, { propertyTermId });
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    isLoggedIn: UserSelector.isLoggedIn(state),
  };
};

export default connect(mapStateToProps, null)(withTranslation()(BookVisit));

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: theme.colors.white,
  },
  userContainer: {
    paddingVertical: 24,
  },
  userType: {
    color: theme.colors.darkTint3,
  },
  divider: {
    borderColor: theme.colors.darkTint10,
  },
  radioGroup: {
    marginVertical: 16,
  },
  upcomingTitle: {
    marginLeft: 12,
  },
  buttonContainer: {
    marginVertical: 16,
    paddingHorizontal: 28,
    marginHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  selectedContainer: {
    backgroundColor: theme.colors.blue,
  },
  slotTitle: {
    color: theme.colors.darkTint2,
  },
  selectedTitle: {
    color: theme.colors.white,
  },
  iconStyle: {
    marginRight: 6,
  },
  textArea: {
    marginTop: 18,
    marginBottom: 24,
  },
  shadowView: {
    paddingTop: 4,
    marginBottom: PlatformUtils.isIOS() ? 20 : 0,
    paddingBottom: 0,
  },
  buttonStyle: {
    flex: 0,
    flexDirection: 'row-reverse',
    margin: 16,
  },
  buttonTitleStyle: {
    marginHorizontal: 12,
  },
  dateTimeView: {
    marginTop: 12,
  },
  placeholderStyle: {
    color: theme.colors.darkTint8,
  },
  timeHeading: {
    color: theme.colors.darkTint3,
    marginTop: 22,
    marginBottom: 8,
  },
  upcomingView: {
    flexDirection: 'row',
  },
});