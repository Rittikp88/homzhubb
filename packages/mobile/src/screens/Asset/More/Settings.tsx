import React, { ReactElement } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { IUpdateUserPreferences } from '@homzhub/common/src/domain/repositories/interfaces';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider, Dropdown, Label, RNSwitch } from '@homzhub/common/src/components';
import { AnimatedProfileHeader, Loader } from '@homzhub/mobile/src/components';
import { OptionTypes, SelectedPreferenceType, SettingOptions } from '@homzhub/common/src/domain/models/SettingOptions';
import { UserPreferences, UserPreferencesKeys } from '@homzhub/common/src/domain/models/UserPreferences';
import { SettingsData } from '@homzhub/common/src/domain/models/SettingsData';
import { SettingsDropdownValues } from '@homzhub/common/src/domain/models/SettingsDropdownValues';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

type libraryProps = WithTranslation & NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.SettingsScreen>;

interface IDispatchProps {
  updateUserPreferences: (payload: IUpdateUserPreferences) => void;
}

interface IStateProps {
  userPreferences: UserPreferences;
  isUserPreferencesLoading: boolean;
}

type IOwnProps = libraryProps & IStateProps & IDispatchProps;

interface IOwnState {
  settingsData: SettingsData[];
  isLoading: boolean;
}

class Settings extends React.PureComponent<IOwnProps, IOwnState> {
  public state = {
    settingsData: [],
    isLoading: false,
  };

  public componentDidMount(): void {
    this.getSettingData().then();
  }

  public async componentDidUpdate(prevProps: Readonly<IOwnProps>): Promise<void> {
    const { userPreferences } = this.props;

    if (userPreferences !== prevProps.userPreferences) {
      await this.getSettingData();
    }
  }

  public render = (): React.ReactNode => {
    const { t, isUserPreferencesLoading } = this.props;
    const { settingsData, isLoading } = this.state;

    return (
      <>
        <AnimatedProfileHeader
          title={t('assetMore:more')}
          sectionHeader={t('assetMore:Settings')}
          onBackPress={this.onBackPress}
          sectionTitleType="semiBold"
        >
          <View style={styles.container}>
            {settingsData.map((item: SettingsData, index) => {
              return (
                <React.Fragment key={index}>
                  {item.visible ? this.renderTitle(item, index < settingsData.length - 1) : null}
                </React.Fragment>
              );
            })}
          </View>
        </AnimatedProfileHeader>
        <Loader visible={isUserPreferencesLoading && isLoading} />
      </>
    );
  };

  private renderTitle = (info: SettingsData, showDivider: boolean): ReactElement => {
    const { t } = this.props;

    return (
      <>
        <View style={styles.rowStyle}>
          {info.icon && <Icon size={20} name={info.icon} color={theme.colors.darkTint2} />}
          <Label style={styles.title} type="large" textType="semiBold">
            {t(info.name)}
          </Label>
        </View>
        {info.options.map((option, index) => {
          return (
            <React.Fragment key={index}>{this.renderSubTitle(option, index < info.options.length - 1)}</React.Fragment>
          );
        })}
        {showDivider && <Divider containerStyles={styles.titleDividerStyles} />}
      </>
    );
  };

  private renderSubTitle = (options: SettingOptions, showDivider: boolean): ReactElement => {
    const { t } = this.props;

    return (
      <>
        <View style={[styles.rowStyle, styles.subTitleView]}>
          <Label style={styles.subTitle} type="large">
            {t(options.label)}
          </Label>
          {this.renderOptionTypes(options)}
        </View>
        {showDivider && (
          <View style={styles.paddingLeft}>
            <Divider />
          </View>
        )}
      </>
    );
  };

  private renderOptionTypes = (options: SettingOptions): ReactElement => {
    let renderElement: ReactElement;
    let navigateToWebview: () => void;
    const handleChange = (value?: SelectedPreferenceType): void =>
      this.handlePreferenceUpdate(options.name, value || !options.selected);
    switch (options.type) {
      case OptionTypes.Webview:
        navigateToWebview = (): void => this.navigateToWebview(options.url);

        renderElement = (
          <Icon size={20} name={icons.rightArrow} color={theme.colors.lowPriority} onPress={navigateToWebview} />
        );
        break;
      case OptionTypes.Dropdown:
        renderElement = (
          <Dropdown
            data={options.options}
            value={options.selected as string}
            onDonePress={handleChange}
            icon={icons.downArrow}
            iconColor={theme.colors.primaryColor}
            containerStyle={styles.dropDownStyle}
            textStyle={styles.primaryColor}
            fontWeight="semiBold"
          />
        );
        break;
      default:
        renderElement = <RNSwitch selected={options.selected as boolean} onToggle={handleChange} />;
    }
    return renderElement;
  };

  private onBackPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private handlePreferenceUpdate = (key: string, value: SelectedPreferenceType): void => {
    const { updateUserPreferences } = this.props;
    updateUserPreferences({ [key]: value });
  };

  private navigateToWebview = (url: string): void => {
    const {
      navigation: { navigate },
    } = this.props;

    navigate(ScreensKeys.WebViewScreen, { url });
  };

  private getSettingData = async (): Promise<void> => {
    this.setState({ isLoading: true });
    try {
      const settingsData = UserRepository.getSettingScreenData();
      const settingDropDownValues = await UserRepository.getSettingDropDownValues();

      this.populateSettingOptions(settingsData, settingDropDownValues);
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  private populateSettingOptions = (
    settingsData: SettingsData[],
    settingDropDownValues: SettingsDropdownValues
  ): void => {
    const { userPreferences } = this.props;

    settingsData.forEach((item) => {
      item.options.forEach((option) => {
        switch (option.name) {
          case UserPreferencesKeys.CurrencyKey:
            option.options = settingDropDownValues.currency;
            option.selected = userPreferences.currency;
            break;
          case UserPreferencesKeys.LanguageKey:
            option.options = settingDropDownValues.language;
            option.selected = userPreferences.language;
            break;
          case UserPreferencesKeys.FinancialYear:
            option.options = settingDropDownValues.financialYear;
            option.selected = userPreferences.financialYear;
            break;
          case UserPreferencesKeys.MetricUnit:
            option.options = settingDropDownValues.metricUnit;
            option.selected = userPreferences.metricUnit;
            break;
          default:
            option.options = [];
            option.selected = false;
        }
      });
    });

    this.setState({ settingsData });
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getUserPreferences, isUserPreferencesLoading } = UserSelector;
  return {
    userPreferences: getUserPreferences(state),
    isUserPreferencesLoading: isUserPreferencesLoading(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { updateUserPreferences } = UserActions;
  return bindActionCreators({ updateUserPreferences }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.moreSettings)(Settings));

const styles = StyleSheet.create({
  container: {
    paddingTop: 42,
    paddingBottom: 8,
    backgroundColor: theme.colors.white,
  },
  rowStyle: {
    flexDirection: 'row',
    paddingHorizontal: theme.layout.screenPadding,
  },
  subTitleView: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginLeft: 8,
    marginBottom: 8,
    color: theme.colors.darkTint2,
  },
  subTitle: {
    marginVertical: 16,
    marginLeft: 8,
    color: theme.colors.darkTint4,
  },
  titleDividerStyles: {
    borderColor: theme.colors.moreSeparator,
    borderWidth: 10,
    marginBottom: 16,
  },
  paddingLeft: {
    paddingLeft: theme.layout.screenPadding + 8,
  },
  dropDownStyle: {
    paddingHorizontal: 0,
    borderWidth: 0,
  },
  primaryColor: {
    color: theme.colors.primaryColor,
  },
});
