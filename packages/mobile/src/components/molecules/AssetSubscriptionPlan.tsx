import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { ObjectUtils } from '@homzhub/common/src/utils/ObjectUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import Plan from '@homzhub/common/src/assets/images/plan.svg';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { UserSubscription } from '@homzhub/common/src/domain/models/UserSubscription';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IAssetSubscriptionPlanState {
  data: UserSubscription;
  isMoreToggled: boolean;
}

export class AssetSubscriptionPlan extends React.PureComponent<WithTranslation, IAssetSubscriptionPlanState> {
  public state = {
    data: {} as UserSubscription,
    isMoreToggled: false,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getUserSubscription();
  };

  public render(): React.ReactNode {
    const { t } = this.props;
    const { data, isMoreToggled } = this.state;

    if (ObjectUtils.isEmpty(data)) {
      return null;
    }

    const currentPlan = `${t('common:homzhub')} ${data.userServicePlan?.label}`;
    const recommendedPlan = `${t('common:homzhub')} ${data.recommendedPlan?.label}`;

    return (
      <View style={styles.container}>
        <View style={styles.currentSubscription}>
          <View>
            <Text type="small" textType="regular" style={styles.planName}>
              {t('subscribedFor')}
            </Text>
            <Text type="regular" textType="bold" style={styles.planName}>
              {currentPlan}
            </Text>
          </View>
          <Plan />
        </View>
        <Divider />
        <Text type="small" textType="semiBold" style={styles.subscriptionHelper}>
          {`${t('subscriptionHelper')} `}
          <Text type="small" textType="bold" style={styles.planName}>
            {recommendedPlan}
          </Text>
          {` ${t('subscriptionHelperServices')}`}
        </Text>
        {this.renderFeatures()}
        {data?.recommendedPlan?.serviceBundleItems.length > 5 && (
          <Text type="small" textType="semiBold" style={styles.more} onPress={this.toggleMore}>
            {isMoreToggled ? t('common:less') : t('common:more')}
          </Text>
        )}
        <Button title={t('upgrade')} type="secondary" onPress={this.onUpgrade} testID="btnUpgrade" />
      </View>
    );
  }

  public renderFeatures = (): React.ReactNode => {
    const {
      data: {
        recommendedPlan: { serviceBundleItems },
      },
      isMoreToggled,
    } = this.state;
    const bundleItems = isMoreToggled ? serviceBundleItems : serviceBundleItems.slice(0, 5);

    return bundleItems.map((item) => (
      <View style={styles.featuresData} key={`${item.id}`}>
        <Icon name={icons.checkFilled} color={theme.colors.green} size={25} />
        <Text type="small" textType="regular" style={styles.featureName}>
          {item.label}
        </Text>
      </View>
    ));
  };

  public onUpgrade = (): void => {};

  public getUserSubscription = async (): Promise<void> => {
    try {
      const response: UserSubscription = await UserRepository.getUserSubscription();
      this.setState({ data: response });
    } catch (err) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
    }
  };

  public toggleMore = (): void => {
    const { isMoreToggled } = this.state;
    this.setState({ isMoreToggled: !isMoreToggled });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetDashboard)(AssetSubscriptionPlan);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 16,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
  },
  currentSubscription: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  featuresData: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  planName: {
    color: theme.colors.darkTint3,
  },
  featureName: {
    marginStart: 16,
  },
  subscriptionHelper: {
    marginVertical: 16,
    color: theme.colors.darkTint3,
  },
  more: {
    color: theme.colors.primaryColor,
    alignSelf: 'flex-end',
  },
});
