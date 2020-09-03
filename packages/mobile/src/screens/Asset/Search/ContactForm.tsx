import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { remove, find, cloneDeep } from 'lodash';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { LeadService } from '@homzhub/common/src/services/LeadService';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label, WithShadowView, Text, Divider, Avatar, Button } from '@homzhub/common/src/components';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { RadioButtonGroup } from '@homzhub/common/src/components/molecules/RadioButtonGroup';
import { StatusBarComponent, TimeSlotGroup } from '@homzhub/mobile/src/components';
import { MultipleButtonGroup } from '@homzhub/mobile/src/components/molecules/MultipleButtonGroup';
import HandleBack from '@homzhub/mobile/src/navigation/HandleBack';
import { SearchStackParamList } from '@homzhub/mobile/src/navigation/SearchStack';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { BedroomType, TimeSlot, UserType } from '@homzhub/common/src/mocks/ContactFormData';
import { IFilter } from '@homzhub/common/src/domain/models/Search';

interface ISlot {
  from_time: number;
  to_time: number;
}

export interface IRadiaButtonGroupData {
  id: number;
  label: string;
  value: string;
}

interface IStateProps {
  filters: IFilter;
  isLoggedIn: boolean;
}

interface IContactState {
  selectedTime: number[];
  selectedSpaces: string[];
  userType: number;
  message: string;
}

type libraryProps = WithTranslation & NavigationScreenProps<SearchStackParamList, ScreensKeys.ContactForm>;
type Props = libraryProps & IStateProps;

export class ContactForm extends React.PureComponent<Props, IContactState> {
  public state = {
    selectedTime: [],
    selectedSpaces: [],
    userType: 1,
    message: '',
  };

  public render = (): React.ReactElement => {
    const { selectedTime, selectedSpaces, userType } = this.state;
    const { t, navigation } = this.props;
    return (
      <HandleBack onBack={this.goBack} navigation={navigation}>
        <StatusBarComponent backgroundColor="white" isTranslucent={false} statusBarStyle={styles.statusBar} />
        <SafeAreaView style={styles.flexOne}>
          {this.renderHeader()}
          <ScrollView style={styles.scrollView}>
            {this.renderContactDetail()}
            <Divider containerStyles={styles.divider} />
            <Text type="small" textType="semiBold" style={styles.userType}>
              {t('iAm')}
            </Text>
            <RadioButtonGroup
              data={UserType}
              onToggle={this.onUserToggle}
              containerStyle={styles.radioGroup}
              selectedValue={userType}
            />
            <Label type="large" textType="semiBold" style={styles.label}>
              {t('lookingFor')}
            </Label>
            <MultipleButtonGroup<string>
              data={BedroomType}
              onItemSelect={this.onSelectLookingType}
              selectedItem={selectedSpaces}
              containerStyle={styles.buttonGroup}
            />
            <Label type="large" textType="semiBold" style={styles.label}>
              {t('preferredTime')}
            </Label>
            <TimeSlotGroup data={TimeSlot} selectedItem={selectedTime} onItemSelect={this.onTimeSelect} />
            <TextArea
              label={t('message')}
              placeholder={t('typeYourMessage')}
              isOptional
              containerStyle={styles.textArea}
              onMessageChange={this.handleMessageChange}
            />
          </ScrollView>
        </SafeAreaView>
        <WithShadowView outerViewStyle={styles.shadowView}>
          <Button
            type="primary"
            title={t('sendMessage')}
            disabled={selectedTime.length === 0 || selectedSpaces.length === 0}
            icon={icons.envelope}
            iconColor={theme.colors.white}
            iconSize={22}
            titleStyle={styles.buttonTitleStyle}
            containerStyle={styles.buttonStyle}
            onPress={this.handleSubmit}
          />
        </WithShadowView>
      </HandleBack>
    );
  };

  private renderHeader = (): React.ReactElement => {
    const { t } = this.props;
    return (
      <WithShadowView>
        <View style={styles.bottomSheetHeader}>
          <Icon name={icons.close} size={22} color={theme.colors.darkTint3} onPress={this.goBack} />
          <Text type="small" textType="semiBold" style={styles.headerTitle}>
            {t('contact')}
          </Text>
        </View>
      </WithShadowView>
    );
  };

