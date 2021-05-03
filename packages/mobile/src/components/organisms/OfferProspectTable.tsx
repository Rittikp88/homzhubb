import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Offer } from '@homzhub/common/src/domain/models/Offer';

enum HeaderKeys {
  NAME = 'Name',
  FAMILY = 'Family',
  NO_PETS = 'No Pets',
  BACHELORS = 'Bachelors',
  VEGETARIANS = 'Vegetarians',
  OCCUPANTS = 'No. of occupants',
  JOB_TYPE = 'Job Type',
  ORGANIZATION = 'Organization',
}

interface ICompareData {
  uniqueKey: number;
  profilePic: string;
  dataPoints: IDataPoints;
}

interface IDataPoints {
  name?: string;
  family?: boolean;
  pets?: boolean;
  bachelor?: boolean;
  vegetarian?: boolean;
  occupants?: number;
  jobType?: string;
  organization?: string;
}

interface IProps {
  selectedOfferIds: number[];
}

const OfferProspectTable = ({ selectedOfferIds }: IProps): React.ReactElement => {
  const negotiations = useSelector(OfferSelectors.getNegotiations);
  const listingDetail = useSelector(OfferSelectors.getListingDetail);
  const [compareData, setCompareData] = useState<ICompareData[]>([]);
  const [expectation, setExpectation] = useState<IDataPoints | null>(null);
  const [header, setHeader] = useState<string[]>([]);
  const [compareHeader, setCompareHeader] = useState<string[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const offer: Offer[] = [];
    negotiations.forEach((item) => {
      selectedOfferIds.forEach((id) => {
        if (id === item.id) {
          offer.push(item);
        }
      });
    });
    const formattedOffer = getFormattedOffer(offer, listingDetail);
    const formattedExpectation = getFormattedExpectation(listingDetail);
    setCompareData(formattedOffer);
    setExpectation(formattedExpectation);
  }, []);

  const getFormattedOffer = (offer: Offer[], listingData: Asset | null): ICompareData[] => {
    if (!listingData) return [];

    return offer.map((item) => {
      const { id, user, tenantPreferences, prospect } = item;

      return {
        uniqueKey: id,
        profilePic: user.profilePicture,
        dataPoints: {
          name: user.name,
          family: tenantPreferences.find((preference) => preference.name === HeaderKeys.FAMILY)?.isSelected,
          bachelor: tenantPreferences.find((preference) => preference.name === HeaderKeys.BACHELORS)?.isSelected,
          vegetarian: tenantPreferences.find((preference) => preference.name === HeaderKeys.VEGETARIANS)?.isSelected,
          pets: tenantPreferences.find((preference) => preference.name === HeaderKeys.NO_PETS)?.isSelected,
          occupants: prospect.occupants,
          jobType: prospect.user.workInfo.jobType.label,
          organization: prospect.user.workInfo.companyName,
        },
      };
    });
  };

  const getFormattedExpectation = (listingData: Asset | null): IDataPoints | null => {
    if (!listingData) return null;
    const listing = listingData.leaseTerm ? listingData.leaseTerm : null;
    if (!listing) return null;

    const { tenantPreferences } = listing;
    const preferences = tenantPreferences.map((item) => item.name);
    const formattedHeader = [...preferences];
    const formattedCompareHeader = [
      HeaderKeys.NAME,
      ...preferences,
      HeaderKeys.OCCUPANTS,
      HeaderKeys.JOB_TYPE,
      HeaderKeys.ORGANIZATION,
    ];
    setHeader(formattedHeader);
    setCompareHeader(formattedCompareHeader);
    return {
      ...(preferences.includes(HeaderKeys.FAMILY) && { family: true }),
      ...(preferences.includes(HeaderKeys.BACHELORS) && { bachelor: true }),
      ...(preferences.includes(HeaderKeys.VEGETARIANS) && { vegetarian: true }),
      ...(preferences.includes(HeaderKeys.NO_PETS) && { pets: true }),
    };
  };

  if (!expectation) {
    return <EmptyState />;
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View style={[styles.row, styles.topView]}>
            <Label type="large" style={{ width: theme.viewport.width / 2.5 }}>
              {t('offers:yourExpectation', { property: listingDetail?.projectName })}
            </Label>
            {Object.keys(expectation).map((key, index) => {
              return (
                <View style={styles.topContent} key={index}>
                  <Label type="regular" style={styles.topText}>
                    {header[index]}
                  </Label>
                  {!!header[index] && <Icon name={icons.checkFilled} color={theme.colors.green} size={20} />}
                </View>
              );
            })}
          </View>
          <View style={[styles.row, styles.headerContainer]}>
            {compareHeader.map((item, index) => {
              return (
                <View style={customStyles.contentBox(index === 0)} key={index}>
                  <Label type="large" style={styles.header}>
                    {item}
                  </Label>
                </View>
              );
            })}
          </View>
          {compareData.map((item: ICompareData, compareIndex) => {
            const offerData = item.dataPoints;
            return (
              <TouchableOpacity style={[styles.row, styles.rowContent]} key={compareIndex}>
                {Object.keys(offerData).map((key, index) => {
                  // @ts-ignore
                  const value = offerData[key];
                  return (
                    <View style={customStyles.contentBox(index === 0)} key={key}>
                      {key === 'name' && (
                        <Avatar
                          fullName={value}
                          image={item.profilePic}
                          imageSize={42}
                          containerStyle={{ width: theme.viewport.width / 2.5 }}
                          nameStyle={{ width: theme.viewport.width / 3.5 }}
                        />
                      )}
                      {key !== 'name' && (
                        <>
                          {typeof value === 'boolean' ? (
                            <Icon
                              name={value ? icons.checkFilled : icons.close}
                              color={value ? theme.colors.green : theme.colors.error}
                              size={20}
                            />
                          ) : (
                            <Label type="large" style={styles.text}>
                              {value}
                            </Label>
                          )}
                        </>
                      )}
                    </View>
                  );
                })}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default OfferProspectTable;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  header: {
    margin: 6,
    textAlign: 'center',
    color: theme.colors.darkTint5,
  },
  headerContainer: {
    paddingVertical: 12,
  },
  topView: {
    paddingVertical: 12,
    backgroundColor: theme.colors.blueTint11,
    alignItems: 'center',
  },
  topContent: {
    minWidth: theme.viewport.width / 3.5,
    alignItems: 'center',
  },
  topText: {
    margin: 6,
    textAlign: 'center',
    color: theme.colors.darkTint3,
  },
  rowContent: {
    marginVertical: 6,
    paddingVertical: 10,
  },
  text: {
    textAlign: 'center',
    color: theme.colors.darkTint3,
    height: 25,
    paddingHorizontal: 8,
  },
});

const customStyles = {
  contentBox: (isFirstKey?: boolean): StyleProp<ViewStyle> => ({
    minWidth: isFirstKey ? theme.viewport.width / 2.5 : theme.viewport.width / 3.5,
    flexDirection: 'row',
    justifyContent: isFirstKey ? 'flex-start' : 'center',
  }),
};