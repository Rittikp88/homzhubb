import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider, Dropdown, Label, RNSwitch } from '@homzhub/common/src/components';
import { AnimatedProfileHeader } from '@homzhub/mobile/src/components';
import {
  SettingsScreenData,
  ISettingsData,
  ISettingsOptions,
  OptionTypes,
} from '@homzhub/common/src/constants/Settings';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

type libraryProps = WithTranslation & NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.SettingsScreen>;
type IOwnProps = libraryProps;

class Settings extends React.PureComponent<IOwnProps> {
  public render = (): React.ReactElement => {
    const { t } = this.props;

    return (
      <AnimatedProfileHeader sectionHeader={t('assetMore:Settings')} onBackPress={this.onBackPress}>
        <View style={styles.container}>
          {SettingsScreenData.map((item: ISettingsData, index) => {
            return item.visible ? this.renderTitle(item, index < SettingsScreenData.length - 1) : null;
          })}
        </View>
      </AnimatedProfileHeader>
    );
  };

  private renderTitle = (info: ISettingsData, showDivider: boolean): ReactElement => {
    const { t } = this.props;

    return (
      <>
        <View style={styles.rowStyle}>
          {info.icon && <Icon size={20} name={info.icon} color={theme.colors.darkTint4} onPress={FunctionUtils.noop} />}
          <Label style={styles.title} type="large" textType="semiBold">
            {t(info.name)}
          </Label>
        </View>
        {info.options.map((option, index) => {
          return this.renderSubTitle(option, index < info.options.length - 1);
        })}
        {showDivider && <Divider containerStyles={styles.titleDividerStyles} />}
      </>
    );
  };

  private renderSubTitle = (options: ISettingsOptions, showDivider: boolean): ReactElement => {
    const { t } = this.props;

    return (
      <>
        <View style={[styles.rowStyle, styles.subTitleView]}>
          <Label style={styles.subTitle} type="regular">
            {t(options.label)}
          </Label>
          {this.renderOptionTypes(options.type)}
        </View>
        {showDivider && (
          <View style={styles.paddingLeft}>
            <Divider />
          </View>
        )}
      </>
    );
  };

  private renderOptionTypes = (type: OptionTypes): ReactElement => {
    let renderElement: ReactElement;
    switch (type) {
      case OptionTypes.Webview:
        renderElement = (
          <Icon size={20} name={icons.rightArrow} color={theme.colors.darkTint4} onPress={FunctionUtils.noop} />
        );
        break;
      case OptionTypes.Dropdown:
        renderElement = (
          <Dropdown
            data={[{ label: 'Label1', value: 'label 1' }]}
            value="label 1"
            onDonePress={FunctionUtils.noop}
            icon={icons.downArrow}
            iconColor={theme.colors.primaryColor}
            containerStyle={styles.dropDownStyle}
            textStyle={styles.primaryColor}
            fontWeight="semiBold"
          />
        );
        break;
      default:
        renderElement = <RNSwitch selected onToggle={FunctionUtils.noop} />;
    }
    return renderElement;
  };

  private onBackPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

export default withTranslation(LocaleConstants.namespacesKey.moreSettings)(Settings);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  subTitle: {
    marginVertical: 16,
  },
  titleDividerStyles: {
    borderColor: theme.colors.moreSeparator,
    borderWidth: 10,
    marginBottom: 16,
  },
  paddingLeft: {
    paddingLeft: theme.layout.screenPadding,
  },
  dropDownStyle: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 0,
  },
  primaryColor: {
    color: theme.colors.primaryColor,
  },
});
