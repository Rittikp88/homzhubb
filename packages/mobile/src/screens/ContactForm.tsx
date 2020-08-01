import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { remove, find, cloneDeep } from 'lodash';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { ILeadPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { SearchStackParamList } from '@homzhub/mobile/src/navigation/BottomTabNavigator';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { Label, WithShadowView, Text, Divider, Avatar, Button } from '@homzhub/common/src/components';
import { StatusBarComponent, TimeSlotGroup } from '@homzhub/mobile/src/components';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { RadioButtonGroup } from '@homzhub/common/src/components/molecules/RadioButtonGroup';
import { MultipleButtonGroup } from '@homzhub/mobile/src/components/molecules/MultipleButtonGroup';
import { BedroomType, TimeSlot, UserType } from '@homzhub/common/src/mocks/ContactFormData';

interface ISlot {
  from: number;
  to: number;
}

export interface IRadiaButtonGroupData {
  id: number;
  label: string;
}

interface IStateProps {
  isLoggedIn: boolean;
}

interface IDispatchProps {
  postLead: (payload: ILeadPayload) => void;
}

interface IContactState {
  selectedTime: number[];
  selectedSpaces: string[];
  userType: number;
  message: string;
}

type libraryProps = WithTranslation & NavigationScreenProps<SearchStackParamList, ScreensKeys.ContactForm>;
type Props = libraryProps & IDispatchProps & IStateProps;

class ContactForm extends React.PureComponent<Props, IContactState> {
  public state = {
    selectedTime: [],
    selectedSpaces: [],
    userType: 1,
    message: '',
  };

  public render = (): React.ReactElement => {
    const { selectedTime, selectedSpaces, userType } = this.state;
    const { t } = this.props;
    return (
      <>
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
            <MultipleButtonGroup
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
            icon={icons.envelope}
            iconColor={theme.colors.white}
            iconSize={22}
            titleStyle={styles.buttonTitleStyle}
            containerStyle={styles.buttonStyle}
            onPress={this.handleSubmit}
          />
        </WithShadowView>
      </>
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

    const number = `${contactDetail.countryCode}${contactDetail.phoneNumber}`;
    return (
      <>
        <Label type="large" textType="semiBold" style={styles.userType}>
          {t('youContacting')}
        </Label>
        <Avatar
          fullName={contactDetail.fullName}
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

  private handleSubmit = (): void => {
    const {
      isLoggedIn,
      postLead,
      route: {
        params: { contactDetail, propertyTermId },
      },
    } = this.props;
    if (!contactDetail) return;
    const { userType, selectedTime, selectedSpaces, message } = this.state;
    const personType = UserType.find((item) => item.id === userType);
    const timeSlot: ISlot[] = [];

    selectedTime.forEach((id): any => {
      TimeSlot.forEach((item) => {
        if (item.id === id) {
          const slot = {
            from: item.from,
            to: item.to,
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
          contact_person_type: personType.label,
          lead_type: 'MAIL',
          message,
          person_contacted: contactDetail.id,
          preferred_contact_time: timeSlot,
        },
      };
      // TODO: Need to move this logic on Asset Description Screen
      if (isLoggedIn) {
        postLead(payload);
      } else {
        AlertHelper.error({ message: 'Login required' });
      }
    }
  };

  private goBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    isLoggedIn: UserSelector.isLoggedIn(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { postLead } = AssetActions;
  return bindActionCreators({ postLead }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ContactForm));

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
