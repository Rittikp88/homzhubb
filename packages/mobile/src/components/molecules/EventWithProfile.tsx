import React, { Component } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { groupBy } from 'lodash';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import PropertyVisitList from '@homzhub/mobile/src/components/organisms/PropertyVisitList';
import { AssetVisit, IVisitByKey, VisitActions } from '@homzhub/common/src/domain/models/AssetVisit';
import { UserInteraction } from '@homzhub/common/src/domain/models/UserInteraction';

interface IProps extends WithTranslation {
  detail: UserInteraction;
  handleVisitAction: (visitId: number, action: VisitActions, isUserView?: boolean) => void;
  handleConfirmation: (id: number) => void;
  handleReschedule: (asset: AssetVisit) => void;
}

class EventWithProfile extends Component<IProps> {
  public render(): React.ReactNode {
    const {
      t,
      detail: {
        user: { name, profilePicture },
      },
      handleConfirmation,
      handleReschedule,
    } = this.props;

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Avatar fullName={name} isOnlyAvatar imageSize={72} image={profilePicture} />
          <Text type="regular" style={styles.name}>
            {name}
          </Text>
        </View>
        <Divider containerStyles={styles.divider} />
        <Text type="small" style={styles.title}>
          {t('assetMore:propertyVisits')}
        </Text>
        <PropertyVisitList
          isUserView
          visitData={this.visitData()}
          handleAction={this.handleAction}
          handleConfirmation={handleConfirmation}
          handleReschedule={handleReschedule}
          containerStyle={styles.list}
          isResponsiveHeightRequired={false}
        />
      </ScrollView>
    );
  }

  private visitData = (): IVisitByKey[] => {
    const {
      detail: { actions },
    } = this.props;

    const groupData = groupBy(actions, (results) => {
      return results.updatedAt;
    });

    return Object.keys(groupData).map((date) => {
      const results = groupData[date];
      return {
        key: date,
        results,
      };
    });
  };

  private handleAction = (visitId: number, action: VisitActions): void => {
    const { handleVisitAction } = this.props;
    handleVisitAction(visitId, action, true);
  };
}

export default withTranslation()(EventWithProfile);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 10,
  },
  name: {
    marginVertical: 8,
  },
  divider: {
    borderColor: theme.colors.darkTint10,
    marginVertical: 6,
  },
  title: {
    marginVertical: 10,
    marginHorizontal: 30,
  },
  list: {
    marginHorizontal: 12,
  },
});
