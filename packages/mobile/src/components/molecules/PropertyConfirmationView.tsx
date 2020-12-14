import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { Asset } from '@homzhub/common/src/domain/models/Asset';

interface IProps {
  propertyData: Asset;
  description: string;
  message: string;
  onCancel: () => void;
  onContinue: () => void;
}

const PropertyConfirmationView = (props: IProps): React.ReactElement => {
  const {
    propertyData: {
      projectName,
      address,
      country: { flag },
    },
    description,
    message,
    onCancel,
    onContinue,
  } = props;
  return (
    <View style={styles.container}>
      <PropertyAddressCountry primaryAddress={projectName} subAddress={address} countryFlag={flag} />
      <Divider containerStyles={styles.divider} />
      <Text type="small">{description}</Text>
      <Text type="small" style={styles.message}>
        {message}
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          type="secondary"
          title="Continue"
          titleStyle={styles.buttonTitle}
          onPress={onContinue}
          containerStyle={styles.editButton}
        />
        <Button
          type="primary"
          title="Cancel"
          onPress={onCancel}
          titleStyle={styles.buttonTitle}
          containerStyle={styles.doneButton}
        />
      </View>
    </View>
  );
};

export default PropertyConfirmationView;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  divider: {
    marginVertical: 14,
    borderColor: theme.colors.darkTint10,
  },
  message: {
    marginVertical: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  editButton: {
    marginLeft: 10,
    flexDirection: 'row-reverse',
  },
  doneButton: {
    flexDirection: 'row-reverse',
  },
  buttonTitle: {
    marginHorizontal: 4,
  },
});
