import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { Ticket, TicketStatus } from '@homzhub/common/src/domain/models/Ticket';
import { initialExperienceData, ExperienceType } from '@homzhub/common/src/constants/ServiceTickets';

interface IDataType {
  [key: string]: string;
}

interface IProps {
  cardData: Ticket;
  onCardPress: () => void;
  isFromMore?: boolean;
}

export const TicketCard = (props: IProps): React.ReactElement => {
  const { cardData, onCardPress, isFromMore = false } = props;

  // HOOKS START

  const { t } = useTranslation();
  const [experienceData, setExperienceData] = useState(initialExperienceData);
  const [experience, setExperience] = useState('');
  const [isComment, setIsComment] = useState(false);
  const [comment, setComment] = useState('');

  // HOOKS END

  const { title, asset, createdAt, updatedAt, status, assignedTo, closedAt, closedBy } = cardData;
  const isClosed = status === TicketStatus.CLOSED;

  // Data formation for closed and open tickets
  const openTicket = {
    'serviceTickets:createdOn': createdAt,
    'serviceTickets:updatedOn': updatedAt,
    'helpAndSupport:status': status,
    'serviceTickets:assignedTo': assignedTo.firstName,
  };
  const closedTicket = {
    'serviceTickets:closedOn': closedAt,
    'serviceTickets:closedBy': closedBy.firstName,
  };

  const dataByStatus: IDataType = isClosed ? closedTicket : openTicket;

  // HANDLERS START
  const getIconColor = (type: ExperienceType): string => {
    switch (type) {
      case ExperienceType.SATISFIED:
        return theme.colors.green;
      case ExperienceType.NEUTRAL:
        return theme.colors.orange;
      case ExperienceType.UNSATISFIED:
        return theme.colors.error;
      default:
        return theme.colors.darkTint9;
    }
  };

  const handleExperience = (type: ExperienceType): void => {
    const updatedData = experienceData.map((item, index) => {
      if (item.type === type) {
        setExperience(type);
        return { ...item, color: getIconColor(type) };
      }

      return initialExperienceData[index];
    });
    setIsComment(true);
    setExperienceData(updatedData);
  };

  const onChangeComment = (value: string): void => {
    setComment(value);
  };
  // HANDLERS END

  const renderTextArea = (): React.ReactElement => {
    return (
      <>
        <TextArea
          value={comment}
          isCountRequired={false}
          placeholder={t('property:writeComment')}
          textAreaStyle={styles.textArea}
          onMessageChange={onChangeComment}
        />
        <View style={styles.buttonContainer}>
          <Button
            onPress={(): void => setIsComment(false)}
            type="secondary"
            title={t('common:cancel')}
            containerStyle={styles.button}
            titleStyle={styles.buttonTitle}
          />
          <Button
            type="primary"
            title={t('common:submit')}
            containerStyle={[styles.button, styles.submit]}
            titleStyle={styles.buttonTitle}
          />
        </View>
      </>
    );
  };

  const renderIconView = (): React.ReactElement => {
    return (
      <View style={styles.experienceContent}>
        <Divider containerStyles={styles.divider} />
        <Label type="large">{t('common:experience')}</Label>
        <View style={styles.iconView}>
          <>
            <View style={styles.row}>
              {experienceData.map((item, index) => {
                return (
                  <Icon
                    key={index}
                    name={item.icon}
                    color={item.color}
                    size={28}
                    style={styles.iconPadding}
                    onPress={(): void => handleExperience(item.type)}
                  />
                );
              })}
            </View>
            <Label type="large" textType="semiBold">
              {experience}
            </Label>
          </>
        </View>
        {isComment && renderTextArea()}
      </View>
    );
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onCardPress}>
      <View style={styles.row}>
        <View style={styles.line} />
        <View style={styles.detailsContainer}>
          <Label type="large" textType="semiBold">
            {title}
          </Label>
          {isFromMore && (
            <Label type="regular" textType="light">
              {asset.projectName}
            </Label>
          )}
          {Object.keys(dataByStatus).map((key, indexValue: number) => (
            <View key={indexValue} style={styles.detailsColumn}>
              <Label type="small" textType="regular" style={styles.details}>
                {t(key)}
              </Label>
              <Label type="regular" textType="semiBold">
                {dataByStatus[key]}
              </Label>
            </View>
          ))}
        </View>
      </View>
      {isClosed && renderIconView()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: theme.colors.darkTint10,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  details: {
    color: theme.colors.darkTint3,
    marginBottom: 6,
  },
  detailsColumn: {
    paddingTop: 12,
    width: '50%',
  },
  line: {
    borderTopEndRadius: 10,
    borderBottomEndRadius: 10,
    paddingLeft: 5,
    width: 3,
    backgroundColor: theme.colors.error,
    marginVertical: 18,
  },
  buttonContainer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    flex: 0,
  },
  buttonTitle: {
    marginHorizontal: 12,
    marginVertical: 6,
  },
  divider: {
    marginBottom: 10,
  },
  submit: {
    marginStart: 12,
  },
  textArea: {
    height: 80,
    borderRadius: 4,
  },
  experienceContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  iconView: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconPadding: {
    marginRight: 15,
  },
});
