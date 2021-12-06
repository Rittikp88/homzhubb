import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { TimeUtils } from '@homzhub/common/src/utils/TimeUtils';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import VisitContact from '@homzhub/ffm/src/components/molecules/VisitContact';
import { IVisitActions, VisitActions } from '@homzhub/common/src/domain/models/AssetVisit';
import { FFMVisit } from '@homzhub/common/src/domain/models/FFMVisit';
import { User } from '@homzhub/common/src/domain/models/User';
import { Tabs } from '@homzhub/common/src/constants/Tabs';
import { VisitSlot } from '@homzhub/common/src/mocks/BookVisit';

interface IProps {
  visit: FFMVisit;
  tab: Tabs;
  handleActions: (action: VisitActions) => void;
  onReschedule: () => void;
  navigateToDetail: () => void;
  isFromDetail?: boolean;
  navigateToFeedback: () => void;
}

const VisitCard = (props: IProps): React.ReactElement => {
  const user = useSelector(UserSelector.getUserProfile);
  const { t } = useTranslation();
  const {
    visit: {
      status,
      asset: { projectName, address, attachments },
      users,
      actions,
      canSubmitFeedback,
      statusUpdatedBy,
      prospectFeedback,
      startDate,
      updatedAt,
      createdAt,
      assetKeys,
    },
    tab,
    isFromDetail = false,
    handleActions,
    onReschedule,
    navigateToDetail,
    navigateToFeedback,
  } = props;
  const [isContactVisible, setContactVisible] = useState(false);
  const [selectedUser, setUser] = useState<User | null>(null);

  const isMissed = tab === Tabs.MISSED;
  const isCompleted = tab === Tabs.COMPLETED;
  const isUpcoming = tab === Tabs.ONGOING;
  const isNew = tab === Tabs.NEW;
  const isActionsUsed = isNew || isUpcoming;
  const dateTime = DateUtils.convertTimeFormat(startDate, 'YYYY-MM-DD HH');
  const time = VisitSlot.find((item) => item.from === Number(dateTime[1]));

  const formattedActions = (): VisitActions[] => {
    const action = actions;
    if (isUpcoming && !action.includes(VisitActions.SCHEDULED)) {
      action.unshift(VisitActions.SCHEDULED);
    }
    if (isNew && actions.length === 1 && !action.includes(VisitActions.AWAITING)) {
      action.unshift(VisitActions.AWAITING);
    }
    return action;
  };

  const handleContactDetails = (value: boolean, userData: User | null): void => {
    setContactVisible(value);
    setUser(userData);
  };

  const getActions = (action: string): IVisitActions | null => {
    const { APPROVE, REJECT, CANCEL, SCHEDULED, AWAITING } = VisitActions;
    switch (action) {
      case APPROVE:
        return {
          title: t('common:accept'),
          color: theme.colors.green,
          icon: icons.circularCheckFilled,
        };
      case REJECT:
        return {
          title: t('common:reject'),
          color: theme.colors.error,
          icon: icons.circularCrossFilled,
        };
      case CANCEL:
        return {
          title: t('common:cancel'),
          color: theme.colors.error,
        };
      case SCHEDULED:
        return {
          title: t('property:visitScheduled'),
          color: theme.colors.green,
          icon: icons.circularCheckFilled,
        };
      case AWAITING:
        return {
          title: t('property:awaiting'),
          color: theme.colors.darkTint3,
          icon: icons.timer,
        };
      default:
        return null;
    }
  };

  const getMissedMessage = (updatedBy: User): string => {
    return t('siteVisits:visitMissed', {
      action: StringUtils.toTitleCase(status),
      name: user.id === updatedBy.id ? 'you' : updatedBy.firstName,
    });
  };

  const renderUsers = (): React.ReactElement => {
    return (
      <View style={styles.userContainer}>
        {users?.map((item, index) => {
          return (
            <Avatar
              key={index}
              fullName={item.name}
              designation={StringUtils.toTitleCase(item.role.replace(/_/g, ' '))}
              isRightIcon
              image={item.profilePicture}
              onPressRightIcon={(): void => handleContactDetails(true, item)}
              containerStyle={styles.user}
            />
          );
        })}
      </View>
    );
  };

  const renderActions = (): React.ReactElement => {
    return (
      <View style={[styles.row, styles.actionContainer]}>
        {isActionsUsed &&
          formattedActions().map((item, index) => {
            const actionData = getActions(item);
            return (
              <>
                <Button
                  type="secondary"
                  title={actionData?.title}
                  icon={actionData?.icon}
                  iconSize={16}
                  iconColor={actionData?.color}
                  titleStyle={[styles.schedule, { color: actionData?.color }]}
                  containerStyle={styles.buttonContainer}
                  onPress={(): void => handleActions(item)}
                />
                {index === 0 && <View style={styles.border} />}
              </>
            );
          })}
        {isMissed && (
          <View style={[styles.row, styles.missedSection]}>
            <Icon name={icons.circularCrossFilled} size={16} style={styles.icon} color={theme.colors.error} />
            <Label type="large" textType="semiBold" style={styles.missed}>
              {statusUpdatedBy ? getMissedMessage(statusUpdatedBy) : t('siteVisits:visitExpired')}
            </Label>
          </View>
        )}
        {isCompleted && prospectFeedback && (
          <TouchableOpacity style={[styles.row, styles.completeSection]} onPress={navigateToFeedback}>
            <Label type="large" textType="semiBold" style={styles.feedback}>
              {t('siteVisits:prospectFeedbackForm')}
            </Label>
            <Icon name={icons.rightArrow} size={16} style={styles.icon} color={theme.colors.green} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderDetailContainer = (): React.ReactElement => {
    return (
      <TouchableOpacity style={[styles.row, isFromDetail && styles.user]} onPress={navigateToDetail}>
        {isFromDetail && (
          <View>
            {attachments.length > 0 ? (
              <Image
                source={{
                  uri: attachments.filter((item) => item.isCoverImage)[0].link,
                }}
                style={styles.carouselImage}
              />
            ) : (
              <ImagePlaceholder width={80} height={80} containerStyle={styles.placeholder} />
            )}
          </View>
        )}
        <View style={styles.flexOne}>
          <Label type="large" textType="semiBold" style={styles.project}>
            {projectName}
          </Label>
          <Label style={styles.address}>{address}</Label>
        </View>
        <View>
          {isFromDetail && <Icon name={icons.rightArrow} size={18} style={styles.arrow} />}
          <Label style={styles.time}>{TimeUtils.getLocaltimeDifference(updatedAt ?? createdAt)}</Label>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, isFromDetail && styles.detailContentContainer]}>
      <View style={[styles.detailContainer, isFromDetail && styles.fromDetail]}>
        {renderDetailContainer()}
        {renderUsers()}
        <View style={[styles.row, styles.details]}>
          <View>
            <Label style={styles.detailTitle}>{t('property:visitDetails')}</Label>
            <View style={[styles.row, styles.center]}>
              <Label textType="semiBold" style={styles.detailTitle}>
                {DateUtils.getDisplayDate(dateTime[0], 'DD MMM')}
              </Label>
              <Icon name={icons.roundFilled} size={6} style={styles.dot} color={theme.colors.darkTint3} />
              <Label textType="semiBold" style={styles.detailTitle}>
                {time?.formatted}
              </Label>
            </View>
          </View>
          <TouchableOpacity style={[styles.row, styles.center]} onPress={onReschedule}>
            <Icon name={icons.schedule} size={16} style={styles.schedule} color={theme.colors.primaryColor} />
            <Label type="large" textType="semiBold" style={styles.title}>
              {t('property:reschedule')}
            </Label>
          </TouchableOpacity>
        </View>
        {isFromDetail && assetKeys.length > 0 && (
          <View style={styles.keysContainer}>
            <View style={styles.keyHeading}>
              <Icon name={icons.logOut} size={16} style={styles.schedule} color={theme.colors.darkTint3} />
              <Label type="large" textType="semiBold" style={styles.detailTitle}>
                Keys
              </Label>
            </View>
            {assetKeys.map((item, index) => {
              return <VisitContact key={index} assetKey={item} />;
            })}
          </View>
        )}
        {isCompleted && canSubmitFeedback && (
          <Button
            type="primary"
            title={t('siteVisits:prospectFeedbackForm')}
            containerStyle={styles.feedbackButton}
            onPress={navigateToFeedback}
          />
        )}
      </View>
      {renderActions()}
      {selectedUser && isContactVisible && (
        <BottomSheet
          visible={isContactVisible}
          isShadowView
          sheetHeight={300}
          headerTitle={`Contact (${selectedUser.role.replace(/_/g, ' ').toLocaleLowerCase()})`}
          onCloseSheet={(): void => handleContactDetails(false, null)}
        >
          <VisitContact user={selectedUser} imageSize={80} containerStyle={styles.contactCard} />
        </BottomSheet>
      )}
    </View>
  );
};

export default VisitCard;

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  project: {
    color: theme.colors.darkTint2,
  },
  address: {
    color: theme.colors.darkTint4,
  },
  time: {
    color: theme.colors.darkTint5,
  },
  container: {
    margin: 16,
    borderColor: theme.colors.darkTint10,
    borderWidth: 1,
  },
  detailContainer: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userContainer: {
    marginVertical: 16,
  },
  user: {
    marginBottom: 16,
  },
  details: {
    alignItems: 'flex-end',
    marginVertical: 10,
  },
  detailTitle: {
    color: theme.colors.darkTint3,
  },
  center: {
    alignItems: 'center',
  },
  dot: {
    marginHorizontal: 6,
    marginTop: 4,
  },
  schedule: {
    marginHorizontal: 6,
  },
  title: {
    color: theme.colors.primaryColor,
  },
  feedbackButton: {
    marginTop: 16,
    flex: 0,
  },
  actionContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.darkTint10,
  },
  buttonContainer: {
    borderWidth: 0,
    flexDirection: 'row-reverse',
  },
  border: {
    borderWidth: 0.5,
    borderColor: theme.colors.darkTint10,
  },
  missedSection: {
    padding: 16,
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 6,
    marginTop: 2,
  },
  completeSection: {
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 50,
  },
  feedback: {
    color: theme.colors.green,
  },
  missed: {
    color: theme.colors.error,
  },
  placeholder: {
    backgroundColor: theme.colors.darkTint5,
    borderRadius: 4,
    marginRight: 12,
  },
  carouselImage: {
    height: 200,
    width: 200,
  },
  arrow: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  detailContentContainer: {
    borderWidth: 0,
    margin: 0,
  },
  fromDetail: {
    padding: 0,
    paddingHorizontal: 12,
  },
  keysContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.darkTint10,
    paddingVertical: 16,
  },
  keyHeading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactCard: {
    marginHorizontal: 16,
  },
});
