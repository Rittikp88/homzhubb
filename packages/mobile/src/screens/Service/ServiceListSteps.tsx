import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { remove } from 'lodash';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { PropertyActions } from '@homzhub/common/src/modules/property/actions';
import { PropertySelector } from '@homzhub/common/src/modules/property/selectors';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Label, Text, Divider, Button, WithShadowView } from '@homzhub/common/src/components';
import { Header } from '@homzhub/mobile/src/components';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AppStackParamList } from '@homzhub/mobile/src/navigation/AppNavigator';
import {
  IServiceCategory,
  IServiceListSteps,
  IServiceListStepsDetail,
  IServiceListStepsPayload,
  ServiceStepTypes,
} from '@homzhub/common/src/domain/models/Service';

interface IStateProps {
  serviceSteps: IServiceListStepsDetail;
  serviceCategory: IServiceCategory;
}

interface IDispatchProps {
  getServiceStepsDetails: (data: IServiceListStepsPayload) => void;
}

type libraryProps = WithTranslation & NavigationScreenProps<AppStackParamList, ScreensKeys.ServiceListSteps>;
export type Props = libraryProps & IStateProps & IDispatchProps;

export class ServiceListSteps extends React.PureComponent<Props, {}> {
  public componentDidMount(): void {
    const {
      getServiceStepsDetails,
      serviceCategory,
      route: { params },
    } = this.props;
    getServiceStepsDetails({ serviceCategoryId: serviceCategory.id, serviceId: params.id });
  }

  public render(): React.ReactNode {
    const {
      t,
      route: { params },
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.flexOne}>
          <Header
            backgroundColor={theme.colors.primaryColor}
            icon={icons.leftArrow}
            iconColor="white"
            iconStyle={styles.flexOne}
            onIconPress={this.navigateBack}
            isHeadingVisible
            title={t('property:listProperty')}
            titleType="regular"
            titleFontType="semiBold"
            titleStyle={styles.headerTitle}
          />
          <ScrollView style={styles.flexOne}>
            <View style={styles.listing}>
              <Text type="regular" textType="semiBold" style={styles.listingTitle}>
                {params.name}
              </Text>
              <Label
                type="large"
                textType="semiBold"
                style={styles.label}
                onPress={this.navigateBack}
                testID="lblNavigate"
              >
                {t('common:change')}
              </Label>
            </View>
            <View style={styles.initiateService}>
              <Text type="small" textType="semiBold" style={styles.subHeader}>
                {t('property:subHeader')}
              </Text>
              {this.renderSteps()}
            </View>
          </ScrollView>
        </View>
        <WithShadowView outerViewStyle={styles.shadowView}>
          <Button
            type="primary"
            title={t('common:getStarted')}
            containerStyle={styles.buttonStyle}
            onPress={this.onContinue}
            testID="btnContinue"
          />
        </WithShadowView>
      </View>
    );
  }

  public renderSteps(): React.ReactNode {
    const {
      serviceSteps: { steps, PROPERTY_VERIFICATIONS, PAYMENT_TOKEN_AMOUNT },
    } = this.props;
    // Filter the steps based on boolean flags
    if (!PROPERTY_VERIFICATIONS) {
      remove(steps, (stepItem: IServiceListSteps) => {
        return stepItem.name === ServiceStepTypes.PROPERTY_VERIFICATIONS;
      });
    }
    if (!PAYMENT_TOKEN_AMOUNT) {
      remove(steps, (stepItem: IServiceListSteps) => {
        return stepItem.name === ServiceStepTypes.PAYMENT_TOKEN_AMOUNT;
      });
    }
    return steps.map((stepItem: IServiceListSteps, index: number) => {
      const isLast = steps.length - 1 === index;
      return (
        <View key={`stepContainer${index}`}>
          <View key={index} style={styles.stepView}>
            <View style={styles.stepItem} key={index}>
              <Text type="small" textType="regular" key={`stepNo${index}`}>
                {index + 1}
              </Text>
            </View>
            <Text
              type="small"
              textType="regular"
              style={styles.stepName}
              key={`stepTitle${index}`}
              numberOfLines={1}
              minimumFontScale={0.5}
              adjustsFontSizeToFit
            >
              {stepItem.title}
            </Text>
          </View>
          {!isLast && <Divider containerStyles={styles.divider} key={`divider-${index}`} />}
        </View>
      );
    });
  }

  private onContinue = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.ServiceCheckoutSteps);
  };

  public navigateBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

export const mapStateToProps = (state: IState): IStateProps => {
  const { getServiceSteps, getServiceCategory } = PropertySelector;
  return {
    serviceSteps: getServiceSteps(state),
    serviceCategory: getServiceCategory(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
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
  flexOne: {
    flex: 1,
  },
  headerTitle: {
    color: theme.colors.white,
  },
  listing: {
    flexDirection: 'row',
    margin: theme.layout.screenPadding,
    alignItems: 'center',
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
    borderRadius: 35 / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
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
    alignSelf: 'center',
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
