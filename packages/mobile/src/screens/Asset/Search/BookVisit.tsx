import React, { Component } from 'react';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { cloneDeep, remove } from 'lodash';
import { connect } from 'react-redux';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import HandleBack from '@homzhub/mobile/src/navigation/HandleBack';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { SearchStackParamList } from '@homzhub/mobile/src/navigation/SearchStack';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button, Divider, Label, SelectionPicker, Text, WithShadowView } from '@homzhub/common/src/components';
import { CollapsibleSection, Header, TimeSlotGroup } from '@homzhub/mobile/src/components';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { RadioButtonGroup } from '@homzhub/common/src/components/molecules/RadioButtonGroup';
import { FormCalendar } from '@homzhub/common/src/components/molecules/FormCalendar';
import { TimeSlot, UserType } from '@homzhub/common/src/mocks/ContactFormData';
import { VisitSlot, VisitTypeData } from '@homzhub/common/src/mocks/BookVisit';

interface IStateProps {
  isLoggedIn: boolean;
}

interface IVisitState {
  userType: number;
  visitType: number[];
  selectedTimeSlot: number[];
  isCollapsed: boolean;
  selectedUpcomingSlot: number;
  isUpcomingSlotSelected: boolean;
  selectedDate: string;
  message: string;
}

type libraryProps = WithTranslation & NavigationScreenProps<SearchStackParamList, ScreensKeys.ContactForm>;
type Props = libraryProps & IStateProps;

class BookVisit extends Component<Props, IVisitState> {
  public state = {
    userType: 1,
    visitType: [0],
    selectedTimeSlot: [],
    isCollapsed: true,
    selectedDate: '',
    selectedUpcomingSlot: 0,
    isUpcomingSlotSelected: false,
    message: '',
  };

  public render(): React.ReactNode {
    const { isCollapsed, isUpcomingSlotSelected, message } = this.state;
    const { t, navigation } = this.props;
    return (
      <HandleBack onBack={this.goBack} navigation={navigation}>
        <Header
          icon={icons.close}
          isHeadingVisible
          title={t('assetDescription:scheduleVisit')}
          type="secondary"
          onIconPress={this.goBack}
        />
        <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
          {this.renderVisitType()}
          {this.renderUserType()}
          <Divider containerStyles={styles.divider} />
          <CollapsibleSection
            title="Join next visit at 3PM, Today"
            icon={icons.watch}
            titleStyle={styles.upcomingTitle}
            initialCollapsedValue={isCollapsed}
            onCollapse={this.handleSlotView}
          >
            <FlatList
              data={VisitSlot}
              renderItem={this.renderUpcomingSlot}
              horizontal
              showsHorizontalScrollIndicator={false}
              extraData={isUpcomingSlotSelected}
            />
          </CollapsibleSection>
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
            titleStyle={styles.buttonTitleStyle}
            containerStyle={styles.buttonStyle}
            onPress={this.handleSubmit}
          />
        </WithShadowView>
      </HandleBack>
    );
  }

  public renderVisitType = (): React.ReactElement => {
    const { visitType } = this.state;
    return <SelectionPicker data={VisitTypeData} selectedItem={visitType} onValueChange={this.onChangeVisitType} />;
  };

  public renderUserType = (): React.ReactElement => {
    const { userType } = this.state;
    const { t } = this.props;
    return (
      <View style={styles.userContainer}>
        <Text type="small" textType="semiBold" style={styles.userType}>
          {t('iAm')}
        </Text>
        <RadioButtonGroup
          data={UserType}
          onToggle={this.handleUserType}
          containerStyle={styles.radioGroup}
          selectedValue={userType}
        />
      </View>
    );
  };

  private renderUpcomingSlot = ({ item }: { item: any }): React.ReactElement => {
    const { selectedUpcomingSlot, isUpcomingSlotSelected } = this.state;
    const handleSelection = (): void => this.onSelectUpcomingSlot(item.id);
    const selected = isUpcomingSlotSelected && selectedUpcomingSlot === item.id;
    return (
      <TouchableOpacity
        key={item.id}
        testID="selectSlot"
        style={[styles.buttonContainer, selected && styles.selectedContainer]}
        onPress={handleSelection}
      >
        <Text type="small" style={[styles.slotTitle, selected && styles.selectedTitle]}>
          {item.date}
        </Text>
        <View style={styles.upcomingView}>
          <Icon
            name={item.icon}
            size={20}
            color={selected ? theme.colors.white : theme.colors.darkTint2}
            style={styles.iconStyle}
          />
          <Label type="large" style={[styles.slotTitle, selected && styles.selectedTitle]}>
            {item.formatted}
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
        <TimeSlotGroup data={TimeSlot} onItemSelect={this.onSelectTime} selectedItem={selectedTimeSlot} />
      </View>
    );
  };

  private onSelectUpcomingSlot = (slotId: number): void => {
    const { isUpcomingSlotSelected } = this.state;
    this.setState({ selectedUpcomingSlot: slotId, isUpcomingSlotSelected: !isUpcomingSlotSelected });
  };

  private onChangeVisitType = (value: number): void => {
    this.setState({ visitType: [value] });
  };

  private onSelectDate = (day: string): void => {
    const selectedDate = DateUtils.getDisplayDate(day, 'll');
    this.setState({ selectedDate });
  };

  private onSelectTime = (slotId: number): void => {
    const { selectedTimeSlot } = this.state;
    const newTimeSlot: number[] = cloneDeep(selectedTimeSlot);
    let value;
    if (newTimeSlot.includes(slotId)) {
      remove(newTimeSlot, (item: number) => item === slotId);
      value = newTimeSlot;
    } else {
      value = newTimeSlot.concat(slotId);
    }

    this.setState({ selectedTimeSlot: value });
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

  private handleSubmit = (): void => {
    // TODO:(Shikha) - Add logic here
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
