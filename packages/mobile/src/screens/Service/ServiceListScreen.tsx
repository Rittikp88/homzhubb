import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { IState } from '@homzhub/common/dist/modules/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { ServiceActions } from '@homzhub/common/src/modules/service/actions';
import { ServiceSelector } from '@homzhub/common/src/modules/service/selectors';
import { CardBody } from '@homzhub/mobile/src/components/molecules/CardBody';
import { AnimatedServiceList } from '@homzhub/mobile/src/components/templates/AnimatedServiceList';
import { AppStackParamList } from '@homzhub/mobile/src/navigation/AppNavigator';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IServiceDetail } from '@homzhub/common/src/domain/models/Service';
import { IServiceParam } from '@homzhub/common/dist/domain/repositories/interfaces';

interface IDispatchProps {
  getServiceDetails: (payload: IServiceParam) => void;
}

interface IStateProps {
  services: IServiceDetail[];
}

type libraryProps = WithTranslation & NavigationScreenProps<AppStackParamList, ScreensKeys.ServiceListScreen>;
type Props = libraryProps & IStateProps & IDispatchProps;

class ServiceListScreen extends Component<Props> {
  public componentDidMount(): void {
    const {
      getServiceDetails,
      route: { params },
    } = this.props;
    getServiceDetails({ service_categories_id: params.serviceId });
  }

  public render(): React.ReactNode {
    const { services, t } = this.props;
    return (
      <AnimatedServiceList
        headerTitle={t('services')}
        title={t('timeToSelect')}
        subTitle="Eu at id arcu fermentum aliquam arcu nasce" // TODO: Change once proper text decide
        onIconPress={this.handleIconPress}
      >
        <>
          {services.map((item: IServiceDetail, index: number) => {
            const handlePress = (): void => this.navigateToServiceDetail(index);
            return (
              <TouchableOpacity style={styles.cardView} key={index} activeOpacity={0.7} onPress={handlePress}>
                <CardBody
                  title={item.title}
                  badgeTitle={item.label}
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

const mapStateToProps = (state: IState): IStateProps => {
  return {
    services: ServiceSelector.getServiceDetails(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getServiceDetails } = ServiceActions;
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
)(withTranslation(LocaleConstants.namespacesKey.service)(ServiceListScreen));

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
