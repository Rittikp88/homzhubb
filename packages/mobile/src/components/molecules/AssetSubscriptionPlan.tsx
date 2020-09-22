import React from 'react';
import { StyleSheet, View, FlatList, StyleProp, ViewStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { images } from '@homzhub/common/src/assets/images';
import { Text, Divider, Image, Button } from '@homzhub/common/src/components';
import { UserSubscription } from '@homzhub/common/src/domain/models/UserSubscription';
import { ServiceBundleItems } from '@homzhub/common/src/domain/models/ServiceBundleItems';

interface IProps {
  containerStyle?: StyleProp<ViewStyle>;
}

interface IAssetSubscriptionPlanState {
  data: UserSubscription;
  isMoreToggled: boolean;
}

type Props = IProps & WithTranslation;

export class AssetSubscriptionPlan extends React.PureComponent<Props, IAssetSubscriptionPlanState> {
  public state = {
    data: {} as UserSubscription,
    isMoreToggled: false,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getUserSubscription();
  };

  public render(): React.ReactNode {
    const { containerStyle, t } = this.props;
    const { data, isMoreToggled } = this.state;
    if (isEmpty(data)) {
      return null;
    }
    const currentPlan = `${t('common:homzhub')} ${data?.userServicePlan?.label}`;
    const recommendedPlan = `${t('common:homzhub')} ${data?.recommendedPlan?.label}`;
    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.currentSubscription}>
          <View style={styles.flexThree}>
            <Text type="small" textType="regular" style={styles.planName}>
              {t('subscribedFor')}
            </Text>
            <View style={styles.planNameRow}>
              <Text type="regular" textType="bold" style={styles.planName}>
                {currentPlan}
              </Text>
            </View>
          </View>
          <View style={styles.flexOne}>
            <Image source={images.homzhubPlan} />
          </View>
        </View>
        <Divider />
        <Text type="small" textType="semiBold" style={styles.subscriptionHelper}>
          {`${t('subscriptionHelper')}`}
          <Text type="small" textType="bold" style={styles.planName}>
            {' '}
            {recommendedPlan}{' '}
          </Text>
          {`${t('subscriptionHelperServices')}`}
        </Text>
        {this.renderFeatures()}
        {data?.recommendedPlan?.serviceBundleItems.length > 5 && (
          <Text type="small" textType="semiBold" style={styles.more} onPress={this.toggleMore}>
            {isMoreToggled ? t('common:less') : t('common:more')}
          </Text>
        )}
        <Button
          title={t('upgrade')}
          type="secondary"
          containerStyle={styles.upgrade}
          onPress={this.onUpgrade}
          testID="btnUpgrade"
        />
      </View>
    );
  }

  private renderKeyExtractor = (item: ServiceBundleItems, index: number): string => {
    return `${item.id}-${index}`;
  };

  public renderFeatures = (): React.ReactElement => {
    const { data, isMoreToggled } = this.state;
    const bundleItems = isMoreToggled
      ? data?.recommendedPlan?.serviceBundleItems
      : data?.recommendedPlan?.serviceBundleItems.slice(0, 5);
    return (
      <FlatList
        data={bundleItems ?? []}
        numColumns={1}
        renderItem={({ item }: { item: ServiceBundleItems }): React.ReactElement => {
          const { title } = item;
          return (
            <View style={styles.featuresData}>
              <Icon name={icons.checkFilled} color={theme.colors.green} size={25} />
              <Text type="small" textType="regular" style={styles.featureName}>
                {title}
              </Text>
            </View>
          );
        }}
        testID="subscriptionList"
        keyExtractor={this.renderKeyExtractor}
      />
    );
  };

  public onUpgrade = (): void => {};

  public getUserSubscription = async (): Promise<void> => {
    const response: UserSubscription = await UserRepository.getUserSubscription();
    this.setState({ data: response });
  };

  public toggleMore = (): void => {
    const { isMoreToggled } = this.state;
    this.setState({ isMoreToggled: !isMoreToggled });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetDashboard)(AssetSubscriptionPlan);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: 10,
    borderRadius: 4,
  },
  currentSubscription: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  featuresData: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 10,
  },
  flexThree: {
    flex: 3,
  },
  flexOne: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planName: {
    color: theme.colors.darkTint3,
    marginVertical: 2,
  },
  featureName: {
    marginLeft: 15,
    flex: 1,
  },
  planNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  upgrade: {
    flex: 0,
    marginVertical: 20,
  },
  subscriptionHelper: {
    marginVertical: 10,
    color: theme.colors.darkTint3,
  },
  more: {
    color: theme.colors.primaryColor,
    alignSelf: 'flex-end',
  },
});
