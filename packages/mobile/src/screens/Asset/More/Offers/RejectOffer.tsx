import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormDropdown, IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Offer } from '@homzhub/common/src/domain/models/Offer';
import {
  ClosureReasonType,
  IClosureReasonPayload,
  INegotiationPayload,
  ListingType,
  NegotiationAction,
  NegotiationType,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { ICurrentOffer } from '@homzhub/common/src/modules/offers/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IFormData {
  reason: number;
}

const initialData = {
  reason: 0,
};

const { LEASE_NEGOTIATION_REJECTION, SALE_NEGOTIATION_REJECTION } = ClosureReasonType;
const { LEASE_NEGOTIATIONS, SALE_NEGOTIATIONS } = NegotiationType;
const { LEASE_LISTING } = ListingType;

const RejectOffer = (): React.ReactElement => {
  const [formData] = useState(initialData);
  const [comment, setComment] = useState('');
  const [reasons, setReasons] = useState<IDropdownOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // HOOKS START
  const { goBack } = useNavigation();
  const listingData = useSelector(OfferSelectors.getListingDetail);
  const offerData: Offer | null = useSelector(OfferSelectors.getCurrentOffer);
  const offerPayload: ICurrentOffer | null = useSelector(OfferSelectors.getOfferPayload);
  const { t } = useTranslation(LocaleConstants.namespacesKey.offers);

  useEffect(() => {
    if (listingData && offerPayload) {
      const {
        assetGroup: { id },
        country,
      } = listingData as Asset;
      const payload: IClosureReasonPayload = {
        type: offerPayload.type === LEASE_LISTING ? LEASE_NEGOTIATION_REJECTION : SALE_NEGOTIATION_REJECTION,
        asset_group: id,
        asset_country: country.id,
      };
      setIsLoading(true);
      AssetRepository.getClosureReason(payload)
        .then((res) => {
          const formattedData = res.map((item) => {
            return {
              label: item.title,
              value: item.id,
            };
          });
          setReasons(formattedData);
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
          AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
        });
    }
  }, []);

  // HOOKS END

  const handleSubmit = async (values: IFormData, formActions: FormikHelpers<IFormData>): Promise<void> => {
    if (offerData && offerPayload) {
      formActions.setSubmitting(true);
      const { type, listingId } = offerPayload;
      const payload: INegotiationPayload = {
        param: {
          listingType: type,
          listingId,
          negotiationType: type === LEASE_LISTING ? LEASE_NEGOTIATIONS : SALE_NEGOTIATIONS,
          negotiationId: offerData.id,
        },
        data: {
          action: NegotiationAction.REJECT,
          payload: {
            status_change_reason: values.reason,
            status_change_comment: comment,
          },
        },
      };

      try {
        await OffersRepository.updateNegotiation(payload);
        goBack();
        AlertHelper.success({ message: t('offers:offerRejectedSuccess') });
      } catch (e) {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      }
    }
    formActions.setSubmitting(false);
  };

  if (!offerData || !listingData) return <EmptyState />;

  const {
    user: { name },
    role,
  } = offerData;

  return (
    <UserScreen title={t('common:offers')} pageTitle={t('rejectOffer')} onBackPress={goBack} loading={isLoading}>
      <View style={styles.container}>
        <Avatar fullName={name} designation={StringUtils.toTitleCase(role)} />
        <PropertyAddressCountry
          isIcon
          primaryAddress={listingData.projectName}
          subAddress={listingData.address}
          countryFlag={listingData.country.flag}
          containerStyle={styles.verticalStyle}
        />
        <Divider />
        <Formik initialValues={{ ...formData }} onSubmit={handleSubmit}>
          {(formProps: FormikProps<IFormData>): React.ReactNode => {
            const isDisabled = formProps.values.reason === 0;
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
                  helpText={t('common:optional')}
                />
                <Label type="large" style={styles.helper}>
                  {t('common:actionNotDone')}
                </Label>
                <FormButton
                  // @ts-ignore
                  onPress={formProps.handleSubmit}
                  formProps={formProps}
                  type="primary"
                  title={t('rejectThisOffer')}
                  iconSize={20}
                  icon={icons.circularCrossFilled}
                  iconColor={isDisabled ? theme.colors.white : theme.colors.error}
                  titleStyle={isDisabled ? styles.buttonTitleDisabled : styles.buttonTitle}
                  containerStyle={isDisabled ? styles.buttonDisabled : styles.button}
                  disabled={isDisabled}
                />
              </>
            );
          }}
        </Formik>
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
  buttonDisabled: {
    backgroundColor: theme.colors.grey4,
    flexDirection: 'row-reverse',
    marginVertical: 10,
  },
  buttonTitle: {
    color: theme.colors.error,
  },
  buttonTitleDisabled: {
    color: theme.colors.white,
  },
});
