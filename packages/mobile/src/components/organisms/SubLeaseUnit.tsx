import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Formik, FormikProps } from 'formik';
import * as yup from 'yup';
import { cloneDeep } from 'lodash';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { AssetService } from '@homzhub/common/src/services/AssetService';
import { theme } from '@homzhub/common/src/styles/theme';
import {
  CheckboxGroup,
  FormButton,
  FurnishingSelection,
  ICheckboxGroupData,
  Text,
} from '@homzhub/common/src/components';
import {
  IFormData,
  initialLeaseFormValues,
  LeaseFormSchema,
  LeaseTermForm,
} from '@homzhub/mobile/src/components/molecules/LeaseTermForm';
import { PropertySpaces } from '@homzhub/mobile/src/components/organisms/PropertySpaces';
import { AssetListingSection } from '@homzhub/mobile/src/components/HOC/AssetListingSection';
import { AssetGroupTypes } from '@homzhub/common/src/constants/AssetGroup';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { FurnishingTypes } from '@homzhub/common/src/constants/Terms';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { SpaceType } from '@homzhub/common/src/domain/models/AssetGroup';
import { ILeaseTermParams } from '@homzhub/common/src/domain/models/LeaseTerm';

interface IProps {
  assetGroupType: AssetGroupTypes;
  currencyData: Currency;
  furnishing: FurnishingTypes;
  availableSpaces: SpaceType[];
  preferences: ICheckboxGroupData[];
  onSubmit: (values: ILeaseTermParams, key?: string) => void;
  onSpacesChange?: (id: number, type: SpaceChangeType, count?: number) => void;
  singleLeaseUnitKey?: number;
  route?: { key: string; title: string; id?: number };
}

// CONSTANTS
const LEASE_UNIT = 'Lease Unit';
export enum SpaceChangeType {
  INC = 'INC',
  DEC = 'DEC',
  EQL = 'EQL',
  DEL = 'DEL',
}

