import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { PropertyActions } from '@homzhub/common/src/modules/property/actions';
import { PropertySelector } from '@homzhub/common/src/modules/property/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { Button, Label, Text, WithShadowView } from '@homzhub/common/src/components';
import Header from '@homzhub/mobile/src/components/molecules/Header';
import { AppStackParamList } from '@homzhub/mobile/src/navigation/AppNavigator';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IRentServiceList, TypeOfSale } from '@homzhub/common/src/domain/models/Property';
import { IUser } from '@homzhub/common/src/domain/models/User';

interface IStateProps {
  user: IUser | null;
  serviceList: IRentServiceList[] | null;
}

interface IDispatchProps {
  getRentServiceList: () => void;
  setTypeOfSale: (typeOfSale: TypeOfSale) => void;
}

interface IRentServicesState {
  isSelected: boolean;
  selectedItem: number;
}

type libraryProps = WithTranslation & NavigationScreenProps<AppStackParamList, ScreensKeys.RentServicesScreen>;
type Props = IStateProps & IDispatchProps & libraryProps;

export class RentServices extends Component<Props, IRentServicesState> {
  public state = {
    isSelected: false,
    selectedItem: -1,
  };

  public componentDidMount(): void {
    const { getRentServiceList } = this.props;
    getRentServiceList();
  }

  public render(): React.ReactNode {
    const { isSelected } = this.state;
    const { user, t, serviceList } = this.props;
    const name = user ? user.full_name : '';
    return (
      <>
        <Header
          backgroundColor={theme.colors.primaryColor}
          icon={icons.leftArrow}
          iconColor={theme.colors.white}
          onIconPress={this.handleBackPress}
          testID="headerIconPress"
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
            {serviceList &&
              serviceList.map((item) => {
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
              testID="btnContinue"
            />
          </WithShadowView>
        </View>
      </>
    );
  }

  private renderServiceItem = (item: IRentServiceList): React.ReactElement => {
    const { isSelected, selectedItem } = this.state;
    const handleSelectedItem = (): void => this.onPressSelectedIcon(item.id);
    const handlePress = (): void => this.onSelectIcon(item.id);
    const isSelect = isSelected && selectedItem === item.id;
    const customStyle = customizedStyles(isSelect);
    return (
      <TouchableOpacity
        style={customStyle.services}
        key={item.label}
        onPress={isSelect ? handleSelectedItem : handlePress}
      >
        <View style={styles.serviceContent}>
          <Icon
            name={item.icon}
            size={22}
            color={isSelect ? theme.colors.primaryColor : theme.colors.darkTint5}
            style={styles.iconStyle}
          />
          <Label type="large" style={customStyle.serviceName}>
            {item.label}
          </Label>
        </View>
        {isSelect ? (
          <Icon
            name={icons.circleFilled}
            size={18}
            color={theme.colors.primaryColor}
            onPress={handleSelectedItem}
            testID="icoFilled"
          />
        ) : (
          <Icon
            name={icons.circleOutline}
            size={18}
            color={theme.colors.disabled}
            onPress={handlePress}
            testID="icoDisabled"
          />
        )}
      </TouchableOpacity>
    );
  };

  private onPressSelectedIcon = (selectedItem: number): void => {
    const { isSelected } = this.state;
    this.setState({ isSelected: !isSelected, selectedItem });
  };

  private onSelectIcon = (selectedItem: number): void => {
    this.setState({ isSelected: true, selectedItem });
  };

  private onContinue = (): void => {
    const { navigation, serviceList, setTypeOfSale } = this.props;
    const { selectedItem } = this.state;

    if (!serviceList) {
      return;
    }

    const selectedType = serviceList.find((service) => service.id === selectedItem);
    if (selectedType) {
      setTypeOfSale(selectedType.name);
    }

    navigation.navigate(ScreensKeys.ServiceListScreen, { serviceId: selectedItem });
  };

  private handleBackPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

export const mapStateToProps = (state: IState): IStateProps => {
  return {
    user: UserSelector.getUserDetails(state),
    serviceList: PropertySelector.getRentServicesList(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getRentServiceList, setTypeOfSale } = PropertyActions;
  return bindActionCreators(
    {
      getRentServiceList,
      setTypeOfSale,
    },
    dispatch
  );
};

export default connect<IStateProps, IDispatchProps, WithTranslation, IState>(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.property)(RentServices));

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
});

const customizedStyles = (isSelect: boolean): any => ({
  services: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: isSelect ? theme.colors.primaryColor : theme.colors.disabled,
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    padding: 16,
  },
  serviceName: {
    color: isSelect ? theme.colors.primaryColor : theme.colors.darkTint5,
  },
});
