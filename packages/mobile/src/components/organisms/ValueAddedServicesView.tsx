import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { images } from '@homzhub/common/src/assets/images';
import { Button, Text } from '@homzhub/common/src/components';
import { CardWithCheckbox } from '@homzhub/mobile/src/components/molecules/CardWithCheckbox';
import { SearchBar } from '@homzhub/mobile/src/components';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';
import { IUpdateAssetParams } from '@homzhub/common/src/domain/repositories/interfaces';
import { ISelectedValueServices, ValueAddedService } from '@homzhub/common/src/domain/models/ValueAddedService';
import { RecordAssetRepository } from '@homzhub/common/src/domain/repositories/RecordAssetRepository';

interface IOwnProps extends WithTranslation {
  handleNextStep: () => void;
  propertyId: number;
  assetGroupId: number;
  countryId: number;
  typeOfPlan: TypeOfPlan;
  setValueAddedServices: (payload: ISelectedValueServices) => void;
  containerStyle?: StyleProp<ViewStyle>;
  lastVisitedStep: ILastVisitedStep;
}

interface IOwnState {
  valueServices: ValueAddedService[];
  searchString: string;
}

class ValueAddedServicesView extends React.PureComponent<IOwnProps, IOwnState> {
  public state = {
    valueServices: [],
    searchString: '',
  };

  public async componentDidMount(): Promise<void> {
    const { assetGroupId, countryId } = this.props;
    const response = await RecordAssetRepository.getValueAddedServices(assetGroupId, countryId);

    this.setState({
      valueServices: response,
      searchString: '',
    });
  }

  public render = (): React.ReactNode => {
    const { setValueAddedServices, containerStyle, t } = this.props;
    const { valueServices, searchString } = this.state;

    if (valueServices && valueServices.length <= 0) {
      return (
        <Text style={styles.noResults} type="regular">
          {t('common:noServicesFound')}
        </Text>
      );
    }

    return (
      <View style={[styles.container, containerStyle]}>
        <SearchBar
          placeholder={t('assetDashboard:searchByKeyword')}
          value={searchString}
          updateValue={this.updateSearchString}
          containerStyle={styles.searchStyle}
        />

        {this.dynamicSearch().map((item: ValueAddedService) => {
          const {
            id,
            valueBundle: { valueBundleItems, label },
            bundlePrice,
            discountedPrice,
          } = item;

          const handleToggle = (value: boolean): void => {
            setValueAddedServices({ id, price: bundlePrice, name: label, value });
          };

          return (
            <CardWithCheckbox
              containerStyle={styles.cardContainer}
              key={id}
              heading={label}
              image={images.landingScreenLogo}
              price={bundlePrice}
              discountedPrice={discountedPrice > 0 ? discountedPrice : undefined}
              bundleItems={valueBundleItems}
              onToggle={handleToggle}
            />
          );
        })}

        <Button
          type="primary"
          title={t('common:continue')}
          containerStyle={styles.buttonStyle}
          onPress={this.handleContinue}
        />
      </View>
    );
  };

  private dynamicSearch = (): ValueAddedService[] => {
    const { valueServices, searchString } = this.state;

    return valueServices.filter((item: ValueAddedService) => {
      return item.valueBundle.label.toLowerCase().includes(searchString.toLowerCase());
    });
  };

  private updateSearchString = (text: string): void => {
    this.setState({ searchString: text });
  };

  private handleContinue = async (): Promise<void> => {
    const { handleNextStep, lastVisitedStep, typeOfPlan, propertyId } = this.props;
    handleNextStep();

    const updateAssetPayload: IUpdateAssetParams = {
      last_visited_step: {
        ...lastVisitedStep,
        listing: {
          ...lastVisitedStep.listing,
          type: typeOfPlan,
          is_services_done: true,
        },
      },
    };

    try {
      await AssetRepository.updateAsset(propertyId, updateAssetPayload);
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };
}

const valueAddedServicesView = withTranslation()(ValueAddedServicesView);
export { valueAddedServicesView as ValueAddedServicesView };

const styles = StyleSheet.create({
  container: {
    padding: theme.layout.screenPadding,
    backgroundColor: theme.colors.white,
  },
  noResults: {
    textAlign: 'center',
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
  searchStyle: {
    marginBottom: 24,
  },
  cardContainer: {
    marginBottom: 16,
  },
});
