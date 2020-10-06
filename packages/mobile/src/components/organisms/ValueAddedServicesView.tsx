import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { images } from '@homzhub/common/src/assets/images';
import { Button } from '@homzhub/common/src/components';
import { CardWithCheckbox } from '@homzhub/mobile/src/components/molecules/CardWithCheckbox';
import { SearchBar } from '@homzhub/mobile/src/components';
import { Services } from '@homzhub/common/src/mocks/ValueAddedServices';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';
import { IUpdateAssetParams } from '@homzhub/common/src/domain/repositories/interfaces';

interface IValueServices {
  name: string;
  price: number;
  image: string;
  selected: boolean;
}

interface IOwnProps extends WithTranslation {
  data?: IValueServices[];
  handleNextStep: () => void;
  propertyId: number;
  typeOfPlan: TypeOfPlan;
  containerStyle?: StyleProp<ViewStyle>;
  lastVisitedStep: ILastVisitedStep;
}

interface IOwnState {
  searchString: string;
}

// TODO(28/09/2020): Replace mock-data once API finalize

class ValueAddedServicesView extends React.PureComponent<IOwnProps, IOwnState> {
  public state = {
    searchString: '',
  };

  public render = (): React.ReactElement => {
    const { containerStyle, t } = this.props;
    const { searchString } = this.state;

    return (
      <View style={[styles.container, containerStyle]}>
        <SearchBar
          placeholder={t('assetDashboard:searchByKeyword')}
          value={searchString}
          updateValue={this.updateSearchString}
          containerStyle={styles.searchStyle}
        />

        {Services.map((item) => {
          return (
            <CardWithCheckbox
              containerStyle={styles.cardContainer}
              key={item.id}
              heading={item.name}
              image={images.landingScreenLogo}
              price={item.isPrice}
              selected
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
