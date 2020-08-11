import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Badge, Button, Label, Text } from '@homzhub/common/src/components';
import { IServiceItems } from '@homzhub/common/src/domain/models/Service';

interface ICardProps {
  title: string;
  badgeTitle?: string;
  description: string;
  serviceCost: string;
  isDetailView?: boolean;
  detailedData?: IServiceItems[];
  onPressInfo?: () => void;
  onConfirm?: () => void;
}

type Props = WithTranslation & ICardProps;

const CardBody = (props: Props): React.ReactElement => {
  const { t, title, description, serviceCost, isDetailView, badgeTitle, detailedData, onPressInfo, onConfirm } = props;

  const renderDetailedData = (item: IServiceItems, index: number): React.ReactElement => {
    const isIncluded = true;
    return (
      <View style={styles.detailContent} key={index}>
        <Icon
          name={isIncluded ? icons.checkFilled : icons.close}
          color={isIncluded ? theme.colors.completed : theme.colors.disabled}
          size={22}
        />
        <Text type="small" textType="regular" style={styles.listTitle}>
          {item.title}
        </Text>
      </View>
    );
  };

  const costOfPackage = (cost: string): string => {
    const parsedCost = parseInt(cost, 10);
    switch (parsedCost) {
      case 0:
        // @ts-ignore
        return t('common:noCost');
      case -1:
        // @ts-ignore
        return t('common:requestQuote');
      default:
        return cost;
    }
  };

  return (
    <>
      <View style={styles.content}>
        {!!badgeTitle && (
          <Badge title={badgeTitle} badgeColor={theme.colors.mediumPriority} badgeStyle={styles.badgeStyle} />
        )}
        <Text type="regular" textType="semiBold" style={styles.title}>
          {title}
        </Text>
        <Label type="large" textType="regular" style={styles.description}>
          {description}
        </Label>
      </View>
      <View style={styles.subContainer}>
        <Label type="regular" textType="regular" style={styles.feeText}>
          {t('totalServiceFee')}
        </Label>
        <View style={styles.costView}>
          <Text type="large" textType="light" style={styles.feeDesc}>
            {costOfPackage(serviceCost)}
          </Text>
          {isDetailView && <Icon name={icons.info} color={theme.colors.primaryColor} size={22} onPress={onPressInfo} />}
        </View>
      </View>
      {isDetailView && detailedData && (
        <View style={styles.detailContainer}>
          {detailedData.map((item: IServiceItems, index) => {
            return renderDetailedData(item, index);
          })}
          <Button type="primary" title={t('confirmService')} containerStyle={styles.buttonStyle} onPress={onConfirm} />
        </View>
      )}
    </>
  );
};
const HOC = withTranslation(LocaleConstants.namespacesKey.property)(CardBody);
export { HOC as CardBody };

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
  },
  badgeStyle: {
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  title: {
    color: theme.colors.darkTint2,
  },
  description: {
    color: theme.colors.darkTint3,
    marginTop: 6,
  },
  subContainer: {
    backgroundColor: theme.colors.background,
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  costView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feeText: {
    color: theme.colors.darkTint4,
  },
  feeDesc: {
    color: theme.colors.darkTint1,
    paddingTop: 6,
  },
  listTitle: {
    color: theme.colors.darkTint2,
    marginLeft: 20,
  },
  detailContainer: {
    paddingHorizontal: 24,
  },
  detailContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonStyle: {
    marginTop: 24,
  },
});
