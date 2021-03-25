import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Formik, FormikProps } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { FormDropdown, IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import {
  ClosureReasonType,
  IClosureReasonPayload,
  INegotiationPayload,
  ListingType,
  NegotiationAction,
  NegotiationType,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IFormData {
  reason: number;
}

const initialData = {
  reason: 0,
};

const RejectOffer = (): React.ReactElement => {
  const { goBack } = useNavigation();
  const { t } = useTranslation(LocaleConstants.namespacesKey.offers);
  const [formData] = useState(initialData);
  const [comment, setComment] = useState('');
  const [reasons, setReasons] = useState<IDropdownOption[]>([]);

  useEffect(() => {
    // TODO: (Shikha) - Add proper values in payload
    const payload: IClosureReasonPayload = {
      type: ClosureReasonType.LEASE_NEGOTIATION_REJECTION,
      asset_group: 1,
      asset_country: 1,
    };
    AssetRepository.getClosureReason(payload)
      .then((res) => {
        const formattedData = res.map((item) => {
          return {
            label: item.title,
            value: item.id,
          };
        });
        setReasons(formattedData);
      })
      .catch((e) => AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) }));
  });

  const handleSubmit = (): void => {
    // TODO: (Shikha) - Add proper values in payload and Remove lint disable
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    const payload: INegotiationPayload = {
      param: {
        listingType: ListingType.LEASE_LISTING,
        listingId: 302,
        negotiationType: NegotiationType.LEASE_NEGOTIATIONS,
        negotiationId: 1,
      },
      data: {
        action: NegotiationAction.REJECT,
        payload: {
          reject_reason: formData.reason,
          reject_comment: comment,
        },
      },
    };
    try {
      // TODO: (Shikha) - Uncomment once payload is finalized
      // await OffersRepository.updateNegotiation(payload);
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  // TODO: (Shikha) - Use Property and User values from API
  return (
    <UserScreen title={t('common:offers')} pageTitle={t('rejectOffer')} onBackPress={goBack}>
      <View style={styles.container}>
        <Avatar fullName="Brooklyn Simmons" designation="Tenant" />
        <PropertyAddressCountry
          countryFlag={null}
          primaryAddress="Selway Apartments"
          subAddress="2972 Westheimer Rd. Santa Ana, NY"
          isIcon
          containerStyle={styles.verticalStyle}
        />
        <Divider />
        <Formik initialValues={{ ...formData }} onSubmit={handleSubmit}>
          {(formProps: FormikProps<IFormData>): React.ReactNode => {
            return (
              <>
                <FormDropdown
                  name="reason"
                  label={t('common:reason')}
                  placeholder={t('rejectReason')}
                  options={reasons}
                  listHeight={500}
                  formProps={formProps}
                />
                <TextArea
                  value={comment}
                  label={t('assetDescription:description')}
                  placeholder={t('common:additionalComment')}
                  containerStyle={styles.verticalStyle}
                  onMessageChange={(value): void => setComment(value)}
                />
              </>
            );
          }}
        </Formik>
        <Label type="large" style={styles.helper}>
          {t('common:actionNotDone')}
        </Label>
        <Button
          type="primary"
          title={t('rejectThisOffer')}
          iconSize={20}
          icon={icons.circularCrossFilled}
          iconColor={theme.colors.error}
          titleStyle={styles.buttonTitle}
          containerStyle={styles.button}
        />
      </View>
    </UserScreen>
  );
};

export default RejectOffer;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  verticalStyle: {
    marginVertical: 16,
  },
  helper: {
    marginTop: 80,
    alignSelf: 'center',
    color: theme.colors.darkTint5,
  },
  button: {
    backgroundColor: theme.colors.redOpacity,
    flexDirection: 'row-reverse',
    marginVertical: 10,
  },
  buttonTitle: {
    color: theme.colors.error,
  },
});