const SubLeaseUnit = (props: IProps): React.ReactElement => {
  const [t] = useTranslation(LocaleConstants.namespacesKey.property);
  const {
    singleLeaseUnitKey,
    assetGroupType,
    currencyData,
    furnishing,
    preferences,
    availableSpaces,
    onSubmit,
    onSpacesChange,
    route,
  } = props;

  // HOOKS
  const [tenantPreferences, setPreferences] = useState<ICheckboxGroupData[]>([]);
  const [spaces, setSpaces] = useState<SpaceType[]>([]);
  const [furnishingType, setFurnishingType] = useState(furnishing);
  const val = useRef<SpaceType[]>([]);

  useEffect(() => {
    if (spaces.length <= 0) {
      setSpaces(cloneDeep(availableSpaces));
    } else {
      const nextState = spaces.map((space) => {
        const newParentObj = availableSpaces.find((parentObj) => parentObj.id === space.id);
        space.count = newParentObj?.count ?? space.count;
        return space;
      });
      setSpaces(nextState);
    }
  }, [availableSpaces]);

  useEffect(() => {
    if (tenantPreferences.length <= 0) {
      setPreferences(cloneDeep(preferences));
    }
  }, [preferences]);
  // HOOKS END

  // CLEANUP
  useEffect(() => {
    val.current = spaces;
  }, [spaces]);

  useEffect(() => {
    return (): void => {
      val.current.forEach((space) => {
        if (space.count > 0 && onSpacesChange) {
          onSpacesChange(space.id, SpaceChangeType.DEL, space.count);
        }
      });
    };
  }, []);
  // CLEANUP END

  // USER INTERACTION CALLBACKS
  const handlePreferences = useCallback(
    (id: number, isChecked: boolean): void => {
      const toUpdate = [...tenantPreferences];

      toUpdate.forEach((detail: ICheckboxGroupData) => {
        if (detail.id === id) {
          detail.isSelected = isChecked;
        }
      });

      setPreferences(toUpdate);
    },
    [tenantPreferences]
  );

  const handleSpaceFormChange = useCallback(
    (id: number, count: number, description?: string): void => {
      if (!onSpacesChange) {
        return;
      }

      let type = SpaceChangeType.EQL;
      // To Handle the counter atoms on mount callbacks
      if (spaces.length === 0 && count > 0) {
        onSpacesChange(id, SpaceChangeType.INC);
        return;
      }

      // To handle the regular flow
      const nextState: SpaceType[] = spaces.map((space: SpaceType) => {
        if (space.id === id) {
          if (count < space.unitCount) {
            type = SpaceChangeType.DEC;
          }
          if (count > space.unitCount) {
            type = SpaceChangeType.INC;
          }
          space.unitCount = count;
        }
        return space;
      });

      if (type === SpaceChangeType.EQL) {
        return;
      }

      setSpaces(nextState);
      onSpacesChange(id, type);
    },
    [spaces, onSpacesChange]
  );

  const onSubmitPress = useCallback(
    (values: IFormData) => {
      const params = {
        ...AssetService.extractLeaseParams(values, assetGroupType),
        tenant_preferences: tenantPreferences
          .filter((pref: ICheckboxGroupData) => pref.isSelected)
          .map((pref: ICheckboxGroupData) => pref.id),
        furnishing: furnishingType,
        lease_unit: {
          name: route?.title ?? LEASE_UNIT,
          spaces: spaces
            .map((space) => {
              if (route) {
                return space.subLeaseSpaceList;
              }
              return space.spaceList;
            })
            .filter((item) => item.count > 0),
        },
      };

      if (route && route.id) {
        params.lease_listing = route.id;
      } else if (singleLeaseUnitKey && singleLeaseUnitKey !== -1) {
        params.lease_listing = singleLeaseUnitKey;
      }

      onSubmit(params, route?.key);
    },
    [assetGroupType, onSubmit, tenantPreferences, route, furnishingType, spaces, availableSpaces, singleLeaseUnitKey]
  );
  // USER INTERACTION CALLBACKS END

  // FORM VALIDATIONS
  const formSchema = useCallback((): yup.ObjectSchema => {
    return yup.object().shape({
      ...LeaseFormSchema(t),
    });
  }, [t]);
  // FORM VALIDATIONS END

  return (
    <Formik
      enableReinitialize
      onSubmit={onSubmitPress}
      initialValues={{ ...initialLeaseFormValues }}
      validate={FormUtils.validate(formSchema)}
    >
      {(formProps: FormikProps<IFormData>): React.ReactElement => {
        return (
          <>
            {route && availableSpaces.length > 0 && (
              <>
                <Text type="small" textType="semiBold" style={styles.title}>
                  {t('spacesText')}
                </Text>
                <PropertySpaces spacesTypes={spaces} onChange={handleSpaceFormChange} />
                <FurnishingSelection
                  value={furnishingType}
                  onFurnishingChange={setFurnishingType}
                  containerStyle={styles.furnishingContainer}
                />
              </>
            )}
            <LeaseTermForm
              formProps={formProps}
              currencyData={currencyData}
              isSplitAsUnits={!!route}
              assetGroupType={assetGroupType}
            >
              {preferences.length > 0 && (
                <AssetListingSection title={t('tenantPreferences')} containerStyles={styles.descriptionContainer}>
                  <CheckboxGroup data={tenantPreferences} onToggle={handlePreferences} />
                </AssetListingSection>
              )}
            </LeaseTermForm>
            <FormButton
              title={t('common:continue')}
              type="primary"
              formProps={formProps}
              // @ts-ignore
              onPress={formProps.handleSubmit}
              containerStyle={styles.continue}
            />
          </>
        );
      }}
    </Formik>
  );
};

const memoizedComponent = React.memo(SubLeaseUnit);
export { memoizedComponent as SubLeaseUnit };

const styles = StyleSheet.create({
  continue: {
    flex: 0,
    marginTop: 20,
    marginBottom: 50,
  },
  descriptionContainer: {
    marginTop: 16,
  },
  title: {
    padding: 16,
    backgroundColor: theme.colors.white,
    color: theme.colors.darkTint3,
  },
  furnishingContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
});
