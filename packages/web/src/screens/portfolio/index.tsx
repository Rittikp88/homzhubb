import React from 'react';
import { PickerItemProps, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { IWithMediaQuery, withMediaQuery } from '@homzhub/common/src/utils/MediaQueryUtils';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import AssetCard from '@homzhub/web/src/screens/portfolio/components/PortfolioCardGroup';
import PortfolioFilter from '@homzhub/web/src/screens/portfolio/components/PortfolioFilter';
import { Asset, DataType } from '@homzhub/common/src/domain/models/Asset';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IGetPropertiesPayload, ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';

interface IStateProps {
  properties: Asset[] | null;
  isTenanciesLoading: boolean;
  currentFilter: Filters;
}
interface IDispatchProps {
  getPropertyDetails: (payload: IGetPropertiesPayload) => void;
  setCurrentAsset: (payload: ISetAssetPayload) => void;
  setEditPropertyFlow: (payload: boolean) => void;
  setAssetId: (payload: number) => void;
  clearMessages: () => void;
}
interface IPortfolioState {
  filters: PickerItemProps[];
  assetType: string;
}
type Props = WithTranslation & IStateProps & IDispatchProps & IWithMediaQuery;

// TODO : Navigation logic for onclick events
export class Portfolio extends React.PureComponent<Props, IPortfolioState> {
  public state = {
    filters: [],
    assetType: '',
  };

  public componentDidMount = (): void => {
    this.getScreenData();
    PortfolioRepository.getAssetFilters()
      .then((response) => {
        this.setState({
          filters: response,
        });
      })
      .catch((e) => {
        const error = ErrorUtils.getErrorMessage(e.details);
        AlertHelper.error({ message: error });
      });
  };

  public render = (): React.ReactElement => {
    const { properties } = this.props;
    const { filters } = this.state;
    return (
      <View style={styles.filterContainer}>
        <PortfolioFilter filterData={filters} getStatus={this.getStatus} />
        {this.renderPortfolio(properties)}
      </View>
    );
  };

  private renderPortfolio = (properties: Asset[] | null): React.ReactElement => {
    const { t, currentFilter } = this.props;
    const { assetType } = this.state;
    const title = currentFilter === Filters.ALL ? t('noPropertiesAdded') : t('noFilterProperties');
    const data = assetType ? (properties ?? []).filter((item) => item.assetGroup.name === assetType) : properties;
    const isEmpty = !data || data.length <= 0;
    return (
      <View style={styles.container}>
        <View style={styles.headingView}>
          <Text type="small" textType="semiBold" style={styles.title}>
            {t('propertyPortfolio')}
          </Text>
          <Icon
            name={icons.verticalDots}
            color={theme.colors.darkTint4}
            size={18}
            onPress={FunctionUtils.noop}
            testID="menu"
          />
        </View>
        {isEmpty ? (
          <EmptyState title={title} icon={icons.home} containerStyle={styles.emptyView} />
        ) : (
          data?.map((property, index) => this.renderList(property, index, DataType.PROPERTIES))
        )}
      </View>
    );
  };

  private renderList = (item: Asset, index: number, type: DataType): React.ReactElement => {
    const { isTablet } = this.props;
    return (
      <AssetCard
        assetData={item}
        key={index}
        isFromTenancies={type === DataType.TENANCIES}
        onViewProperty={FunctionUtils.noop}
        onPressArrow={FunctionUtils.noop}
        onCompleteDetails={FunctionUtils.noop}
        onOfferVisitPress={FunctionUtils.noop}
        onHandleAction={FunctionUtils.noop}
        containerStyle={isTablet && styles.assetCardContainer}
      />
    );
  };

  private getStatus = (filter: string): void => {
    const { getPropertyDetails } = this.props;
    getPropertyDetails({ status: filter });
  };

  private getScreenData = (): void => {
    this.getPortfolioProperty();
  };

  private getPortfolioProperty = (isFromFilter?: boolean): void => {
    const { getPropertyDetails, currentFilter } = this.props;
    getPropertyDetails({ status: currentFilter });
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    properties: PortfolioSelectors.getProperties(state),
    currentFilter: PortfolioSelectors.getCurrentFilter(state),
    isTenanciesLoading: PortfolioSelectors.getTenanciesLoadingState(state),
  };
};
const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getPropertyDetails, setCurrentAsset } = PortfolioActions;
  const { setAssetId, setEditPropertyFlow } = RecordAssetActions;
  const { clearMessages } = CommonActions;
  return bindActionCreators(
    {
      getPropertyDetails,
      setCurrentAsset,
      setAssetId,
      setEditPropertyFlow,
      clearMessages,
    },
    dispatch
  );
};
const translatedPortfolio = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.assetPortfolio)(Portfolio));

export default withMediaQuery<any>(translatedPortfolio);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    maxWidth: '100%',
  },
  assetCardContainer: {
    flexDirection: 'column',
    maxWidth: '100%',
  },
  title: {
    color: theme.colors.darkTint1,
    marginBottom: 16,
    marginTop: 4,
  },
  headingView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyView: {
    minHeight: 200,
  },
  filterContainer: {
    flexDirection: 'column',
    width: '100%',
  },
});
