import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { LinkingService } from '@homzhub/mobile/src/services/LinkingService';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { Text, Label } from '@homzhub/common/src/components/atoms/Text';
import { MarketTrends } from '@homzhub/common/src/domain/models/MarketTrends';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps extends WithTranslation {
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
    const { onViewAll, t, isHeaderVisible = true } = this.props;
    const { data } = this.state;
    return (
      <View style={styles.container}>
        {isHeaderVisible && (
          <View style={styles.header}>
            <Icon name={icons.increase} color={theme.colors.darkTint4} size={20} />
            <Text type="regular" textType="semiBold" style={styles.headerText}>
              {t('marketTrends')}
            </Text>
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

  public renderTrends = (): React.ReactNode => {
    const {
      data: { results },
    } = this.state;
    const { t } = this.props;

    if (results?.length === 0) {
      return (
        <View style={styles.noData}>
          <Text type="small" textType="regular">
            {t('noTrends')}
          </Text>
        </View>
      );
    }

    return (results || []).map((item) => {
      const { title, postedAtDate, link, attachment } = item;
      const onLinkPress = async (): Promise<void> => {
        await LinkingService.canOpenURL(link);
      };

      return (
        <TouchableOpacity key={`${item.id}`} onPress={onLinkPress} style={styles.trendContainer} testID="linkTouch">
          {attachment && !!attachment.link ? (
            <Image source={{ uri: attachment?.link }} style={styles.image} />
          ) : (
            <ImagePlaceholder height={80} width={80} containerStyle={styles.placeHolderImage} />
          )}
          <View style={styles.trendValuesContainer}>
            <Text type="small" textType="regular" style={styles.trendHeader} numberOfLines={2}>
              {title}
            </Text>
            <View style={styles.trendData}>
              <Label type="large" textType="regular" style={styles.trendDate}>
                {postedAtDate}
              </Label>
              <Icon name={icons.dart} color={theme.colors.primaryColor} size={18} />
            </View>
          </View>
        </TouchableOpacity>
      );
    });
  };

  public getMarketTrends = async (): Promise<void> => {
    const { limit = 2 } = this.props;
    try {
      const response: MarketTrends = await DashboardRepository.getMarketTrends(limit);
      this.setState({ data: response });
    } catch (err) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
    }
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetDashboard)(AssetMarketTrends);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 26,
    paddingBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerText: {
    marginStart: 12,
    flex: 1,
  },
  trendContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.background,
  },
  viewAll: {
    color: theme.colors.primaryColor,
  },
  trendDate: {
    color: theme.colors.darkTint5,
  },
  trendValuesContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginStart: 12,
  },
  trendData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendHeader: {
    color: theme.colors.darkTint2,
    flexWrap: 'wrap',
  },
  noData: {
    flex: 1,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  placeHolderImage: {
    borderColor: theme.colors.darkTint10,
    borderWidth: 1,
    borderRadius: 4,
  },
});
