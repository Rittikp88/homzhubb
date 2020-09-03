import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { TopTabNavigatorParamList } from '@homzhub/mobile/src/navigation/TopTabs';
import { Avatar, Button, Divider } from '@homzhub/common/src/components';
import { EmptyState, LeaseProgress, Loader, SearchBar } from '@homzhub/mobile/src/components';
import { TenantHistoryData } from '@homzhub/common/src/mocks/AssetData';

interface IState {
  tenantHistory: any[];
  searchValue: string;
  isLoading: boolean;
}

type libraryProps = NavigationScreenProps<TopTabNavigatorParamList, ScreensKeys.TenantHistoryTab>;
type Props = WithTranslation & libraryProps;

export class TenantHistory extends Component<Props, IState> {
  public state = {
    tenantHistory: TenantHistoryData,
    searchValue: '',
    isLoading: false,
  };

  private search = debounce(() => {
    const { searchValue, tenantHistory } = this.state;
    const results: any[] = [];
    tenantHistory.forEach((item) => {
      const { tenant_user } = item;
      if (tenant_user.full_name.includes(searchValue)) {
        results.push(item);
      }
    });
    this.setState({ tenantHistory: results, isLoading: false });
  }, 1000);

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
        {tenantHistory.length > 0 ? (
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

  private renderItem = ({ item }: { item: any }): React.ReactElement => {
    const { t } = this.props;
    const {
      tenant_user: { full_name },
    } = item;
    return (
      <View style={styles.content}>
        <Avatar fullName={full_name} designation="Tenant" containerStyle={styles.avatar} />
        <LeaseProgress
          progress={0.5}
          width={theme.viewport.width > 400 ? 320 : 280}
          fromDate="02/01/2020"
          toDate="02/01/2020"
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
    this.setState({ searchValue: value }, () => {
      if (value.length >= 3) {
        this.setState({ isLoading: true });
        this.search();
      }

      if (value.length === 0) {
        this.setState({
          tenantHistory: TenantHistoryData,
        });
      }
    });
  };
}
export default withTranslation()(TenantHistory);
const styles = StyleSheet.create({
  container: {
    padding: 16,
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
