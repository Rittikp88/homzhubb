import React from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { AssetMetricsList } from '@homzhub/mobile/src/components';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import TextWithIcon from '@homzhub/common/src/components/atoms/TextWithIcon';
import PropertyOffers, { OfferType } from '@homzhub/common/src/components/molecules/PropertyOffers';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { propertyOffer } from '@homzhub/common/src/mocks/PropertyOffer';

interface IScreenState {
  offerType: OfferType;
  isOfferInfoRead: boolean;
}

type Props = WithTranslation & NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.PropertyOfferList>;

const metricData = [
  { name: 'Offer Received', count: 4, colorCode: '#FF8576' },
  { name: 'Offer Made', count: 4, colorCode: '#47C2B1' },
];

export interface IMetricsData {
  name: string;
  count: string | number;
  label?: string;
  id?: number;
  isCurrency?: boolean;
  colorCode: string;
}

class PropertyOfferList extends React.PureComponent<Props, IScreenState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      offerType: 'Offer Received',
      isOfferInfoRead: false,
    };
  }

  public async componentDidMount(): Promise<void> {
    const isOfferInfoRead: boolean = (await StorageService.get(StorageKeys.IS_OFFER_INFO_READ)) || false;
    this.setState({ isOfferInfoRead });
  }

  public render(): React.ReactElement {
    const { t } = this.props;
    const { offerType, isOfferInfoRead } = this.state;

    const data = ObjectMapper.deserializeArray(Asset, propertyOffer);
    return (
      <>
        <UserScreen title={t('assetDashboard:dashboard')} scrollEnabled backgroundColor={theme.colors.transparent}>
          <AssetMetricsList
            data={metricData}
            onMetricsClicked={this.onMetricsClicked}
            selectedAssetType={offerType}
            numOfElements={2}
            subTitleText={t('assetPortfolio:totalOffers')}
            isSubTextRequired
            headerIcon={icons.offers}
            containerStyle={[styles.metricList, styles.borderRadius]}
          />
          {!isOfferInfoRead && (
            <TextWithIcon
              text={t('offers:offerInfo')}
              containerStyle={[styles.offerInfo, styles.borderRadius]}
              icon={icons.close}
              iconSize={15}
              prefixIcon={icons.circularFilledInfo}
              iconColor={theme.colors.darkTint4}
              prefixIconColor={theme.colors.darkTint3}
              variant="label"
              subContainerStyle={styles.textIconSubContainer}
              onIcon={this.onCloseOfferInfo}
            />
          )}
          {data.map((property: Asset, index: number) => {
            return this.renderPropertyOffer(property, index);
          })}
        </UserScreen>
      </>
    );
  }

  public renderPropertyOffer = (item: Asset, index: number): React.ReactElement => {
    const separatorStyle = index !== 0 ? styles.separator : {};
    const isCardExpanded = index === 0;
    const { offerType } = this.state;

    return (
      <PropertyOffers
        isCardExpanded={isCardExpanded}
        propertyOffer={item}
        containerStyles={separatorStyle}
        offerType={offerType}
      />
    );
  };

  private onCloseOfferInfo = (): void => {
    this.setState({ isOfferInfoRead: true });
    StorageService.set(StorageKeys.IS_OFFER_INFO_READ, true);
  };

  private onMetricsClicked = (name: string): void => {
    this.setState({ offerType: name as OfferType });
  };
}

export default withTranslation()(PropertyOfferList);

const styles = StyleSheet.create({
  separator: {
    marginTop: 16,
  },
  offerInfo: {
    flex: 1,
    backgroundColor: theme.colors.white,
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  borderRadius: {
    borderRadius: 4,
  },
  metricList: {
    marginBottom: 12,
  },
  textIconSubContainer: {
    flex: 1,
  },
});
