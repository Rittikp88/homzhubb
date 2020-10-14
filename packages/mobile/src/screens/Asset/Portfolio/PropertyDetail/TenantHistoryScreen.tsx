import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { IGetHistoryPayload } from '@homzhub/common/src/modules/portfolio/interfaces';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import { Avatar, Button, Divider, EmptyState } from '@homzhub/common/src/components';
import { LeaseProgress, Loader, SearchBar } from '@homzhub/mobile/src/components';
import { TenantHistory } from '@homzhub/common/src/domain/models/Tenant';

interface IStateProps {
  assetId: number;
  tenantHistory: TenantHistory[] | null;
}

interface IDispatchProps {
  getTenantHistory: (payload: IGetHistoryPayload) => void;
}

interface IScreenState {
  tenantHistory: TenantHistory[];
  searchValue: string;
  isLoading: boolean;
}

type Props = WithTranslation & IStateProps & IDispatchProps;

export class TenantHistoryScreen extends Component<Props, IScreenState> {
  private search = debounce(() => {
    const { searchValue, tenantHistory } = this.state;
    const results: TenantHistory[] = [];
    tenantHistory.forEach((item: TenantHistory) => {
      const { tenantUser } = item;
      if (tenantUser && tenantUser.fullName.toLowerCase().includes(searchValue.toLowerCase())) {
        results.push(item);
      }
    });
    this.setState({ tenantHistory: results, isLoading: false });
  }, 1000);

  public state = {
    tenantHistory: [],
    searchValue: '',
    isLoading: false,
  };

  public componentDidMount = (): void => {
    this.getTenantHistoryData();
  };

  public render(): React.ReactNode {
    const { t } = this.props;
    const { tenantHistory, searchValue, isLoading } = this.state;
    return (
      <View style={styles.container}>
        <SearchBar
          placeholder={t('assetPortfolio:searchByName')}
          value={searchValue}
          updateValue={this.onSearch}
          containerStyle={styles.searchBar}
        />
        {tenantHistory && tenantHistory.length > 0 ? (
          <FlatList
            data={tenantHistory}
            renderItem={this.renderItem}
            ItemSeparatorComponent={this.renderSeparatorComponent}
            keyExtractor={this.renderKeyExtractor}
          />
        ) : (
          <EmptyState />
        )}
        <Loader visible={isLoading} />
      </View>
    );
  }

  private renderItem = ({ item }: { item: TenantHistory }): React.ReactElement => {
    const { t } = this.props;
    const { tenantUser, leaseTransaction } = item;
    return (
      <View style={styles.content}>
        <Avatar fullName={tenantUser?.fullName ?? ''} designation="Tenant" containerStyle={styles.avatar} />
        <LeaseProgress
          progress={leaseTransaction?.totalSpendPeriod}
          width={theme.viewport.width > 400 ? 320 : 280}
          fromDate={leaseTransaction?.leaseStartDate ?? ''}
          toDate={leaseTransaction?.leaseEndDate ?? ''}
          iconColor={theme.colors.darkTint5}
          containerStyle={styles.progressContainer}
          labelStyle={styles.progressLabel}
        />
        <Button
          type="secondary"
          title={t('assetPortfolio:rentalReceipts')}
          textType="label"
          textSize="large"
          icon={icons.docFilled}
          iconSize={18}
          iconColor={theme.colors.blue}
          containerStyle={styles.buttonStyle}
          titleStyle={styles.buttonTitle}
        />
      </View>
    );
  };

  private renderSeparatorComponent = (): React.ReactElement => {
    return <Divider containerStyles={styles.divider} />;
  };

  private renderKeyExtractor = (item: any, index: number): string => {
    return `${item.name}-${index}`;
  };

  private onSearch = (value: string): void => {
    const { tenantHistory } = this.props;
    this.setState({ searchValue: value }, () => {
      if (value.length >= 3) {
        this.setState({ isLoading: true });
        this.search();
      }

      if (value.length === 0 && tenantHistory) {
        this.setState({
          tenantHistory,
        });
      }
    });
  };

  private onHistoryCallback = (): void => {
    const { tenantHistory } = this.props;
    if (tenantHistory) {
      this.setState({ tenantHistory, isLoading: false });
    }
  };

  private getTenantHistoryData = (): void => {
    const { assetId, getTenantHistory } = this.props;
    this.setState({ isLoading: true });
    getTenantHistory({ id: assetId, onCallback: this.onHistoryCallback });
  };
}
const mapStateToProps = (state: IState): IStateProps => {
  return {
    assetId: PortfolioSelectors.getCurrentAssetId(state),
    tenantHistory: PortfolioSelectors.getTenantHistory(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getTenantHistory } = PortfolioActions;
  return bindActionCreators({ getTenantHistory }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(TenantHistoryScreen));

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
  },
  searchBar: {
    marginBottom: 6,
  },
  content: {
    marginTop: 20,
  },
  divider: {
    marginTop: 12,
    borderColor: theme.colors.darkTint10,
  },
  avatar: {
    marginBottom: 24,
  },
  progressContainer: {
    marginLeft: 10,
  },
  progressLabel: {
    color: theme.colors.darkTint4,
  },
  buttonStyle: {
    borderWidth: 0,
    flexDirection: 'row-reverse',
    flex: 0,
    alignSelf: 'flex-start',
    marginRight: 10,
  },
  buttonTitle: {
    marginHorizontal: 6,
  },
});
