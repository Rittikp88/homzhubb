import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import RequirementForm from '@homzhub/mobile/src/components/organisms/RequirementForm';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const SearchRequirement = (): React.ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { navigate, goBack } = useNavigation();

  const navigateToLocalities = (): void => {
    navigate(ScreensKeys.LocalitiesSelection);
  };

  const onBack = (): void => {
    dispatch(SearchActions.clearLocalities());
    goBack();
  };

  return (
    <Screen
      backgroundColor={theme.colors.white}
      headerProps={{
        type: 'secondary',
        title: t('propertySearch:requirementForm'),
        icon: icons.close,
        onIconPress: onBack,
      }}
    >
      <RequirementForm onAddLocation={navigateToLocalities} onSubmit={onBack} />
    </Screen>
  );
};

export default SearchRequirement;
