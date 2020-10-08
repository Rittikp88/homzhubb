import React from 'react';
import { FlatList, Image, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { LinkingService } from '@homzhub/mobile/src/services/LinkingService';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { images } from '@homzhub/common/src/assets/images';
import { Text, Label } from '@homzhub/common/src/components';
import { MarketTrends, MarketTrendsResults } from '@homzhub/common/src/domain/models/MarketTrends';

interface IProps extends WithTranslation {
  containerStyle?: StyleProp<ViewStyle>;
  isHeaderVisible?: boolean;
  onViewAll?: () => void;
  limit?: number;
}

interface IMarketTrendsState {
  data: MarketTrends;
}

export class AssetMarketTrends extends React.PureComponent<IProps, IMarketTrendsState> {
  public state = {
    data: {} as MarketTrends,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getMarketTrends();
  };

  public render(): React.ReactNode {
    const { containerStyle, onViewAll, t, isHeaderVisible = true } = this.props;
    const { data } = this.state;
    return (
      <View style={[styles.container, containerStyle]}>
        {isHeaderVisible && (
          <View style={styles.header}>
            <View style={styles.marketTrends}>
              <Icon name={icons.increase} color={theme.colors.darkTint4} size={20} />
              <Text type="regular" textType="semiBold" style={styles.headerText}>
                {t('marketTrends')}
              </Text>
            </View>
            {data.results?.length > 0 && (
              <Text type="small" textType="semiBold" onPress={onViewAll} style={styles.viewAll}>
                {t('viewAll')}
              </Text>
            )}
          </View>
        )}
        {this.renderTrends()}
      </View>
    );
  }

  public renderTrends = (): React.ReactElement => {
    const { data } = this.state;
    const { t } = this.props;
    if (data.results?.length === 0) {
      return (
        <View style={styles.noData}>
          <Text type="small" textType="regular">
            {t('noTrends')}
          </Text>
        </View>
      );
    }
    return (
      <FlatList
        data={data.results ?? []}
        renderItem={({ item }: { item: MarketTrendsResults }): React.ReactElement => {
          const { title, postedAtDate, link, attachment } = item;
          const onLinkPress = async (): Promise<void> => {
            await LinkingService.canOpenURL(link);
          };

          return (
            <TouchableOpacity onPress={onLinkPress} style={styles.trendContainer} testID="linkTouch">
              {attachment?.link && <Image source={{ uri: attachment?.link }} style={styles.image} />}
              {!attachment && <Image source={images.landingScreenLogo} style={styles.image} />}
              <View style={styles.trendValuesContainer}>
                <Text type="small" textType="regular" style={styles.trendHeader}>
                  {title}
                </Text>
                <View style={styles.trendData}>
                  <Label type="large" textType="regular" style={styles.trendDate}>
                    {postedAtDate}
                  </Label>
                  <Icon name={icons.dart} color={theme.colors.primaryColor} size={20} />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        testID="trendsList"
        keyExtractor={this.renderKeyExtractor}
      />
    );
  };

  private renderKeyExtractor = (item: MarketTrendsResults, index: number): string => {
    return `${item.id}-${index}`;
  };

  public getMarketTrends = async (): Promise<void> => {
    const { limit = 2 } = this.props;
    const response: MarketTrends = await DashboardRepository.getMarketTrends(limit);
    this.setState({ data: response });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetDashboard)(AssetMarketTrends);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    paddingVertical: 10,
  },
  marketTrends: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  headerText: {
    marginLeft: 8,
  },
  trendContainer: {
    padding: 10,
    margin: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.darkTint10,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewAll: {
    flex: 0,
    borderWidth: 0,
    color: theme.colors.primaryColor,
    marginRight: 15,
  },
  noData: {
    flex: 1,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
  trendHeader: {
    color: theme.colors.darkTint3,
    flexWrap: 'wrap',
  },
  trendValuesContainer: {
    marginStart: 10,
    flex: 1,
  },
  trendDate: {
    color: theme.colors.darkTint4,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 4,
  },
});
