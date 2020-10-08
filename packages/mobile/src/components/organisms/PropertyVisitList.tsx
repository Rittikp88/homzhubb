import React, { Component } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Avatar, Button, Divider } from '@homzhub/common/src/components';
import { AddressWithVisitDetail } from '@homzhub/mobile/src/components/molecules/AddressWithVisitDetail';
import { visits } from '@homzhub/common/src/mocks/PropertyVisits';

// TODO: Move to Model
export enum VisitType {
  UPCOMING = 'Upcoming',
  MISSED = 'Missed',
  COMPLETED = 'Completed',
}

interface IProps {
  routeKey: VisitType;
}

class PropertyVisitList extends Component<IProps> {
  public render(): React.ReactNode {
    // TODO: Check with Map
    return <FlatList data={visits} renderItem={this.renderItem} />;
  }

  private renderItem = ({ item }: { item: any }): React.ReactElement => {
    const { asset, user, actions, start_date, end_date } = item;
    const { routeKey } = this.props;
    const isMissed = routeKey === VisitType.MISSED;
    const isCompleted = routeKey === VisitType.COMPLETED;
    const containerStyle = [styles.container, actions.length > 1 && styles.newVisit];
    return (
      <View style={styles.mainContainer}>
        <View style={containerStyle}>
          <Avatar fullName={user.full_name} designation="Tenant" rating={user.rating} />
          <AddressWithVisitDetail
            primaryAddress={asset.project_name}
            subAddress={asset.address}
            startDate={start_date}
            endDate={end_date}
            isMissedVisit={isMissed}
            isCompletedVisit={isCompleted}
          />
        </View>
        {routeKey === VisitType.UPCOMING && this.renderUpcomingView(item)}
      </View>
    );
  };

  private renderUpcomingView = (item: any): React.ReactElement => {
    const { actions, status } = item;
    const visitStatus = this.getVisitStatus(status);
    const containerStyle = [styles.container, actions.length > 1 && styles.newVisit];
    return (
      <>
        {actions.length > 1 && <Divider containerStyles={styles.dividerStyle} />}
        <View style={containerStyle}>
          <View style={styles.buttonView}>
            {actions.length < 2 && (
              <Button
                type="secondary"
                icon={visitStatus?.icon}
                iconColor={visitStatus?.color}
                iconSize={20}
                title={visitStatus?.title}
                containerStyle={styles.statusView}
                titleStyle={[styles.statusTitle, { color: visitStatus?.color }]}
              />
            )}
            {actions.map((action: string, index: number): React.ReactElement | null => {
              const data = this.getActions(action);
              if (!data) return null;
              return (
                <Button
                  key={index}
                  type="secondary"
                  icon={data.icon}
                  iconColor={data.color}
                  iconSize={20}
                  title={data.title}
                  containerStyle={styles.statusView}
                  titleStyle={[styles.actionTitle, { color: data.color }]}
                />
              );
            })}
          </View>
        </View>
      </>
    );
  };

  // TODO: Refactor once API integrate
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private getActions = (action: string) => {
    switch (action) {
      case 'Accept':
        return {
          title: 'Accept',
          color: theme.colors.green,
          icon: icons.circularCheckFilled,
        };
      case 'Reject':
        return {
          title: 'Reject',
          color: theme.colors.error,
          icon: icons.circularCrossFilled,
        };
      case 'Cancel':
        return {
          title: 'Cancel',
          color: theme.colors.error,
        };
      default:
        return null;
    }
  };

  // TODO: Refactor once API integrate
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private getVisitStatus = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return {
          title: 'Visit Scheduled',
          color: theme.colors.green,
          icon: icons.circularCheckFilled,
        };
      case 'CANCELLED':
        return {
          title: 'Visit Cancelled',
          color: theme.colors.error,
          icon: icons.circularCrossFilled,
        };
      case 'PENDING':
        return {
          title: 'Awaiting Confirmation...',
          color: theme.colors.darkTint3,
          icon: icons.watch,
        };
      default:
        return null;
    }
  };
}

export default PropertyVisitList;

const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 10,
    marginHorizontal: 16,
  },
  container: {
    borderWidth: 1,
    padding: 16,
    borderColor: theme.colors.darkTint10,
  },
  newVisit: {
    borderWidth: 0,
    backgroundColor: theme.colors.moreSeparator,
  },
  dividerStyle: {
    backgroundColor: theme.colors.background,
  },
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusView: {
    borderWidth: 0,
    flex: 0,
    flexDirection: 'row-reverse',
  },
  statusTitle: {
    marginVertical: 0,
    marginHorizontal: 8,
  },
  actionTitle: {
    marginVertical: 0,
    marginHorizontal: 16,
  },
});