  private renderContactDetail = (): React.ReactElement => {
    const {
      t,
      route: {
        params: { contactDetail },
      },
    } = this.props;

    const number = `${contactDetail?.countryCode}${contactDetail?.phoneNumber}`;
    return (
      <>
        <Label type="large" textType="semiBold" style={styles.userType}>
          {t('youContacting')}
        </Label>
        <Avatar
          fullName={contactDetail?.fullName ?? ''}
          designation="Owner"
          phoneNumber={number}
          containerStyle={styles.avatarStyle}
        />
      </>
    );
  };

  private onTimeSelect = (id: number): void => {
    const { selectedTime } = this.state;
    const newTime: number[] = cloneDeep(selectedTime);
    let value;
    if (newTime.includes(id)) {
      remove(newTime, (item: number) => item === id);
      value = newTime;
    } else {
      value = newTime.concat(id);
    }

    this.setState({ selectedTime: value });
  };

  private onUserToggle = (id: number): void => {
    this.setState({
      userType: id,
    });
  };

  private onSelectLookingType = (type: string): void => {
    const { selectedSpaces } = this.state;
    const newSpaces: string[] = cloneDeep(selectedSpaces);
    let value;
    if (newSpaces.includes(type)) {
      remove(newSpaces, (item: string) => item === type);
      value = newSpaces;
    } else {
      value = newSpaces.concat(type);
    }
    this.setState({ selectedSpaces: value });
  };

  private handleMessageChange = (value: string): void => {
    this.setState({ message: value });
  };

  private handleSubmit = async (): Promise<void> => {
    const {
      isLoggedIn,
      filters: { asset_transaction_type },
      route: {
        params: { contactDetail, propertyTermId },
      },
      t,
      navigation,
    } = this.props;
    if (!contactDetail) return;
    const { userType, selectedTime, selectedSpaces, message } = this.state;
    const personType = UserType.find((item) => item.id === userType);
    const timeSlot: ISlot[] = [];

    selectedTime.forEach((id): any => {
      TimeSlot.forEach((item) => {
        if (item.id === id) {
          const slot = {
            from_time: item.from,
            to_time: item.to,
          };
          const slotObject = find(timeSlot, slot);
          if (!slotObject) {
            timeSlot.push(slot);
          }
        }
      });
    });

    if (personType && timeSlot.length > 0) {
      const payload = {
        propertyTermId,
        data: {
          spaces: selectedSpaces,
          contact_person_type: personType.value,
          lead_type: 'MAIL',
          ...(message && { message }),
          person_contacted: contactDetail.id,
          preferred_contact_time: timeSlot,
        },
      };

      if (isLoggedIn) {
        await LeadService.postLeadDetail(asset_transaction_type, payload);
        AlertHelper.success({ message: t('assetDescription:messageSent') });
        navigation.navigate(ScreensKeys.PropertyAssetDescription, { propertyTermId });
      } else {
        AlertHelper.error({ message: t('pleaseSignup') });
      }
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
    filters: SearchSelector.getFilters(state),
    isLoggedIn: UserSelector.isLoggedIn(state),
  };
};

export default connect(mapStateToProps, null)(withTranslation()(ContactForm));

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  statusBar: {
    height: PlatformUtils.isIOS() ? 50 : 10,
  },
  scrollView: {
    paddingHorizontal: 16,
    backgroundColor: theme.colors.white,
  },
  divider: {
    borderColor: theme.colors.darkTint10,
    marginBottom: 24,
  },
  userType: {
    color: theme.colors.darkTint3,
  },
  radioGroup: {
    marginVertical: 16,
  },
  label: {
    marginVertical: 12,
    color: theme.colors.darkTint3,
  },
  buttonGroup: {
    marginBottom: 18,
  },
  textArea: {
    marginVertical: 20,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    alignContent: 'center',
    paddingBottom: 20,
    marginHorizontal: 24,
  },
  buttonTitleStyle: {
    marginHorizontal: 12,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
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
  avatarStyle: {
    paddingVertical: 18,
  },
});
