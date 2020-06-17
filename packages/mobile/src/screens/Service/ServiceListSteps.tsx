import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { PropertyActions } from '@homzhub/common/src/modules/property/actions';
import { PropertySelector } from '@homzhub/common/src/modules/property/selectors';
import { IServiceListStepsDetail } from '@homzhub/common/src/domain/models/Service';
import { Label, Text, Divider } from '@homzhub/common/src/components';
import Header from '@homzhub/mobile/src/components/molecules/Header';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AppStackParamList } from '@homzhub/mobile/src/navigation/AppNavigator';

interface IStateProps {
  serviceSteps: IServiceListStepsDetail[];
}

interface IDispatchProps {
  getServiceStepsDetails: (id: number) => void;
}

type libraryProps = WithTranslation & NavigationScreenProps<AppStackParamList, ScreensKeys.ServiceListSteps>;
type Props = libraryProps & IStateProps & IDispatchProps;

class ServiceListSteps extends React.PureComponent<Props, {}> {
  public componentDidMount(): void {
    const {
      getServiceStepsDetails,
      route: { params },
    } = this.props;
    getServiceStepsDetails(params.id);
  }

  public render(): React.ReactNode {
    const {
      t,
      route: { params },
    } = this.props;
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={theme.colors.primaryColor}
          icon={icons.leftArrow}
          iconColor="white"
          iconStyle={styles.iconStyle}
          onIconPress={this.navigateBack}
          isHeadingVisible
          title={t('service:listProperty')}
          titleType="regular"
          titleFontType="semiBold"
          titleStyle={styles.headerTitle}
        />
        <View style={styles.listing}>
          <Text type="regular" textType="semiBold" style={styles.listingTitle}>
            {params.name}
          </Text>
          <Label type="large" textType="semiBold" style={styles.label} onPress={this.navigateBack}>
            {t('common:change')}
          </Label>
        </View>
        <View style={styles.initiateService}>
          <Text type="small" textType="semiBold" style={styles.subHeader}>
            {t('service:subHeader')}
          </Text>
          {this.renderSteps()}
        </View>
      </View>
    );
  }

  public renderSteps(): React.ReactNode {
    const { serviceSteps } = this.props;
    return serviceSteps.map((stepItem: IServiceListStepsDetail, index: number) => {
      const isLast = serviceSteps.length - 1 === index;
      return (
        <>
          <View key={index} style={styles.stepView}>
            <Text type="small" textType="regular" style={styles.stepItem}>
              {index + 1}
            </Text>
            <Text type="regular" textType="regular" style={styles.stepName}>
              {stepItem.title}
            </Text>
          </View>
          {!isLast && <Divider containerStyles={styles.divider} key={`divider-${index}`} />}
        </>
      );
    });
  }

  public navigateBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getServiceSteps } = PropertySelector;
  return {
    serviceSteps: getServiceSteps(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getServiceStepsDetails } = PropertyActions;
  return bindActionCreators(
    {
      getServiceStepsDetails,
    },
    dispatch
  );
};

export default connect<IStateProps, IDispatchProps, WithTranslation, IState>(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(ServiceListSteps));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  iconStyle: {
    flex: 1,
  },
  headerTitle: {
    color: theme.colors.white,
  },
  listing: {
    flexDirection: 'row',
    margin: theme.layout.screenPadding,
  },
  listingTitle: {
    flex: 1,
  },
  label: {
    color: theme.colors.primaryColor,
  },
  initiateService: {
    margin: theme.layout.screenPadding,
  },
  subHeader: {
    color: theme.colors.darkTint4,
  },
  stepView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  stepItem: {
    width: 35,
    height: 35,
    borderColor: theme.colors.darkTint4,
    borderRadius: 35,
    borderWidth: 2,
    paddingTop: 5,
    textAlign: 'center',
  },
  divider: {
    borderColor: theme.colors.disabled,
    borderWidth: 1,
    width: 35,
    marginTop: 25,
    transform: [{ rotate: '90deg' }],
  },
  stepName: {
    flex: 1,
    marginLeft: 20,
  },
});
