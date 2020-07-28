import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { PropertyActions } from '@homzhub/common/src/modules/property/actions';
import { PropertySelector } from '@homzhub/common/src/modules/property/selectors';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import { AnimatedServiceList, CardBody } from '@homzhub/mobile/src/components';
import { AppStackParamList } from '@homzhub/mobile/src/navigation/AppNavigator';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IServiceDetail } from '@homzhub/common/src/domain/models/Service';

interface IDispatchProps {
  getServiceDetails: (payload: number) => void;
}

interface IStateProps {
  services: IServiceDetail[];
}

type libraryProps = WithTranslation & NavigationScreenProps<AppStackParamList, ScreensKeys.ServiceListScreen>;
type Props = libraryProps & IStateProps & IDispatchProps;

export class ServiceListScreen extends Component<Props> {
  public componentDidMount(): void {
    const {
      getServiceDetails,
      route: { params },
    } = this.props;
    getServiceDetails(params.serviceId);
  }

  public render(): React.ReactNode {
    const { services, t } = this.props;
    return (
      <AnimatedServiceList
        headerTitle={t('services')}
        title={t('timeToSelect')}
        subTitle="Eu at id arcu fermentum aliquam arcu nasce" // TODO: Change once proper text decide
        onIconPress={this.handleIconPress}
        testID="animatedServiceHeader"
      >
        <>
          {services.map((item: IServiceDetail, index: number) => {
            const handlePress = (): void => this.navigateToServiceDetail(index);
            return (
              <TouchableOpacity
                style={styles.cardView}
                key={index}
                activeOpacity={0.7}
                onPress={handlePress}
                testID="toPress"
              >
                <CardBody
                  title={item.title}
                  badgeTitle={item.label ? t('common:recommended') : ''}
                  description={item.description}
                  serviceCost={item.service_cost}
                />
              </TouchableOpacity>
            );
          })}
        </>
      </AnimatedServiceList>
    );
  }

  private navigateToServiceDetail = (index: number): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.ServiceDetailScreen, { serviceId: index });
  };

  private handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

export const mapStateToProps = (state: IState): IStateProps => {
  return {
    services: PropertySelector.getServiceDetails(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getServiceDetails } = PropertyActions;
  return bindActionCreators(
    {
      getServiceDetails,
    },
    dispatch
  );
};

export default connect<IStateProps, IDispatchProps, WithTranslation, IState>(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.property)(ServiceListScreen));

const styles = StyleSheet.create({
  cardView: {
    backgroundColor: theme.colors.white,
    marginLeft: 16,
    marginRight: 20,
    paddingVertical: 24,
    borderRadius: 8,
    marginVertical: 14,
  },
});
