import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon from '@homzhub/common/src/assets/icon';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { Button, Label, Text, WithShadowView } from '@homzhub/common/src/components';
import Header from '@homzhub/mobile/src/components/molecules/Header';
import { AppStackParamList } from '@homzhub/mobile/src/navigation/AppNavigator';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IUser } from '@homzhub/common/src/domain/models/User';
import { RentServicesData } from '@homzhub/common/src/mocks/rentServices';

interface IStateProps {
  user: IUser | null;
}

interface IDispatchProps {
  logoutSuccess: () => void;
}

interface IRentServicesState {
  isSelected: boolean;
  selectedItem: string;
}

type libraryProps = WithTranslation & NavigationScreenProps<AppStackParamList, ScreensKeys.RentServicesScreen>;
type Props = IStateProps & IDispatchProps & libraryProps;

class RentServices extends Component<Props, IRentServicesState> {
  public state = {
    isSelected: false,
    selectedItem: '',
  };

  public render(): React.ReactNode {
    const { isSelected } = this.state;
    const { user, t } = this.props;
    const name = user ? user.full_name : '';
    return (
      <>
        <Header
          backgroundColor={theme.colors.primaryColor}
          icon="left-arrow"
          iconColor={theme.colors.white}
          onIconPress={this.handleBackPress}
        />
        <View style={styles.container}>
          <View style={styles.content}>
            <Text type="large" textType="semiBold" style={styles.title}>
              {t('congratsUser', { name })}
            </Text>
            <Label type="large" style={styles.subTitle}>
              {t('propertyAddedMsg')}
            </Label>
            <Label type="large" textType="semiBold" style={styles.serviceTitle}>
              {t('serviceNeed')}
            </Label>
            {RentServicesData.map((item) => {
              return this.renderServiceItem(item);
            })}
          </View>
          <WithShadowView outerViewStyle={styles.shadowView}>
            <Button
              type="primary"
              title={t('common:continue')}
              disabled={!isSelected}
              containerStyle={styles.buttonStyle}
              onPress={this.onContinue}
            />
          </WithShadowView>
        </View>
      </>
    );
  }

  // TODO: (Shikha: 01/06/20)- Add return type once Api is ready
  private renderServiceItem = (item: any): React.ReactElement => {
    const { isSelected, selectedItem } = this.state;
    const handlePress = (): void => this.onPressIcon(item.name);
    return (
      <View style={styles.services} key={item.name}>
        <View style={styles.serviceContent}>
          <Icon name={item.icon} size={22} color={theme.colors.darkTint5} style={styles.iconStyle} />
          <Label type="large" style={styles.serviceName}>
            {item.name}
          </Label>
        </View>
        {isSelected && selectedItem === item.name ? (
          <Icon name="circle-filled" size={18} color={theme.colors.primaryColor} onPress={handlePress} />
        ) : (
          <Icon name="circle-outline" size={18} color={theme.colors.disabled} onPress={handlePress} />
        )}
      </View>
    );
  };

  private onPressIcon = (selectedItem: string): void => {
    const { isSelected } = this.state;
    this.setState({ isSelected: !isSelected, selectedItem });
  };

  private onContinue = (): void => {
    // Add logic
  };

  private handleBackPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    user: UserSelector.getUserDetails(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { logoutSuccess } = UserActions;
  return bindActionCreators(
    {
      logoutSuccess,
    },
    dispatch
  );
};

export default connect<IStateProps, IDispatchProps, WithTranslation, IState>(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.propertyPost)(RentServices));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    justifyContent: 'space-between',
  },
  content: {
    marginVertical: 16,
    marginHorizontal: 24,
  },
  services: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: theme.colors.disabled,
    borderRadius: 4,
    borderWidth: 0.5,
    padding: 16,
  },
  title: {
    paddingVertical: 8,
    color: theme.colors.darkTint2,
  },
  subTitle: {
    color: theme.colors.darkTint3,
  },
  serviceTitle: {
    marginTop: 26,
    color: theme.colors.darkTint3,
  },
  serviceContent: {
    flexDirection: 'row',
    flex: 1,
  },
  iconStyle: {
    marginRight: 12,
  },
  shadowView: {
    paddingTop: 10,
    marginBottom: PlatformUtils.isIOS() ? 20 : 0,
    paddingBottom: 0,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
  serviceName: {
    color: theme.colors.darkTint5,
  },
});
