import React, { ReactElement } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button, Text } from '@homzhub/common/src/components';
import CardWithCheckbox from '@homzhub/mobile/src/components/molecules/CardWithCheckbox';
import { SearchBar } from '@homzhub/mobile/src/components';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';
import { IUpdateAssetParams } from '@homzhub/common/src/domain/repositories/interfaces';
import { ISelectedValueServices, ValueAddedService } from '@homzhub/common/src/domain/models/ValueAddedService';

interface IOwnProps extends WithTranslation {
  valueAddedServices: ValueAddedService[];
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
  searchString: string;
}

class ValueAddedServicesView extends React.PureComponent<IOwnProps, IOwnState> {
  public state = {
    searchString: '',
  };

  public render = (): ReactElement => {
    const { setValueAddedServices, valueAddedServices, containerStyle, t } = this.props;
    const { searchString } = this.state;

    if (valueAddedServices && valueAddedServices.length <= 0) {
      return (
        <Text style={styles.noResults} type="regular">
          {t('common:noServicesFound')}
        </Text>
      );
    }

    return (
      <>
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
              valueBundle: {
                valueBundleItems,
                label,
                attachment: { link },
              },
              bundlePrice,
              discountedPrice,
            } = item;

            const handleToggle = (value: boolean): void => {
              setValueAddedServices({ id, value });
            };

            return (
              <CardWithCheckbox
                key={id}
                heading={label}
                selected={item.value}
                image={link}
                price={bundlePrice}
                discountedPrice={discountedPrice}
                bundleItems={valueBundleItems}
                currency={item.currency}
                containerStyle={styles.cardContainer}
                onToggle={handleToggle}
              />
            );
          })}
        </View>
        <Button
          disabled={valueAddedServices.filter((service) => service.value).length === 0}
          type="primary"
          title={t('common:continue')}
          containerStyle={styles.buttonStyle}
          onPress={this.handleContinue}
        />
      </>
    );
  };

  private dynamicSearch = (): ValueAddedService[] => {
    const { valueAddedServices } = this.props;
    const { searchString } = this.state;

    return valueAddedServices.filter((item: ValueAddedService) => {
      return item.valueBundle.label.toLowerCase().includes(searchString.toLowerCase());
    });
  };

  private updateSearchString = (text: string): void => {
    this.setState({ searchString: text });
  };

  private handleContinue = async (): Promise<void> => {
    const { handleNextStep, lastVisitedStep, typeOfPlan, propertyId } = this.props;

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
      handleNextStep();
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
    marginVertical: 20,
  },
  searchStyle: {
    marginBottom: 24,
  },
  cardContainer: {
    marginBottom: 16,
  },
});
