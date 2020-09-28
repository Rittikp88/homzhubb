import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { images } from '@homzhub/common/src/assets/images';
import { Button } from '@homzhub/common/src/components';
import { CardWithCheckbox } from '@homzhub/mobile/src/components/molecules/CardWithCheckbox';
import { Services } from '@homzhub/common/src/mocks/ValueAddedServices';

interface IValueServices {
  name: string;
  price: number;
  image: string;
  selected: boolean;
}

interface IOwnProps extends WithTranslation {
  data?: IValueServices[];
  handleNextStep: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

// TODO(28/09/2020): Replace mock-data once API finalize

class ValueAddedServicesView extends React.PureComponent<IOwnProps, {}> {
  public render = (): React.ReactElement => {
    const { handleNextStep, containerStyle, t } = this.props;

    return (
      <View style={[styles.container, containerStyle]}>
        {Services.map((item) => {
          return (
            <CardWithCheckbox
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
          onPress={handleNextStep}
        />
      </View>
    );
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
});
