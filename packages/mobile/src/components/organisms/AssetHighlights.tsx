import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { RecordAssetRepository } from '@homzhub/common/src/domain/repositories/RecordAssetRepository';
import { Button, WithShadowView } from '@homzhub/common/src/components';
import AssetHighlightCard from '@homzhub/mobile/src/components/molecules/AssetHighlightCard';
import { Amenity } from '@homzhub/common/src/domain/models/Amenity';

interface IState {
  amenities: Amenity[];
  sports: Amenity[];
}

interface IHighlightProps {
  handleNextStep: () => void;
}

export class AssetHighlights extends PureComponent<IHighlightProps, IState> {
  public state = {
    amenities: [],
    sports: [],
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getAmenities();
  };

  public render(): React.ReactNode {
    const { amenities, sports } = this.state;
    const { handleNextStep } = this.props;
    return (
      <>
        <View style={styles.container}>
          <AssetHighlightCard title="Amenities" data={amenities} />
          <AssetHighlightCard title="Sports" data={sports} />
        </View>
        <WithShadowView outerViewStyle={styles.shadowView}>
          <Button type="primary" title="Continue" containerStyle={styles.buttonStyle} onPress={handleNextStep} />
        </WithShadowView>
      </>
    );
  }

  private getAmenities = async (): Promise<void> => {
    try {
      const response = await RecordAssetRepository.getAmenities();
      response.forEach((data) => {
        if (data.name === 'Sports') {
          this.setState({ sports: data.amenities });
        } else {
          this.setState({ amenities: data.amenities });
        }
      });
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e);
      AlertHelper.error({ message: error });
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
  },
  shadowView: {
    paddingTop: 10,
    marginBottom: PlatformUtils.isIOS() ? 20 : 0,
    paddingBottom: 0,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
});
