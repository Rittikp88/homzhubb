import React, { useState, useCallback, memo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Rating } from '@homzhub/common/src/components/atoms/Rating';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IRatingCaregory {
  id: number;
  name: string;
  rating: number;
}
interface IProps {
  asset: Asset;
  ratingCategories: IRatingCaregory[];
  onClose: () => void;
}

const ReviewForm = (props: IProps): React.ReactElement => {
  const { asset, onClose, ratingCategories } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.property);

  const [overallRating, setOverallRating] = useState(0);
  const [description, setDescription] = useState('');
  const [categoryRatings, setcategoryRatings] = useState<IRatingCaregory[]>(ratingCategories);

  const updatePillarRating = useCallback(
    (newRating: number, id: number): void => {
      const stateToUpdate = [...categoryRatings];
      const categoryToUpdate = stateToUpdate.find((pillar) => pillar.id === id);

      if (!categoryToUpdate || categoryToUpdate.rating === newRating) {
        return;
      }

      categoryToUpdate.rating = newRating;
      setcategoryRatings(stateToUpdate);
    },
    [categoryRatings]
  );

  const onSubmit = useCallback(() => {}, []);

  return (
    <>
      <PropertyAddressCountry
        primaryAddress={asset.projectName}
        subAddress={asset.address}
        countryFlag="https://www.countryflags.io/IN/flat/48.png"
        containerStyle={styles.container}
      />
      <Divider containerStyles={styles.dividerStyle} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} bounces={false}>
        <Label type="large" textType="semiBold" style={styles.overallExperience}>
          {t('overallExperience')}
        </Label>
        <Rating isOverallRating value={overallRating} onChange={setOverallRating} />
        <View style={styles.pillarContainer}>
          {categoryRatings.map((pillarRating) => {
            return (
              <Rating
                key={pillarRating.id}
                title={pillarRating.name}
                value={pillarRating.rating}
                onChange={(newRating): void => updatePillarRating(newRating, pillarRating.id)}
                containerStyle={styles.rating}
              />
            );
          })}
        </View>
        <TextArea
          label={t('assetDescription:description')}
          helpText={t('common:optional')}
          value={description}
          wordCountLimit={500}
          placeholder={t('bestReasons')}
          onMessageChange={setDescription}
          textAreaStyle={styles.textArea}
        />
        <View style={styles.buttonContainer}>
          <Button onPress={onClose} type="secondary" title={t('common:notNow')} titleStyle={styles.buttonTitle} />
          <Button
            onPress={onSubmit}
            disabled={overallRating === 0}
            type="primary"
            title={t('common:submit')}
            containerStyle={styles.submitButton}
          />
        </View>
      </ScrollView>
    </>
  );
};

const memoized = memo(ReviewForm);
export { memoized as ReviewForm };

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
  },
  pillarContainer: {
    marginTop: 20,
    marginBottom: 4,
  },
  overallExperience: {
    textAlign: 'center',
    color: theme.colors.darkTint3,
    marginBottom: 16,
    marginTop: 12,
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: 'row',
    marginBottom: 12,
  },
  submitButton: {
    marginStart: 16,
  },
  dividerStyle: {
    backgroundColor: theme.colors.background,
    marginTop: 16,
  },
  textArea: {
    height: 100,
    borderRadius: 4,
  },
  rating: {
    marginBottom: 16,
  },
  buttonTitle: {
    marginHorizontal: 0,
  },
});
