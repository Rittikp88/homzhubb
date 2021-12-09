import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { ReportService } from '@homzhub/ffm/src/services/ReportService';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import UserWithAddressCard from '@homzhub/ffm/src/components/molecules/UserWithAddressCard';
import VisitContact from '@homzhub/ffm/src/components/molecules/VisitContact';
import { Report, ReportStatus } from '@homzhub/common/src/domain/models/Report';
import { User } from '@homzhub/common/src/domain/models/User';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  data: Report;
}

const ReportCard = (props: IProps): React.ReactElement => {
  const {
    data: { asset, users, updatedAt, createdAt, dueDate, status, completedPercentage },
    data,
  } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.reports);
  const [selectedUser, setUser] = useState<User | null>(null);
  const [isContactVisible, setIsContactVisible] = useState(false);

  const handleContactDetails = (isVisible: boolean, user: User | null): void => {
    setUser(user);
    setIsContactVisible(isVisible);
  };

  const getCancelVisibility = (): boolean => {
    const { ACCEPTED, NEW } = ReportStatus;
    return (
      (status === ACCEPTED && !DateUtils.isDatePassed(dueDate)) ||
      (status === ACCEPTED && DateUtils.isDatePassed(dueDate) && completedPercentage > 0) ||
      (status === NEW && !DateUtils.isDatePassed(dueDate))
    );
  };

  const renderActions = (): React.ReactElement => {
    const actionsData = ReportService.getActions(data).filter((item) => item.title);

    return (
      <View style={styles.actionContainer}>
        {actionsData.map((item, index) => {
          const isSingleAction = index === 0 && actionsData.length === 1;
          return (
            <Button
              key={index}
              type="secondary"
              title={item.title}
              icon={item.icon}
              iconSize={16}
              iconColor={item.iconColor}
              titleStyle={[styles.titleStyle, { color: item.color }]}
              containerStyle={[
                styles.buttonContainer,
                isSingleAction && styles.singleAction,
                item.isReverse && styles.buttonDirection,
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <UserWithAddressCard
          users={users}
          asset={asset}
          isFromDetail={false}
          date={updatedAt ?? createdAt}
          navigateToDetail={FunctionUtils.noop}
          handleContactDetails={handleContactDetails}
        />
        <View style={styles.row}>
          <View>
            {/* TODO: Handle Completed case */}
            <Label style={styles.detailTitle}>
              {DateUtils.isDatePassed(dueDate) ? t('overdueSince') : t('assetFinancial:dueBy')}
            </Label>
            <Label textType="semiBold" style={styles.detailTitle}>
              {DateUtils.getDisplayDate(dueDate, 'DD MMM YYYY')}
            </Label>
          </View>
          {getCancelVisibility() && (
            <Button type="secondary" containerStyle={styles.cancelButton} title={t('common:cancel')} />
          )}
        </View>
      </View>
      {renderActions()}
      {selectedUser && isContactVisible && (
        <BottomSheet
          visible={isContactVisible}
          isShadowView
          sheetHeight={300}
          headerTitle={t('contactUser', { name: selectedUser?.role.replace(/_/g, ' ').toLocaleLowerCase() })}
          onCloseSheet={(): void => handleContactDetails(false, null)}
        >
          <VisitContact user={selectedUser} imageSize={80} containerStyle={styles.contactCard} />
        </BottomSheet>
      )}
    </View>
  );
};

export default ReportCard;

const styles = StyleSheet.create({
  mainContainer: {
    borderWidth: 1,
    borderColor: theme.colors.darkTint10,
    marginBottom: 20,
  },
  container: {
    padding: 16,
  },
  contactCard: {
    marginHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailTitle: {
    color: theme.colors.darkTint3,
  },
  actionContainer: {
    borderTopWidth: 1,
    flexDirection: 'row',
    borderColor: theme.colors.darkTint10,
  },
  singleAction: {
    flex: 0,
    marginHorizontal: 16,
  },
  buttonContainer: {
    borderWidth: 0,
    flexDirection: 'row',
  },
  buttonDirection: {
    flexDirection: 'row-reverse',
  },
  titleStyle: {
    marginHorizontal: 4,
  },
  cancelButton: {
    borderWidth: 0,
    flex: 0,
  },
});
