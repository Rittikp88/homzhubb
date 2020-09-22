import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { images } from '@homzhub/common/src/assets/images';
import { Button } from '@homzhub/common/src/components';
import { CardWithCheckbox } from '@homzhub/mobile/src/components/molecules/CardWithCheckbox';

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

class ValueAddedServicesView extends React.PureComponent<IOwnProps, {}> {
  public render = (): React.ReactElement => {
    const { handleNextStep, containerStyle, t } = this.props;

    return (
      <View style={[styles.container, containerStyle]}>
        <CardWithCheckbox heading="This is dummy service. Yup" image={images.landingScreenLogo} price={1500} selected />
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
    paddingHorizontal: theme.layout.screenPadding,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
});
